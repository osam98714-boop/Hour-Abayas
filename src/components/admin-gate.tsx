import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { claimStore, getMyAccess } from "@/lib/store.functions";
import { errorText } from "@/lib/errors";

const LINKS = [
  { to: "/admin", label: "نظرة عامة" },
  { to: "/admin/products", label: "المنتجات" },
  { to: "/admin/orders", label: "الطلبات" },
  { to: "/admin/links", label: "التواصل" },
] as const;

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, isPending } = useCurrentUserState();
  const [access, setAccess] = useState<{ isAdmin: boolean; hasOwner: boolean } | null>(null);
  const [error, setError] = useState("");
  const [claiming, setClaiming] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getMyAccess()
      .then((next) => {
        if (!cancelled) setAccess(next);
      })
      .catch((err) => {
        if (!cancelled) setError(errorText(err));
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  if (isPending || (user && !access && !error)) {
    return <p className="wrap py-16">جارٍ التحقق من صلاحية الإدارة…</p>;
  }
  if (!user) return <RedirectToSignIn to="/login" />;
  if (!access?.isAdmin) {
    return (
      <div className="wrap max-w-lg py-16">
        <h1 className="text-3xl font-extrabold">لوحة حور</h1>
        {access?.hasOwner ? (
          <p className="mt-4">هذا الحساب ليس مالك المتجر. الطلبات والمنتجات غير ظاهرة له.</p>
        ) : (
          <>
            <p className="mt-4">لا يوجد مالك بعد. أول حساب يثبّت الملكية يصبح الوحيد الذي يرى الطلبات ويعدّل المنتجات.</p>
            <button
              type="button"
              className="btn-gold mt-5"
              disabled={claiming}
              onClick={() => {
                setClaiming(true);
                claimStore()
                  .then(() => setAccess({ isAdmin: true, hasOwner: true }))
                  .catch((err) => setError(errorText(err)))
                  .finally(() => setClaiming(false));
              }}
            >
              {claiming ? "جارٍ التثبيت…" : "تثبيت هذا الحساب كمالك"}
            </button>
          </>
        )}
        {error ? <p className="danger mt-4">{error}</p> : null}
        <div className="mt-6">
          <UserButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-line bg-paper">
        <div className="wrap flex h-16 items-center justify-between gap-3">
          <Link to="/" className="font-extrabold">
            حور · الإدارة
          </Link>
          <UserButton />
        </div>
      </header>
      <div className="admin-body wrap grid gap-6 py-6 md:grid-cols-[13rem_1fr]">
        <nav className="admin-nav flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {LINKS.map((link) => {
            const on = link.to === "/admin" ? pathname === "/admin" : pathname.startsWith(link.to);
            return (
              <Link key={link.to} to={link.to} data-on={on ? "true" : "false"}>
                {link.label}
              </Link>
            );
          })}
          <Link to="/">عرض المتجر</Link>
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}
