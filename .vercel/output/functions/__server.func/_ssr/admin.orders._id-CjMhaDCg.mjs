import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as errorText } from "./errors-BPO1JEGf.mjs";
import { t as riyal } from "./money-B8UhdnUs.mjs";
import { N as updateOrder, T as getOrder, r as Route$4 } from "./router-qOGFp7_W.mjs";
import { t as ORDER_STATUSES } from "./types-BRgm3dTf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders._id-CjMhaDCg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrderPage() {
	const { id } = Route$4.useParams();
	const [order, setOrder] = (0, import_react.useState)(void 0);
	const [status, setStatus] = (0, import_react.useState)("new");
	const [fee, setFee] = (0, import_react.useState)("0");
	const [note, setNote] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getOrder({ data: { id } }).then((next) => {
			setOrder(next);
			if (next) {
				setStatus(next.status);
				setFee(String(next.deliveryFeeSar));
				setNote(next.adminNote);
			}
		}).catch((err) => setError(errorText(err)));
	}, [id]);
	if (error && !order) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "danger",
		children: error
	});
	if (order === void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "جارٍ فتح الطلب…" });
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "الطلب غير موجود." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: order.number
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-extrabold",
				children: order.customerName
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel text-sm leading-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["الجوال: ", order.phone] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["العنوان: ", order.address || "—"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["الاستلام: ", order.fulfillment === "delivery" ? "توصيل داخل مكة" : "استلام من المنزل"] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["الدفع: ", order.paymentMethod === "cod" ? "عند الاستلام" : order.paymentMethod] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["تاريخ الطلب: ", order.createdAt ? new Date(order.createdAt).toLocaleString("ar-SA") : ""] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "panel",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-bold",
						children: "المنتجات"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 grid gap-2 text-sm",
						children: order.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								item.productName,
								" · ",
								item.size,
								" · ×",
								item.qty
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "price",
								children: riyal(item.unitPriceSar * item.qty)
							})]
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm",
						children: ["المنتجات ", riyal(order.subtotalSar)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							"التوصيل ",
							riyal(order.deliveryFeeSar),
							order.feeIsEstimate ? " (تقدير، لم يُؤكد بعد)" : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-bold",
						children: ["الإجمالي ", riyal(order.totalSar)]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "panel grid gap-3",
				onSubmit: async (event) => {
					event.preventDefault();
					setBusy(true);
					setError("");
					setMessage("");
					try {
						await updateOrder({ data: {
							id: order.id,
							status,
							deliveryFeeSar: Number(fee),
							adminNote: note
						} });
						const next = await getOrder({ data: { id } });
						setOrder(next);
						setMessage(status === "cancelled" ? "أُلغي الطلب وأُعيد مخزون المقاسات." : "تم تحديث الطلب.");
					} catch (err) {
						setError(errorText(err));
					} finally {
						setBusy(false);
					}
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: ["الحالة", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: status,
							onChange: (event) => setStatus(event.target.value),
							children: ORDER_STATUSES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: item.id,
								children: item.label
							}, item.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: ["رسوم التوصيل بالريال", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: fee,
							type: "number",
							min: 0,
							max: 500,
							onChange: (event) => setFee(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "عدّلي الرسوم إذا زاد التوصيل بسبب بُعد الحي. الإلغاء يعيد كمية كل مقاس."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: ["ملاحظة داخلية", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: note,
							onChange: (event) => setNote(event.target.value)
						})]
					}),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "danger",
						children: error
					}) : null,
					message ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold",
						children: message
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn-gold",
						disabled: busy,
						type: "submit",
						children: busy ? "جارٍ الحفظ…" : "حفظ حالة الطلب"
					})
				]
			})
		]
	});
}
//#endregion
export { OrderPage as component };
