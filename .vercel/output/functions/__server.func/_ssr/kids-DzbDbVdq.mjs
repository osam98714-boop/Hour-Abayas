import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as Route$13 } from "./router-qOGFp7_W.mjs";
import { t as CatalogPage } from "./catalog-page-4zk2VxAQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kids-DzbDbVdq.js
var import_jsx_runtime = require_jsx_runtime();
function KidsPage() {
	const items = Route$13.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogPage, {
		kicker: "مجموعة الأطفال",
		title: "عبايات الأطفال",
		intro: "عبايات الأطفال من مشغل العائلة. اختاري المقاس لتصفية المتوفر فقط.",
		items
	});
}
//#endregion
export { KidsPage as component };
