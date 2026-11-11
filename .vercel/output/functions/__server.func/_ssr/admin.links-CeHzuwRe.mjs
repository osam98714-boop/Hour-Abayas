import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, S as useRouter, X as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as errorText } from "./errors-BPO1JEGf.mjs";
import { C as getChrome, M as saveLinks } from "./router-qOGFp7_W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.links-CeHzuwRe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LinksPage() {
	const router = useRouter();
	const [whatsapp, setWhatsapp] = (0, import_react.useState)("");
	const [channels, setChannels] = (0, import_react.useState)([]);
	const [deliveryBaseSar, setDeliveryBaseSar] = (0, import_react.useState)("15");
	const [error, setError] = (0, import_react.useState)("");
	const [message, setMessage] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getChrome().then((chrome) => {
			setWhatsapp(chrome.whatsapp);
			setChannels(chrome.channels);
			setDeliveryBaseSar(String(chrome.deliveryBaseSar));
		}).catch((err) => setError(errorText(err)));
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-4",
		onSubmit: async (event) => {
			event.preventDefault();
			setBusy(true);
			setError("");
			setMessage("");
			try {
				await saveLinks({ data: {
					whatsapp,
					channels: channels.filter((channel) => channel.label.trim() && channel.url.trim()),
					deliveryBaseSar: Number(deliveryBaseSar)
				} });
				setMessage("تم حفظ الروابط. تظهر في تذييل المتجر.");
				await router.invalidate();
			} catch (err) {
				setError(errorText(err));
			} finally {
				setBusy(false);
			}
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-extrabold",
				children: "روابط التواصل"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "واتساب، مجموعات، وأي قناة أخرى. لن يُعرض رابط لم تضيفيه."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "field",
				children: ["واتساب (رقم أو رابط wa.me / مجموعة)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: whatsapp,
					onChange: (event) => setWhatsapp(event.target.value),
					placeholder: "05xxxxxxxx"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3",
				children: [channels.map((channel, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-2 md:grid-cols-[1fr_1.4fr_auto]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "border border-line bg-white px-3",
							value: channel.label,
							placeholder: "اسم القناة",
							onChange: (event) => setChannels((rows) => rows.map((row, i) => i === index ? {
								...row,
								label: event.target.value
							} : row))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "border border-line bg-white px-3",
							value: channel.url,
							placeholder: "https://",
							onChange: (event) => setChannels((rows) => rows.map((row, i) => i === index ? {
								...row,
								url: event.target.value
							} : row))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn-line",
							onClick: () => setChannels((rows) => rows.filter((_, i) => i !== index)),
							children: "حذف"
						})
					]
				}, index)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-line",
					onClick: () => setChannels((rows) => [...rows, {
						label: "",
						url: ""
					}]),
					children: "إضافة قناة أو مجموعة"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "field",
				children: ["سعر التوصيل الأساسي داخل مكة", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "number",
					min: 0,
					max: 500,
					value: deliveryBaseSar,
					onChange: (event) => setDeliveryBaseSar(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "هذا السعر الأساسي. يمكن رفعه لكل طلب حسب بعد الحي من صفحة الطلب. الاستلام من المنزل يبقى مجانيًا."
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
				children: busy ? "جارٍ الحفظ…" : "حفظ الروابط"
			})
		]
	});
}
//#endregion
export { LinksPage as component };
