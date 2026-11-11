import { C as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as riyal } from "./money-B8UhdnUs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-card-B7ZkAY9X.js
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ item }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/product/$id",
			params: { id: item.id },
			className: "block",
			children: item.cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: item.cover,
				alt: item.name
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "ph",
				role: "img",
				"aria-label": "بانتظار صورة المنتج",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["ح", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mt-2 block text-xs font-medium tracking-normal text-muted",
					children: "بانتظار الصورة"
				})] })
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-3 p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-bold",
					children: item.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "price",
					children: riyal(item.priceSar)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/product/$id",
					params: { id: item.id },
					className: "btn-line mt-auto",
					children: "عرض التفاصيل"
				})
			]
		})]
	});
}
function EmptyCollection({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "notice",
		children
	});
}
//#endregion
export { ProductCard as n, EmptyCollection as t };
