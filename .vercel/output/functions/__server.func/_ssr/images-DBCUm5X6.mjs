//#region node_modules/.nitro/vite/services/ssr/assets/images-DBCUm5X6.js
/** Shrink a photo in the browser before it is stored. Keeps uploads within the database limit. */
function compressImage(file) {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			const scale = Math.min(1, 1400 / img.width);
			const width = Math.max(1, Math.round(img.width * scale));
			const height = Math.max(1, Math.round(img.height * scale));
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				URL.revokeObjectURL(url);
				reject(/* @__PURE__ */ new Error("تعذّر معالجة الصورة"));
				return;
			}
			ctx.drawImage(img, 0, 0, width, height);
			const data = canvas.toDataURL("image/jpeg", .72);
			URL.revokeObjectURL(url);
			resolve(data);
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("تعذّر قراءة الصورة"));
		};
		img.src = url;
	});
}
//#endregion
export { compressImage as t };
