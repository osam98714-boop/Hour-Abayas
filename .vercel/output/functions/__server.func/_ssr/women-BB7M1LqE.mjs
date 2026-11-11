import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Route$11 } from "./router-qOGFp7_W.mjs";
import { t as CatalogPage } from "./catalog-page-4zk2VxAQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/women-BB7M1LqE.js
var import_jsx_runtime = require_jsx_runtime();
function WomenPage() {
	const items = Route$11.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CatalogPage, {
		kicker: "مجموعة النساء",
		title: "عبايات النساء",
		intro: "تصاميم تُصنع للمرأة، والمقاس الذي تختارينه يُظهر فقط ما هو متوفر في المخزون.",
		items
	});
}
//#endregion
export { WomenPage as component };
