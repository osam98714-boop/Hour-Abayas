import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  addProductImage,
  createProduct,
  deleteProductImage,
  deleteReview,
  updateProduct,
} from "@/lib/store.functions";
import { errorText } from "@/lib/errors";
import { compressImage } from "@/lib/images";
import type { Category, ProductDetail, SizeStock } from "@/lib/types";

const QUICK = ["S", "M", "L", "XL", "XXL", "4", "6", "8", "10", "12"];

export function ProductForm({ initial }: { initial?: ProductDetail }) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<Category>(initial?.category ?? "women");
  const [priceSar, setPriceSar] = useState(initial?.priceSar?.toString() ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [fabric, setFabric] = useState(initial?.fabric ?? "");
  const [embroidery, setEmbroidery] = useState(initial?.embroidery ?? "");
  const [stones, setStones] = useState(initial?.stones ?? "");
  const [details, setDetails] = useState(initial?.details ?? "");
  const [sizes, setSizes] = useState<SizeStock[]>(initial?.sizes.length ? initial.sizes : [{ size: "M", qty: 0 }]);
  const [images, setImages] = useState(initial?.images ?? []);
  const [pending, setPending] = useState<string[]>([]);
  const [reviews, setReviews] = useState(initial?.reviews ?? []);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  function addSize(size = "") {
    setSizes((rows) => [...rows, { size, qty: 0 }]);
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError("");
        const payload = {
          name,
          category,
          priceSar: Number(priceSar),
          description,
          fabric,
          embroidery,
          stones,
          details,
          sizes: sizes.map((row) => ({ size: row.size.trim(), qty: Number(row.qty) })),
        };
        try {
          const saved = initial
            ? await updateProduct({ data: { ...payload, id: initial.id } })
            : await createProduct({ data: payload });
          for (let index = 0; index < pending.length; index += 1) {
            setProgress(`رفع الصورة ${index + 1} من ${pending.length}`);
            await addProductImage({ data: { productId: saved.id, dataUrl: pending[index] } });
          }
          setPending([]);
          setProgress("");
          await router.invalidate();
          if (!initial) {
            window.location.href = `/admin/products/${saved.id}`;
            return;
          }
          setProgress("تم حفظ المنتج");
        } catch (err) {
          setError(errorText(err));
          setProgress("");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label className="field">
        اسم العباية
        <input value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="field">
          القسم
          <select value={category} onChange={(event) => setCategory(event.target.value as Category)}>
            <option value="women">نساء</option>
            <option value="kids">أطفال</option>
          </select>
        </label>
        <label className="field">
          السعر بالريال
          <input value={priceSar} onChange={(event) => setPriceSar(event.target.value)} type="number" min={1} required />
        </label>
      </div>
      <label className="field">
        الوصف
        <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="field">
          القماش
          <input value={fabric} onChange={(event) => setFabric(event.target.value)} />
        </label>
        <label className="field">
          التطريز
          <input value={embroidery} onChange={(event) => setEmbroidery(event.target.value)} />
        </label>
        <label className="field">
          الأحجار
          <input value={stones} onChange={(event) => setStones(event.target.value)} />
        </label>
        <label className="field">
          تفاصيل أخرى
          <input value={details} onChange={(event) => setDetails(event.target.value)} />
        </label>
      </div>
      <fieldset className="panel grid gap-3">
        <legend className="font-bold">مخزون كل مقاس</legend>
        <div className="flex flex-wrap gap-2">
          {QUICK.map((size) => (
            <button
              key={size}
              type="button"
              className="size-btn"
              onClick={() => {
                if (sizes.some((row) => row.size.toUpperCase() === size)) return;
                addSize(size);
              }}
            >
              {size}
            </button>
          ))}
          <button type="button" className="btn-line" onClick={() => addSize("")}>
            مقاس آخر
          </button>
        </div>
        {sizes.map((row, index) => (
          <div key={`${row.size}-${index}`} className="grid grid-cols-[1fr_8rem_auto] gap-2">
            <input
              className="border border-line px-3"
              value={row.size}
              aria-label="المقاس"
              onChange={(event) =>
                setSizes((rows) => rows.map((item, i) => (i === index ? { ...item, size: event.target.value } : item)))
              }
            />
            <input
              className="border border-line px-3"
              type="number"
              min={0}
              aria-label="الكمية"
              value={row.qty}
              onChange={(event) =>
                setSizes((rows) =>
                  rows.map((item, i) => (i === index ? { ...item, qty: Number(event.target.value) } : item)),
                )
              }
            />
            <button
              type="button"
              className="btn-line"
              onClick={() => setSizes((rows) => rows.filter((_, i) => i !== index))}
            >
              حذف
            </button>
          </div>
        ))}
        <p className="text-sm text-muted">كل مقاس له كمية مستقلة. الكمية صفر تعني أن المقاس يظهر للعميلة لكنه غير قابل للإضافة.</p>
      </fieldset>
      <fieldset className="panel grid gap-3">
        <legend className="font-bold">الصور</legend>
        <div className="flex flex-wrap gap-2">
          {images.map((image) => (
            <div key={image.id} className="relative">
              <img src={image.dataUrl} alt="" className="h-28 w-20 object-cover" />
              <button
                type="button"
                className="btn-line mt-1 w-full"
                onClick={async () => {
                  try {
                    await deleteProductImage({ data: { id: image.id } });
                    setImages((rows) => rows.filter((item) => item.id !== image.id));
                  } catch (err) {
                    setError(errorText(err));
                  }
                }}
              >
                حذف
              </button>
            </div>
          ))}
          {pending.map((src, index) => (
            <img key={src.slice(20, 40) + index} src={src} alt="" className="h-28 w-20 object-cover" />
          ))}
        </div>
        <label className="field">
          إضافة صور (يمكن أكثر من ١٥، والحد ٢٤)
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={async (event) => {
              const files = [...(event.target.files ?? [])];
              try {
                const next = await Promise.all(files.map((file) => compressImage(file)));
                setPending((rows) => [...rows, ...next].slice(0, 24));
              } catch (err) {
                setError(errorText(err));
              }
              event.target.value = "";
            }}
          />
        </label>
      </fieldset>
      {initial && reviews.length ? (
        <fieldset className="panel grid gap-3">
          <legend className="font-bold">تقييمات هذا المنتج</legend>
          {reviews.map((review) => (
            <div key={review.id} className="flex items-start justify-between gap-3">
              <p>
                <b>{review.authorName}</b> · {review.rating}/5
                <span className="mt-1 block text-sm text-muted">{review.body}</span>
              </p>
              <button
                type="button"
                className="btn-line"
                onClick={async () => {
                  await deleteReview({ data: { id: review.id } });
                  setReviews((rows) => rows.filter((item) => item.id !== review.id));
                }}
              >
                حذف
              </button>
            </div>
          ))}
        </fieldset>
      ) : null}
      {error ? <p className="danger">{error}</p> : null}
      {progress ? <p className="text-sm">{progress}</p> : null}
      <button className="btn-gold" disabled={busy} type="submit">
        {busy ? "جارٍ الحفظ…" : initial ? "حفظ التعديل" : "حفظ المنتج"}
      </button>
    </form>
  );
}
