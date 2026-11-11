import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as StoreFrame } from "./router-qOGFp7_W.mjs";
import { n as sortSizes } from "./types-BRgm3dTf.mjs";
import { n as ProductCard, t as EmptyCollection } from "./product-card-B7ZkAY9X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/catalog-page-4zk2VxAQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CatalogPage({ kicker, title, intro, items }) {
	const [size, setSize] = (0, import_react.useState)("");
	const sizes = (0, import_react.useMemo)(() => {
		const labels = /* @__PURE__ */ new Set();
		for (const item of items) for (const row of item.sizes) labels.add(row.size);
		return sortSizes([...labels].map((label) => ({ size: label }))).map((row) => row.size);
	}, [items]);
	const visible = size ? items.filter((item) => item.sizes.some((row) => row.size === size && row.qty > 0)) : items;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "wrap py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: kicker
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 text-4xl font-extrabold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-muted",
				children: intro
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "size-btn",
					"data-on": size === "" ? "true" : "false",
					onClick: () => setSize(""),
					children: "كل المقاسات"
				}), sizes.map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "size-btn",
					"data-on": size === label ? "true" : "false",
					onClick: () => setSize(label),
					children: label
				}, label))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "عند اختيار مقاس تظهر فقط العبايات التي يتوفر فيها هذا المقاس فعلًا."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3",
				children: visible.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { item }, item.id))
			}),
			items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyCollection, { children: "لا توجد منتجات في هذا القسم بعد. تظهر هنا فور إضافتها من لوحة الإدارة." }) : null,
			items.length > 0 && visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(EmptyCollection, { children: [
				"لا توجد عباية متوفر فيها المقاس ",
				size,
				" حاليًا."
			] }) : null
		]
	}) });
}
//#endregion
export { CatalogPage as t };
