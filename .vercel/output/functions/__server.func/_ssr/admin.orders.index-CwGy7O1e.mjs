import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as errorText } from "./errors-BPO1JEGf.mjs";
import { t as riyal } from "./money-B8UhdnUs.mjs";
import { A as listOrders } from "./router-qOGFp7_W.mjs";
import { r as statusLabel } from "./types-BRgm3dTf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders.index-CwGy7O1e.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrdersPage() {
	const [orders, setOrders] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		listOrders().then(setOrders).catch((err) => setError(errorText(err)));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl font-extrabold",
			children: "الطلبات"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "تصل الطلبات من أجهزة العميلات إلى هنا. لا يُحوَّل الطلب إلى واتساب."
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "danger mt-4",
			children: error
		}) : null,
		orders && orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "notice mt-6",
			children: "لا توجد طلبات بعد."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-3",
			children: (orders ?? []).map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/admin/orders/$id",
				params: { id: order.id },
				className: "panel block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: order.number }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						order.customerName,
						" · ",
						order.phone,
						" · ",
						order.fulfillment === "delivery" ? "توصيل" : "استلام",
						" ·",
						" ",
						statusLabel(order.status),
						" · ",
						riyal(order.totalSar)
					]
				})]
			}, order.id))
		})
	] });
}
//#endregion
export { OrdersPage as component };
