import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as errorText } from "./errors-BPO1JEGf.mjs";
import { t as riyal } from "./money-B8UhdnUs.mjs";
import { O as getProductsByIds, c as StoreFrame, f as readCart, h as subscribeCart, m as setLineQty, p as removeLine } from "./router-qOGFp7_W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-uD2daCA2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CartPage() {
	const [lines, setLines] = (0, import_react.useState)(null);
	const [products, setProducts] = (0, import_react.useState)([]);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const sync = () => setLines(readCart());
		sync();
		return subscribeCart(sync);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!lines) return;
		const ids = [...new Set(lines.map((line) => line.productId))];
		if (!ids.length) {
			setProducts([]);
			return;
		}
		getProductsByIds({ data: { ids } }).then(setProducts).catch((err) => setError(errorText(err)));
	}, [lines]);
	const ready = lines ?? [];
	let subtotal = 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "wrap py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "مشترياتكِ"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-4xl font-extrabold",
				children: "سلة المشتريات"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "السلة تبقى على هذا الجهاز حتى إتمام الطلب. الطلب نفسه يُحفظ للمتجر."
			}),
			lines === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8",
				children: "جارٍ فتح السلة…"
			}) : null,
			lines && ready.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "notice mt-8",
				children: ["سلتك فارغة.", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/women",
						className: "btn-line",
						children: "عبايات النساء"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/kids",
						className: "btn-line",
						children: "عبايات الأطفال"
					})]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-3",
				children: ready.map((line) => {
					const product = products.find((item) => item.id === line.productId);
					const stock = product?.sizes.find((size) => size.size === line.size)?.qty ?? 0;
					if (product) subtotal += product.priceSar * line.qty;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "panel flex flex-wrap items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: product?.name ?? "منتج لم يعد متاحًا" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								"المقاس ",
								line.size,
								product ? ` · ${riyal(product.priceSar)}` : ""
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "size-btn",
									onClick: () => {
										const result = setLineQty(line.productId, line.size, line.qty - 1, stock);
										setError(result.ok ? "" : result.message);
									},
									children: "−"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "min-w-8 text-center font-bold tabular-nums",
									children: line.qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "size-btn",
									onClick: () => {
										const result = setLineQty(line.productId, line.size, line.qty + 1, stock);
										setError(result.ok ? "" : result.message);
									},
									children: "+"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "btn-line",
									onClick: () => removeLine(line.productId, line.size),
									children: "حذف"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
									className: "price",
									children: product ? riyal(product.priceSar * line.qty) : ""
								})
							]
						})]
					}, `${line.productId}-${line.size}`);
				})
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "danger mt-4",
				children: error
			}) : null,
			ready.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xl font-extrabold",
						children: ["المجموع ", riyal(subtotal)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "رسوم التوصيل تُحسب في إتمام الطلب، وتبدأ من السعر الأساسي داخل مكة."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/checkout",
						className: "btn-gold mt-4",
						children: "إتمام الطلب"
					})
				]
			}) : null
		]
	}) });
}
//#endregion
export { CartPage as component };
