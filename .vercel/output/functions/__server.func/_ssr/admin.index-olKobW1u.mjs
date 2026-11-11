import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as errorText } from "./errors-BPO1JEGf.mjs";
import { t as riyal } from "./money-B8UhdnUs.mjs";
import { E as getOverview } from "./router-qOGFp7_W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-olKobW1u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OverviewPage() {
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		getOverview().then(setData).catch((err) => setError(errorText(err)));
	}, []);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "danger",
		children: error
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "جارٍ تحميل النظرة العامة…" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl font-extrabold",
			children: "نظرة عامة"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "أرقام المنتجات والطلبات المحفوظة في قاعدة المتجر، وليست بيانات تجريبية."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "المنتجات",
					value: String(data.products)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "عبايات النساء",
					value: String(data.women)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "عبايات الأطفال",
					value: String(data.kids)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "الطلبات",
					value: String(data.orders)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "طلبات جديدة",
					value: String(data.newOrders)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "مبيعات غير الملغاة",
					value: riyal(data.salesSar)
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "panel mt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-bold",
					children: "مقاسات قاربت على النفاد"
				}),
				data.lowStock.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "لا توجد مقاسات كميتها ٢ أو أقل."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 grid gap-2 text-sm",
					children: data.lowStock.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						row.productName,
						" · ",
						row.size,
						" · المتبقي ",
						row.qty
					] }, `${row.productName}-${row.size}`))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/products",
						className: "btn-line",
						children: "إدارة المنتجات"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/admin/orders",
						className: "btn-line",
						children: "إدارة الطلبات"
					})]
				})
			]
		})
	] });
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stat",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: value })]
	});
}
//#endregion
export { OverviewPage as component };
