import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, X as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as errorText } from "./errors-BPO1JEGf.mjs";
import { D as getProduct, n as Route$2 } from "./router-qOGFp7_W.mjs";
import { t as ProductForm } from "./product-form-ChIokrPm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products._id-DjroAqJY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditProductPage() {
	const { id } = Route$2.useParams();
	const [product, setProduct] = (0, import_react.useState)(void 0);
	const [error, setError] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		getProduct({ data: { id } }).then(setProduct).catch((err) => setError(errorText(err)));
	}, [id]);
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "danger",
		children: error
	});
	if (product === void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "جارٍ فتح المنتج…" });
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "المنتج غير موجود." });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
		className: "mb-4 text-3xl font-extrabold",
		children: "تعديل المنتج"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, { initial: product })] });
}
//#endregion
export { EditProductPage as component };
