import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-IWHfIGH2.mjs";
import { t as GROK_PROVIDERS } from "./server-BCsOmMwp.mjs";
import { t as errorText } from "./errors-BPO1JEGf.mjs";
import { c as StoreFrame } from "./router-qOGFp7_W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-msiB8Wdt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const [mode, setMode] = (0, import_react.useState)("in");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "wrap max-w-md py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "لوحة الإدارة"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-4xl font-extrabold",
				children: "دخول المالك"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "العميلات يتسوقن بدون حساب. هذا الدخول لإدارة المنتجات والطلبات فقط. أول حساب يثبّت الملكية يصبح مالك المتجر."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-2",
				children: GROK_PROVIDERS.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "btn-ink",
					onClick: () => {
						signIn(provider.providerId, { callbackURL: "/admin" }).catch((err) => setError(errorText(err)));
					},
					children: ["المتابعة عبر ", provider.label === "X" ? "X" : "Google"]
				}, provider.providerId))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "panel mt-6 grid gap-4",
				onSubmit: async (event) => {
					event.preventDefault();
					const form = new FormData(event.currentTarget);
					const email = String(form.get("email") ?? "");
					const password = String(form.get("password") ?? "");
					const name = String(form.get("name") ?? "مالك حور");
					setBusy(true);
					setError("");
					try {
						const result = mode === "up" ? await authClient.signUp.email({
							email,
							password,
							name,
							callbackURL: "/admin"
						}) : await authClient.signIn.email({
							email,
							password,
							callbackURL: "/admin"
						});
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
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: mode === "in" ? "btn-ink" : "btn-line",
							onClick: () => setMode("in"),
							children: "دخول"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: mode === "up" ? "btn-ink" : "btn-line",
							onClick: () => setMode("up"),
							children: "حساب جديد"
						})]
					}),
					mode === "up" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: ["الاسم", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "name",
							defaultValue: "مالك حور"
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: ["البريد", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "email",
							type: "email",
							required: true,
							autoComplete: "username"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: ["كلمة المرور", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "password",
							type: "password",
							required: true,
							minLength: 8,
							autoComplete: mode === "up" ? "new-password" : "current-password"
						})]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn-gold",
						disabled: busy,
						type: "submit",
						children: busy ? "جارٍ التحقق…" : mode === "up" ? "إنشاء الحساب" : "دخول بالبريد"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "كلمة المرور ٨ أحرف على الأقل. بعد الدخول ثبّتي الملكية من لوحة الإدارة إن كانت أول مرة."
					})
				]
			})
		]
	}) });
}
//#endregion
export { LoginPage as component };
