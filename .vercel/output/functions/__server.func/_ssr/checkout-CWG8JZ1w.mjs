import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as errorText } from "./errors-BPO1JEGf.mjs";
import { t as riyal } from "./money-B8UhdnUs.mjs";
import { O as getProductsByIds, c as StoreFrame, d as clearCart, f as readCart, j as placeOrder, l as useChrome } from "./router-qOGFp7_W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-CWG8JZ1w.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CheckoutPage() {
	const chrome = useChrome();
	const [lines, setLines] = (0, import_react.useState)(null);
	const [products, setProducts] = (0, import_react.useState)([]);
	const [fulfillment, setFulfillment] = (0, import_react.useState)("delivery");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [done, setDone] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const current = readCart();
		setLines(current);
		const ids = [...new Set(current.map((line) => line.productId))];
		if (ids.length) getProductsByIds({ data: { ids } }).then(setProducts).catch((err) => setError(errorText(err)));
	}, []);
	const subtotal = (lines ?? []).reduce((sum, line) => {
		const product = products.find((item) => item.id === line.productId);
		return sum + (product ? product.priceSar * line.qty : 0);
	}, 0);
	const fee = fulfillment === "delivery" ? chrome.deliveryBaseSar : 0;
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "wrap max-w-xl py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "تم استلام الطلب"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-4xl font-extrabold",
				children: done.number
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "panel mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "حُفظ الطلب في لوحة الإدارة، ولن يُحوَّل إلى واتساب." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2",
						children: ["الإجمالي ", riyal(done.totalSar)]
					}),
					done.feeIsEstimate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"رسوم التوصيل الحالية ",
							riyal(done.deliveryFeeSar),
							" تقدير أساسي، وقد تُعدَّل حسب بُعد الموقع قبل التأكيد."
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "الاستلام من المنزل مجاني."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: "الدفع عند الاستلام. الدفع الإلكتروني غير مفعّل بعد."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "btn-gold mt-6",
				children: "العودة للمتجر"
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "wrap max-w-xl py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "خطوة أخيرة"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-4xl font-extrabold",
				children: "إتمام الطلب"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "يمكنك الشراء كضيفة دون إنشاء حساب. الطلب يصل إلى إدارة حور."
			}),
			lines && lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "notice mt-6",
				children: ["السلة فارغة. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/women",
					children: "تصفحي العبايات"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "panel mt-6 grid gap-4",
				onSubmit: async (event) => {
					event.preventDefault();
					if (!lines?.length) return;
					const form = new FormData(event.currentTarget);
					setBusy(true);
					setError("");
					try {
						const result = await placeOrder({ data: {
							name: String(form.get("name") ?? ""),
							phone: String(form.get("phone") ?? ""),
							address: String(form.get("address") ?? ""),
							fulfillment,
							items: lines
						} });
						clearCart();
						setDone(result);
					} catch (err) {
						setError(errorText(err));
					} finally {
						setBusy(false);
					}
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: ["الاسم الكامل", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "name",
							required: true,
							minLength: 2
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: ["رقم التواصل", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							name: "phone",
							type: "tel",
							required: true,
							placeholder: "05xxxxxxxx"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: ["طريقة الاستلام", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							name: "fulfillment",
							value: fulfillment,
							onChange: (event) => setFulfillment(event.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: "delivery",
								children: ["توصيل داخل مكة — يبدأ من ", riyal(chrome.deliveryBaseSar)]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "pickup",
								children: "استلام من المنزل — مجاني"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: [fulfillment === "delivery" ? "الحي والعنوان داخل مكة" : "ملاحظة للاستلام (اختياري)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							name: "address",
							required: fulfillment === "delivery"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: ["طريقة الدفع", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							name: "payment",
							defaultValue: "cod",
							disabled: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "cod",
								children: "نقدًا عند الاستلام"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "notice",
						children: ["الدفع الإلكتروني غير مفعّل حاليًا، ولا توجد بوابة دفع وهمية. يمكن ربط بوابة لاحقًا بعد التأكد من متطلباتها.", fulfillment === "delivery" ? ` رسوم التوصيل الأساسية ${riyal(chrome.deliveryBaseSar)}، وقد تزيد حسب بُعد الموقع.` : " الاستلام من المنزل مجاني."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-bold",
						children: [
							"المنتجات ",
							riyal(subtotal),
							" · التوصيل ",
							riyal(fee),
							" · الإجمالي ",
							riyal(subtotal + fee)
						]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "danger",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn-gold",
						type: "submit",
						disabled: busy || !lines,
						children: busy ? "جارٍ حفظ الطلب…" : "تأكيد الطلب"
					})
				]
			})
		]
	}) });
}
//#endregion
export { CheckoutPage as component };
