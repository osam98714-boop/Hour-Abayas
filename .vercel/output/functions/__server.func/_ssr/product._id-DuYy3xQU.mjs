import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as errorText } from "./errors-BPO1JEGf.mjs";
import { t as riyal } from "./money-B8UhdnUs.mjs";
import { D as getProduct, _ as addReview, c as StoreFrame, i as Route$6, u as addToCart } from "./router-qOGFp7_W.mjs";
import { n as sortSizes } from "./types-BRgm3dTf.mjs";
import { t as compressImage } from "./images-DBCUm5X6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._id-DuYy3xQU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductPage() {
	const initial = Route$6.useLoaderData();
	const { id } = Route$6.useParams();
	const [product, setProduct] = (0, import_react.useState)(initial);
	const [photo, setPhoto] = (0, import_react.useState)(0);
	const sizes = product ? sortSizes(product.sizes) : [];
	const firstInStock = sizes.find((size) => size.qty > 0)?.size ?? "";
	const [selected, setSelected] = (0, import_react.useState)(firstInStock);
	const [note, setNote] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setProduct(initial);
		setPhoto(0);
		setNote("");
		setError("");
		const nextSizes = initial ? sortSizes(initial.sizes) : [];
		setSelected(nextSizes.find((size) => size.qty > 0)?.size ?? "");
	}, [initial]);
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "wrap py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "notice",
			children: "هذا المنتج غير موجود أو حُذف."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "btn-line mt-4",
			children: "العودة للرئيسية"
		})]
	}) });
	const current = sizes.find((size) => size.size === selected);
	const soldOut = sizes.every((size) => size.qty === 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreFrame, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "wrap py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: "الرئيسية"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: " / " }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: product.category === "women" ? "/women" : "/kids",
						children: product.category === "women" ? "عبايات النساء" : "عبايات الأطفال"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "split mt-6 grid items-start gap-8 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [product.images.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: product.images[photo]?.dataUrl,
					alt: product.name,
					className: "w-full bg-cream object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "ph text-6xl",
					children: "ح"
				}), product.images.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 flex gap-2 overflow-x-auto",
					children: product.images.map((image, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setPhoto(index),
						className: "shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: image.dataUrl,
							alt: "",
							className: index === photo ? "thumb thumb-on" : "thumb"
						})
					}, image.id))
				}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: "HOUR ABAYAS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 text-4xl font-extrabold",
						children: product.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "price mt-3 text-2xl",
						children: riyal(product.priceSar)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 leading-relaxed",
						children: product.description || "لا يوجد وصف مضاف بعد."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-5 grid gap-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
								label: "القماش",
								value: product.fabric
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
								label: "التطريز",
								value: product.embroidery
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
								label: "الأحجار",
								value: product.stones
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, {
								label: "تفاصيل أخرى",
								value: product.details
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 font-bold",
						children: "المقاس"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						children: sizes.map((size) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "size-btn",
							disabled: size.qty < 1,
							"data-on": selected === size.size ? "true" : "false",
							onClick: () => {
								setSelected(size.size);
								setNote("");
								setError("");
							},
							children: size.size
						}, size.size))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: soldOut ? "نفدت جميع المقاسات." : current && current.qty > 0 ? current.qty <= 3 ? `متبقي ${current.qty} من مقاس ${current.size}` : `مقاس ${current.size} متوفر` : "المقاسات المشطوب عليها غير متوفرة ولا تُضاف إلى السلة."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn-gold mt-5",
						disabled: !current || current.qty < 1,
						onClick: () => {
							if (!current || current.qty < 1) {
								setError("اختاري مقاسًا متوفرًا");
								return;
							}
							const result = addToCart({
								productId: product.id,
								size: current.size,
								qty: 1
							}, current.qty);
							setError(result.ok ? "" : result.message);
							setNote(result.ok ? "أُضيفت العباية إلى السلة" : "");
						},
						children: "أضيفي إلى السلة"
					}),
					note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm font-semibold",
						children: note
					}) : null,
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "danger mt-3",
						children: error
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted",
						children: "الدفع الإلكتروني غير مفعّل. إتمام الطلب يحفظه للإدارة، والدفع عند الاستلام."
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reviews, {
				productId: id,
				reviews: product.reviews,
				onAdded: async () => {
					const next = await getProduct({ data: { id } });
					if (next) setProduct(next);
				}
			})
		]
	}) });
}
function Detail({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-[7rem_1fr] gap-2 border-b border-line py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: value || "—" })]
	});
}
function Reviews({ productId, reviews, onAdded }) {
	const [authorName, setAuthorName] = (0, import_react.useState)("");
	const [rating, setRating] = (0, import_react.useState)(5);
	const [body, setBody] = (0, import_react.useState)("");
	const [images, setImages] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [message, setMessage] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-14",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-2xl font-extrabold",
				children: "تقييمات العميلات"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4",
				children: [reviews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "notice",
					children: "لا توجد تقييمات بعد. أول تجربة موثّقة تظهر هنا."
				}) : null, reviews.map((review) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-baseline justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: review.authorName }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-gold-deep",
								children: [review.rating, " من 5"]
							})]
						}),
						review.body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2",
							children: review.body
						}) : null,
						review.images.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex gap-2 overflow-x-auto",
							children: review.images.map((src) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src,
								alt: "",
								className: "h-24 w-20 object-cover"
							}, src.slice(0, 48)))
						}) : null
					]
				}, review.id))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "panel mt-6 grid gap-4",
				onSubmit: async (event) => {
					event.preventDefault();
					setBusy(true);
					setError("");
					setMessage("");
					try {
						await addReview({ data: {
							productId,
							authorName,
							rating,
							body,
							images
						} });
						setAuthorName("");
						setBody("");
						setImages([]);
						setRating(5);
						setMessage("شكرًا، نُشر تقييمكِ.");
						await onAdded();
					} catch (err) {
						setError(errorText(err));
					} finally {
						setBusy(false);
					}
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-bold",
						children: "أضيفي تقييمًا"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: ["الاسم", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: authorName,
							onChange: (event) => setAuthorName(event.target.value),
							required: true,
							minLength: 2
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: ["التقييم", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: rating,
							onChange: (event) => setRating(Number(event.target.value)),
							children: [
								5,
								4,
								3,
								2,
								1
							].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value,
								children: [value, " من 5"]
							}, value))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: ["التعليق", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: body,
							onChange: (event) => setBody(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: ["صور التجربة (حتى ٤)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							multiple: true,
							onChange: async (event) => {
								const files = [...event.target.files ?? []].slice(0, 4);
								try {
									const next = await Promise.all(files.map((file) => compressImage(file)));
									setImages(next);
								} catch (err) {
									setError(errorText(err));
								}
							}
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
						className: "btn-ink",
						disabled: busy,
						type: "submit",
						children: busy ? "جارٍ النشر…" : "نشر التقييم"
					})
				]
			})
		]
	});
}
//#endregion
export { ProductPage as component };
