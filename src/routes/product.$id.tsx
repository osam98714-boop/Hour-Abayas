import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreFrame } from "@/components/chrome";
import { addReview, getProduct } from "@/lib/store.functions";
import { addToCart } from "@/lib/cart";
import { errorText } from "@/lib/errors";
import { compressImage } from "@/lib/images";
import { riyal } from "@/lib/money";
import { sortSizes } from "@/lib/types";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => getProduct({ data: { id: params.id } }),
  head: () => ({ meta: [{ title: "تفاصيل العباية | حور" }] }),
  component: ProductPage,
});

function ProductPage() {
  const initial = Route.useLoaderData();
  const { id } = Route.useParams();
  const [product, setProduct] = useState(initial);
  const [photo, setPhoto] = useState(0);
  const sizes = product ? sortSizes(product.sizes) : [];
  const firstInStock = sizes.find((size) => size.qty > 0)?.size ?? "";
  const [selected, setSelected] = useState(firstInStock);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setProduct(initial);
    setPhoto(0);
    setNote("");
    setError("");
    const nextSizes = initial ? sortSizes(initial.sizes) : [];
    setSelected(nextSizes.find((size) => size.qty > 0)?.size ?? "");
  }, [initial]);

  if (!product) {
    return (
      <StoreFrame>
        <div className="wrap py-16">
          <div className="notice">هذا المنتج غير موجود أو حُذف.</div>
          <Link to="/" className="btn-line mt-4">
            العودة للرئيسية
          </Link>
        </div>
      </StoreFrame>
    );
  }

  const current = sizes.find((size) => size.size === selected);
  const soldOut = sizes.every((size) => size.qty === 0);

  return (
    <StoreFrame>
      <div className="wrap py-8">
        <p className="text-sm text-muted">
          <Link to="/">الرئيسية</Link>
          <span> / </span>
          <Link to={product.category === "women" ? "/women" : "/kids"}>
            {product.category === "women" ? "عبايات النساء" : "عبايات الأطفال"}
          </Link>
        </p>
        <div className="split mt-6 grid items-start gap-8 md:grid-cols-2">
          <div>
            {product.images.length ? (
              <img src={product.images[photo]?.dataUrl} alt={product.name} className="w-full bg-cream object-cover" />
            ) : (
              <div className="ph text-6xl">ح</div>
            )}
            {product.images.length > 1 ? (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button key={image.id} type="button" onClick={() => setPhoto(index)} className="shrink-0">
                    <img src={image.dataUrl} alt="" className={index === photo ? "thumb thumb-on" : "thumb"} />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <div>
            <p className="eyebrow">HOUR ABAYAS</p>
            <h1 className="mt-2 text-4xl font-extrabold">{product.name}</h1>
            <p className="price mt-3 text-2xl">{riyal(product.priceSar)}</p>
            <p className="mt-4 leading-relaxed">{product.description || "لا يوجد وصف مضاف بعد."}</p>
            <dl className="mt-5 grid gap-2 text-sm">
              <Detail label="القماش" value={product.fabric} />
              <Detail label="التطريز" value={product.embroidery} />
              <Detail label="الأحجار" value={product.stones} />
              <Detail label="تفاصيل أخرى" value={product.details} />
            </dl>
            <p className="mt-6 font-bold">المقاس</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size.size}
                  type="button"
                  className="size-btn"
                  disabled={size.qty < 1}
                  data-on={selected === size.size ? "true" : "false"}
                  onClick={() => {
                    setSelected(size.size);
                    setNote("");
                    setError("");
                  }}
                >
                  {size.size}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-muted">
              {soldOut
                ? "نفدت جميع المقاسات."
                : current && current.qty > 0
                  ? current.qty <= 3
                    ? `متبقي ${current.qty} من مقاس ${current.size}`
                    : `مقاس ${current.size} متوفر`
                  : "المقاسات المشطوب عليها غير متوفرة ولا تُضاف إلى السلة."}
            </p>
            <button
              type="button"
              className="btn-gold mt-5"
              disabled={!current || current.qty < 1}
              onClick={() => {
                if (!current || current.qty < 1) {
                  setError("اختاري مقاسًا متوفرًا");
                  return;
                }
                const result = addToCart({ productId: product.id, size: current.size, qty: 1 }, current.qty);
                setError(result.ok ? "" : result.message);
                setNote(result.ok ? "أُضيفت العباية إلى السلة" : "");
              }}
            >
              أضيفي إلى السلة
            </button>
            {note ? <p className="mt-3 text-sm font-semibold">{note}</p> : null}
            {error ? <p className="danger mt-3">{error}</p> : null}
            <p className="mt-4 text-sm text-muted">الدفع الإلكتروني غير مفعّل. إتمام الطلب يحفظه للإدارة، والدفع عند الاستلام.</p>
          </div>
        </div>
        <Reviews
          productId={id}
          reviews={product.reviews}
          onAdded={async () => {
            const next = await getProduct({ data: { id } });
            if (next) setProduct(next);
          }}
        />
      </div>
    </StoreFrame>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-2 border-b border-line py-2">
      <dt className="text-muted">{label}</dt>
      <dd>{value || "—"}</dd>
    </div>
  );
}

function Reviews({
  productId,
  reviews,
  onAdded,
}: {
  productId: string;
  reviews: { id: string; authorName: string; rating: number; body: string; createdAt: string; images: string[] }[];
  onAdded: () => Promise<void>;
}) {
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  return (
    <section className="mt-14">
      <h2 className="text-2xl font-extrabold">تقييمات العميلات</h2>
      <div className="mt-4 grid gap-4">
        {reviews.length === 0 ? <div className="notice">لا توجد تقييمات بعد. أول تجربة موثّقة تظهر هنا.</div> : null}
        {reviews.map((review) => (
          <article key={review.id} className="panel">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <b>{review.authorName}</b>
              <span className="text-gold-deep">{review.rating} من 5</span>
            </div>
            {review.body ? <p className="mt-2">{review.body}</p> : null}
            {review.images.length ? (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {review.images.map((src) => (
                  <img key={src.slice(0, 48)} src={src} alt="" className="h-24 w-20 object-cover" />
                ))}
              </div>
            ) : null}
          </article>
        ))}
      </div>
      <form
        className="panel mt-6 grid gap-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          setError("");
          setMessage("");
          try {
            await addReview({ data: { productId, authorName, rating, body, images } });
            setAuthorName("");
            setBody("");
            setImages([]);
            setRating(5);
            setMessage("شكرًا، نُشر تقييمكِ.");
            await onAdded();
          } catch (err) {
            setError(errorText(err));
          } finally {
            setBusy(false);
          }
        }}
      >
        <h3 className="text-lg font-bold">أضيفي تقييمًا</h3>
        <label className="field">
          الاسم
          <input value={authorName} onChange={(event) => setAuthorName(event.target.value)} required minLength={2} />
        </label>
        <label className="field">
          التقييم
          <select value={rating} onChange={(event) => setRating(Number(event.target.value))}>
            {[5, 4, 3, 2, 1].map((value) => (
              <option key={value} value={value}>
                {value} من 5
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          التعليق
          <textarea value={body} onChange={(event) => setBody(event.target.value)} />
        </label>
        <label className="field">
          صور التجربة (حتى ٤)
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={async (event) => {
              const files = [...(event.target.files ?? [])].slice(0, 4);
              try {
                const next = await Promise.all(files.map((file) => compressImage(file)));
                setImages(next);
              } catch (err) {
                setError(errorText(err));
              }
            }}
          />
        </label>
        {error ? <p className="danger">{error}</p> : null}
        {message ? <p className="text-sm font-semibold">{message}</p> : null}
        <button className="btn-ink" disabled={busy} type="submit">
          {busy ? "جارٍ النشر…" : "نشر التقييم"}
        </button>
      </form>
    </section>
  );
}
