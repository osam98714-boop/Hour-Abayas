import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, S as useRouter, X as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as errorText } from "./errors-BPO1JEGf.mjs";
import { P as updateProduct, S as deleteReview, g as addProductImage, x as deleteProductImage, y as createProduct } from "./router-qOGFp7_W.mjs";
import { t as compressImage } from "./images-DBCUm5X6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-form-ChIokrPm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var QUICK = [
	"S",
	"M",
	"L",
	"XL",
	"XXL",
	"4",
	"6",
	"8",
	"10",
	"12"
];
function ProductForm({ initial }) {
	const router = useRouter();
	const [name, setName] = (0, import_react.useState)(initial?.name ?? "");
	const [category, setCategory] = (0, import_react.useState)(initial?.category ?? "women");
	const [priceSar, setPriceSar] = (0, import_react.useState)(initial?.priceSar?.toString() ?? "");
	const [description, setDescription] = (0, import_react.useState)(initial?.description ?? "");
	const [fabric, setFabric] = (0, import_react.useState)(initial?.fabric ?? "");
	const [embroidery, setEmbroidery] = (0, import_react.useState)(initial?.embroidery ?? "");
	const [stones, setStones] = (0, import_react.useState)(initial?.stones ?? "");
	const [details, setDetails] = (0, import_react.useState)(initial?.details ?? "");
	const [sizes, setSizes] = (0, import_react.useState)(initial?.sizes.length ? initial.sizes : [{
		size: "M",
		qty: 0
	}]);
	const [images, setImages] = (0, import_react.useState)(initial?.images ?? []);
	const [pending, setPending] = (0, import_react.useState)([]);
	const [reviews, setReviews] = (0, import_react.useState)(initial?.reviews ?? []);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	function addSize(size = "") {
		setSizes((rows) => [...rows, {
			size,
			qty: 0
		}]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "grid gap-4",
		onSubmit: async (event) => {
			event.preventDefault();
			setBusy(true);
			setError("");
			const payload = {
				name,
				category,
				priceSar: Number(priceSar),
				description,
				fabric,
				embroidery,
				stones,
				details,
				sizes: sizes.map((row) => ({
					size: row.size.trim(),
					qty: Number(row.qty)
				}))
			};
			try {
				const saved = initial ? await updateProduct({ data: {
					...payload,
					id: initial.id
				} }) : await createProduct({ data: payload });
				for (let index = 0; index < pending.length; index += 1) {
					setProgress(`رفع الصورة ${index + 1} من ${pending.length}`);
					await addProductImage({ data: {
						productId: saved.id,
						dataUrl: pending[index]
					} });
				}
				setPending([]);
				setProgress("");
				await router.invalidate();
				if (!initial) {
					window.location.href = `/admin/products/${saved.id}`;
					return;
				}
				setProgress("تم حفظ المنتج");
			} catch (err) {
				setError(errorText(err));
				setProgress("");
			} finally {
				setBusy(false);
			}
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "field",
				children: ["اسم العباية", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: name,
					onChange: (event) => setName(event.target.value),
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "field",
					children: ["القسم", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: category,
						onChange: (event) => setCategory(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "women",
							children: "نساء"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "kids",
							children: "أطفال"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "field",
					children: ["السعر بالريال", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: priceSar,
						onChange: (event) => setPriceSar(event.target.value),
						type: "number",
						min: 1,
						required: true
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "field",
				children: ["الوصف", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: description,
					onChange: (event) => setDescription(event.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: ["القماش", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: fabric,
							onChange: (event) => setFabric(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: ["التطريز", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: embroidery,
							onChange: (event) => setEmbroidery(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: ["الأحجار", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: stones,
							onChange: (event) => setStones(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: ["تفاصيل أخرى", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: details,
							onChange: (event) => setDetails(event.target.value)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "panel grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "font-bold",
						children: "مخزون كل مقاس"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [QUICK.map((size) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "size-btn",
							onClick: () => {
								if (sizes.some((row) => row.size.toUpperCase() === size)) return;
								addSize(size);
							},
							children: size
						}, size)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn-line",
							onClick: () => addSize(""),
							children: "مقاس آخر"
						})]
					}),
					sizes.map((row, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-[1fr_8rem_auto] gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "border border-line px-3",
								value: row.size,
								"aria-label": "المقاس",
								onChange: (event) => setSizes((rows) => rows.map((item, i) => i === index ? {
									...item,
									size: event.target.value
								} : item))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "border border-line px-3",
								type: "number",
								min: 0,
								"aria-label": "الكمية",
								value: row.qty,
								onChange: (event) => setSizes((rows) => rows.map((item, i) => i === index ? {
									...item,
									qty: Number(event.target.value)
								} : item))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn-line",
								onClick: () => setSizes((rows) => rows.filter((_, i) => i !== index)),
								children: "حذف"
							})
						]
					}, `${row.size}-${index}`)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "كل مقاس له كمية مستقلة. الكمية صفر تعني أن المقاس يظهر للعميلة لكنه غير قابل للإضافة."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "panel grid gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "font-bold",
						children: "الصور"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [images.map((image) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: image.dataUrl,
								alt: "",
								className: "h-28 w-20 object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn-line mt-1 w-full",
								onClick: async () => {
									try {
										await deleteProductImage({ data: { id: image.id } });
										setImages((rows) => rows.filter((item) => item.id !== image.id));
									} catch (err) {
										setError(errorText(err));
									}
								},
								children: "حذف"
							})]
						}, image.id)), pending.map((src, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src,
							alt: "",
							className: "h-28 w-20 object-cover"
						}, src.slice(20, 40) + index))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "field",
						children: ["إضافة صور (يمكن أكثر من ١٥، والحد ٢٤)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							multiple: true,
							onChange: async (event) => {
								const files = [...event.target.files ?? []];
								try {
									const next = await Promise.all(files.map((file) => compressImage(file)));
									setPending((rows) => [...rows, ...next].slice(0, 24));
								} catch (err) {
									setError(errorText(err));
								}
								event.target.value = "";
							}
						})]
					})
				]
			}),
			initial && reviews.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "panel grid gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "font-bold",
					children: "تقييمات هذا المنتج"
				}), reviews.map((review) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: review.authorName }),
						" · ",
						review.rating,
						"/5",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-sm text-muted",
							children: review.body
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn-line",
						onClick: async () => {
							await deleteReview({ data: { id: review.id } });
							setReviews((rows) => rows.filter((item) => item.id !== review.id));
						},
						children: "حذف"
					})]
				}, review.id))]
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "danger",
				children: error
			}) : null,
			progress ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: progress
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "btn-gold",
				disabled: busy,
				type: "submit",
				children: busy ? "جارٍ الحفظ…" : initial ? "حفظ التعديل" : "حفظ المنتج"
			})
		]
	});
}
//#endregion
export { ProductForm as t };
