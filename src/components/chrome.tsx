import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { cartCount, readCart, subscribeCart } from "@/lib/cart";
import type { ChromeData } from "@/lib/types";

const ChromeContext = createContext<ChromeData | null>(null);

export function ChromeProvider({ value, children }: { value: ChromeData; children: ReactNode }) {
  return <ChromeContext.Provider value={value}>{children}</ChromeContext.Provider>;
}

export function useChrome(): ChromeData {
  const value = useContext(ChromeContext);
  if (!value) {
    return { whatsapp: "", channels: [], deliveryBaseSar: 15, hasOwner: false };
  }
  return value;
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="grid h-11 w-11 place-items-center rounded-full border border-gold text-xl font-bold text-gold-deep">
        ح
      </span>
      <span className="leading-tight">
        <span className="block text-lg font-extrabold">حور</span>
        <span className="block text-xs tracking-widest text-gold-deep">HOUR ABAYAS</span>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    const sync = () => setCount(cartCount(readCart()));
    sync();
    return subscribeCart(sync);
  }, []);

  const links = (
    <>
      <Link to="/women" className="nav-link" onClick={() => setOpen(false)}>
        عبايات النساء
      </Link>
      <Link to="/kids" className="nav-link" onClick={() => setOpen(false)}>
        عبايات الأطفال
      </Link>
    </>
  );

  return (
    <header className="site-header">
      <div className="wrap flex h-20 items-center justify-between gap-4">
        <Brand />
        <nav className="desk-nav flex items-center gap-6 text-sm font-semibold">{links}</nav>
        <div className="flex items-center gap-2">
          <Link to="/cart" className="btn-line">
            <ShoppingBag className="size-4" aria-hidden="true" />
            السلة
            <b className="grid h-6 min-w-6 place-items-center bg-ink px-1 text-xs text-paper">{count}</b>
          </Link>
          <button
            type="button"
            className="btn-line menu-btn px-3"
            aria-expanded={open}
            aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="menu-panel wrap flex flex-col gap-1 pb-4 text-base font-semibold">{links}</nav>
      ) : null}
    </header>
  );
}

export function Footer() {
  const chrome = useChrome();
  return (
    <footer className="mt-20 bg-ink text-paper">
      <div className="wrap grid gap-8 py-12 md:grid-cols-3">
        <div>
          <p className="text-2xl font-extrabold">حور</p>
          <p className="mt-1 text-xs tracking-[0.2em] text-gold">HOUR ABAYAS</p>
          <p className="mt-4 text-gold">أناقة .. بكل تفاصيلها</p>
          <p className="mt-3 text-sm text-paper/80">
            عبايات نساء وأطفال تُصنع محليًا في مكة المكرمة. التوصيل داخل مكة، والاستلام من المنزل مجاني.
          </p>
        </div>
        <div>
          <p className="font-bold">التسوق</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-paper/85">
            <Link to="/women">عبايات النساء</Link>
            <Link to="/kids">عبايات الأطفال</Link>
            <Link to="/cart">سلة المشتريات</Link>
          </div>
        </div>
        <div>
          <p className="font-bold">التواصل</p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            {chrome.whatsapp ? (
              <a href={chrome.whatsapp} target="_blank" rel="noreferrer">
                واتساب
              </a>
            ) : null}
            {chrome.channels.map((channel) => (
              <a key={channel.url + channel.label} href={channel.url} target="_blank" rel="noreferrer">
                {channel.label}
              </a>
            ))}
            {!chrome.whatsapp && chrome.channels.length === 0 ? (
              <p className="text-paper/70">روابط واتساب والقنوات تُضاف من لوحة الإدارة، ولا تُعرض روابط غير حقيقية.</p>
            ) : null}
          </div>
        </div>
      </div>
      <div className="border-t border-paper/15">
        <div className="wrap flex flex-wrap items-center justify-between gap-3 py-4 text-xs text-paper/60">
          <span>© حور | HOUR ABAYAS</span>
          <Link to="/admin">إدارة المتجر</Link>
        </div>
      </div>
    </footer>
  );
}

export function StoreFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
