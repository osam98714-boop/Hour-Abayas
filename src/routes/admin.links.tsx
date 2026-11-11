import { useEffect, useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { getChrome, saveLinks } from "@/lib/store.functions";
import { errorText } from "@/lib/errors";
import type { Channel } from "@/lib/types";

export const Route = createFileRoute("/admin/links")({
  component: LinksPage,
});

function LinksPage() {
  const router = useRouter();
  const [whatsapp, setWhatsapp] = useState("");
  const [channels, setChannels] = useState<Channel[]>([]);
  const [deliveryBaseSar, setDeliveryBaseSar] = useState("15");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getChrome()
      .then((chrome) => {
        setWhatsapp(chrome.whatsapp);
        setChannels(chrome.channels);
        setDeliveryBaseSar(String(chrome.deliveryBaseSar));
      })
      .catch((err) => setError(errorText(err)));
  }, []);

  return (
    <form
      className="grid gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError("");
        setMessage("");
        try {
          await saveLinks({
            data: {
              whatsapp,
              channels: channels.filter((channel) => channel.label.trim() && channel.url.trim()),
              deliveryBaseSar: Number(deliveryBaseSar),
            },
          });
          setMessage("تم حفظ الروابط. تظهر في تذييل المتجر.");
          await router.invalidate();
        } catch (err) {
          setError(errorText(err));
        } finally {
          setBusy(false);
        }
      }}
    >
      <div>
        <h1 className="text-3xl font-extrabold">روابط التواصل</h1>
        <p className="mt-2 text-sm text-muted">واتساب، مجموعات، وأي قناة أخرى. لن يُعرض رابط لم تضيفيه.</p>
      </div>
      <label className="field">
        واتساب (رقم أو رابط wa.me / مجموعة)
        <input value={whatsapp} onChange={(event) => setWhatsapp(event.target.value)} placeholder="05xxxxxxxx" />
      </label>
      <div className="grid gap-3">
        {channels.map((channel, index) => (
          <div key={index} className="grid gap-2 md:grid-cols-[1fr_1.4fr_auto]">
            <input
              className="border border-line bg-white px-3"
              value={channel.label}
              placeholder="اسم القناة"
              onChange={(event) =>
                setChannels((rows) => rows.map((row, i) => (i === index ? { ...row, label: event.target.value } : row)))
              }
            />
            <input
              className="border border-line bg-white px-3"
              value={channel.url}
              placeholder="https://"
              onChange={(event) =>
                setChannels((rows) => rows.map((row, i) => (i === index ? { ...row, url: event.target.value } : row)))
              }
            />
            <button type="button" className="btn-line" onClick={() => setChannels((rows) => rows.filter((_, i) => i !== index))}>
              حذف
            </button>
          </div>
        ))}
        <button type="button" className="btn-line" onClick={() => setChannels((rows) => [...rows, { label: "", url: "" }])}>
          إضافة قناة أو مجموعة
        </button>
      </div>
      <label className="field">
        سعر التوصيل الأساسي داخل مكة
        <input
          type="number"
          min={0}
          max={500}
          value={deliveryBaseSar}
          onChange={(event) => setDeliveryBaseSar(event.target.value)}
        />
      </label>
      <p className="text-sm text-muted">هذا السعر الأساسي. يمكن رفعه لكل طلب حسب بعد الحي من صفحة الطلب. الاستلام من المنزل يبقى مجانيًا.</p>
      {error ? <p className="danger">{error}</p> : null}
      {message ? <p className="text-sm font-semibold">{message}</p> : null}
      <button className="btn-gold" disabled={busy} type="submit">
        {busy ? "جارٍ الحفظ…" : "حفظ الروابط"}
      </button>
    </form>
  );
}
