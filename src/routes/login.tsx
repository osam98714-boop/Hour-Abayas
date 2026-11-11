import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { StoreFrame } from "@/components/chrome";
import { GROK_PROVIDERS, authClient, signIn } from "@/lib/auth/client";
import { errorText } from "@/lib/errors";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "دخول الإدارة | حور" }] }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"in" | "up">("in");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <StoreFrame>
      <div className="wrap max-w-md py-12">
        <p className="eyebrow">لوحة الإدارة</p>
        <h1 className="mt-2 text-4xl font-extrabold">دخول المالك</h1>
        <p className="mt-3 text-sm text-muted">
          العميلات يتسوقن بدون حساب. هذا الدخول لإدارة المنتجات والطلبات فقط. أول حساب يثبّت الملكية يصبح مالك المتجر.
        </p>
        <div className="mt-6 grid gap-2">
          {GROK_PROVIDERS.map((provider) => (
            <button
              key={provider.providerId}
              type="button"
              className="btn-ink"
              onClick={() => {
                void signIn(provider.providerId, { callbackURL: "/admin" }).catch((err) => setError(errorText(err)));
              }}
            >
              المتابعة عبر {provider.label === "X" ? "X" : "Google"}
            </button>
          ))}
        </div>
        <form
          className="panel mt-6 grid gap-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const email = String(form.get("email") ?? "");
            const password = String(form.get("password") ?? "");
            const name = String(form.get("name") ?? "مالك حور");
            setBusy(true);
            setError("");
            try {
              const result =
                mode === "up"
                  ? await authClient.signUp.email({ email, password, name, callbackURL: "/admin" })
                  : await authClient.signIn.email({ email, password, callbackURL: "/admin" });
              if (result.error) {
                setError(result.error.message ?? "تعذّر الدخول");
                return;
              }
              window.location.href = "/admin";
            } catch (err) {
              setError(errorText(err));
            } finally {
              setBusy(false);
            }
          }}
        >
          <div className="flex gap-2">
            <button type="button" className={mode === "in" ? "btn-ink" : "btn-line"} onClick={() => setMode("in")}>
              دخول
            </button>
            <button type="button" className={mode === "up" ? "btn-ink" : "btn-line"} onClick={() => setMode("up")}>
              حساب جديد
            </button>
          </div>
          {mode === "up" ? (
            <label className="field">
              الاسم
              <input name="name" defaultValue="مالك حور" />
            </label>
          ) : null}
          <label className="field">
            البريد
            <input name="email" type="email" required autoComplete="username" />
          </label>
          <label className="field">
            كلمة المرور
            <input name="password" type="password" required minLength={8} autoComplete={mode === "up" ? "new-password" : "current-password"} />
          </label>
          {error ? <p className="danger">{error}</p> : null}
          <button className="btn-gold" disabled={busy} type="submit">
            {busy ? "جارٍ التحقق…" : mode === "up" ? "إنشاء الحساب" : "دخول بالبريد"}
          </button>
          <p className="text-sm text-muted">كلمة المرور ٨ أحرف على الأقل. بعد الدخول ثبّتي الملكية من لوحة الإدارة إن كانت أول مرة.</p>
        </form>
      </div>
    </StoreFrame>
  );
}
