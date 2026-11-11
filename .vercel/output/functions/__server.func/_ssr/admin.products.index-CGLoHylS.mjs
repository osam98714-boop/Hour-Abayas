import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, S as useRouter, X as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as errorText } from "./errors-BPO1JEGf.mjs";
import { t as riyal } from "./money-B8UhdnUs.mjs";
import { b as deleteProduct, k as listAdminProducts } from "./router-qOGFp7_W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products.index-CGLoHylS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductsPage() {
	const router = useRouter();
	const [items, setItems] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	function load() {
		listAdminProducts().then(setItems).catch((err) => setError(errorText(err)));
	}
	(0, import_react.useEffect)(() => {
		load();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-extrabold",
				children: "المنتجات"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/products/new",
				className: "btn-gold",
				children: "منتج جديد"
			})]
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "danger mt-4",
			children: error
		}) : null,
		items && items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "notice mt-6",
			children: "لا توجد منتجات بعد. أضيفي أول عباية حقيقية عندما تكون صورها وتفاصيلها جاهزة."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-3",
			children: (items ?? []).map((item) => {
				const stock = item.sizes.reduce((sum, size) => sum + size.qty, 0);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "panel flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: item.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							item.category === "women" ? "نساء" : "أطفال",
							" · ",
							riyal(item.priceSar),
							" · المخزون ",
							stock
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/admin/products/$id",
							params: { id: item.id },
							className: "btn-line",
							children: "تعديل"
						}), pendingDelete === item.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn-ink",
							onClick: async () => {
								await deleteProduct({ data: { id: item.id } });
								setPendingDelete(null);
								await router.invalidate();
								load();
							},
							children: "تأكيد الحذف"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn-line",
							onClick: () => setPendingDelete(item.id),
							children: "حذف"
						})]
					})]
				}, item.id);
			})
		})
	] });
}
//#endregion
export { ProductsPage as component };
