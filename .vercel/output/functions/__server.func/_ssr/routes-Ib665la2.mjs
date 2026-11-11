import { C as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as StoreFrame, s as Route$17 } from "./router-qOGFp7_W.mjs";
import { n as ProductCard, t as EmptyCollection } from "./product-card-B7ZkAY9X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Ib665la2.js
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const data = Route$17.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StoreFrame, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "wrap pt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hero-grid grid items-center gap-8 bg-ink px-6 py-12 text-paper md:grid-cols-[1.15fr_0.85fr] md:px-14 md:py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-bold tracking-wide text-gold",
						children: "أناقة .. بكل تفاصيلها"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-4 text-4xl font-extrabold leading-tight md:text-6xl",
						children: ["تفاصيل تصنع", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-gold",
							children: "أناقتكِ"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-md text-base leading-relaxed text-paper/80",
						children: "عبايات النساء والأطفال تُفصَّل محليًا في مكة المكرمة على يد أفراد من عائلتنا. اختاري التصميم، ثم المقاس المتوفر فعلًا."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/women",
							className: "btn-gold",
							children: "عبايات النساء"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/kids",
							className: "btn-line btn-ghost",
							children: "عبايات الأطفال"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm text-paper/70",
						children: "التوصيل داخل مكة يبدأ من 15 ريالًا · الاستلام من المنزل مجاني"
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative grid min-h-64 place-items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-56 w-56 place-items-center rounded-full border border-gold/50 text-7xl font-bold text-gold",
						children: "ح"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "absolute bottom-2 text-center text-xs tracking-widest text-gold",
						children: "HOUR ABAYAS"
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shelf, {
			id: "women",
			kicker: "01",
			title: "عبايات النساء",
			href: "/women",
			items: data.women,
			empty: "لا توجد عبايات نساء مضافة بعد. عند إضافتها من الإدارة تظهر هنا مجموعة عشوائية من التشكيلة."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shelf, {
			id: "kids",
			kicker: "02",
			title: "عبايات الأطفال",
			href: "/kids",
			items: data.kids,
			empty: "لا توجد عبايات أطفال مضافة بعد. عند إضافتها من الإدارة تظهر هنا مجموعة عشوائية من التشكيلة."
		})
	] });
}
function Shelf({ id, kicker, title, href, items, empty }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id,
		className: "wrap py-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: kicker
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 text-3xl font-extrabold",
				children: title
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: href,
				className: "btn-line",
				children: "عرض الكل"
			})]
		}), items.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { item }, item.id))
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyCollection, { children: empty })]
	});
}
//#endregion
export { Home as component };
