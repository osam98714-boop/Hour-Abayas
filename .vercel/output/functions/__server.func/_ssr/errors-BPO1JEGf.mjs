//#region node_modules/.nitro/vite/services/ssr/assets/errors-BPO1JEGf.js
function errorText(error) {
	if (error instanceof Error && error.message) return error.message;
	return "حدث خطأ غير متوقع";
}
//#endregion
export { errorText as t };
