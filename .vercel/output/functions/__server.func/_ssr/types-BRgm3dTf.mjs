//#region node_modules/.nitro/vite/services/ssr/assets/types-BRgm3dTf.js
var ORDER_STATUSES = [
	{
		id: "new",
		label: "جديد"
	},
	{
		id: "confirmed",
		label: "مؤكد"
	},
	{
		id: "preparing",
		label: "قيد التجهيز"
	},
	{
		id: "out",
		label: "خرج للتوصيل"
	},
	{
		id: "ready",
		label: "جاهز للاستلام"
	},
	{
		id: "completed",
		label: "مكتمل"
	},
	{
		id: "cancelled",
		label: "ملغى"
	}
];
var SIZE_RANK = [
	"XS",
	"S",
	"M",
	"L",
	"XL",
	"XXL",
	"XXXL",
	"2",
	"4",
	"6",
	"8",
	"10",
	"12",
	"14",
	"16"
];
function sortSizes(rows) {
	const rank = (size) => {
		const i = SIZE_RANK.indexOf(size.toUpperCase());
		return i === -1 ? 100 + size.charCodeAt(0) : i;
	};
	return [...rows].sort((a, b) => rank(a.size) - rank(b.size) || a.size.localeCompare(b.size));
}
function statusLabel(id) {
	return ORDER_STATUSES.find((s) => s.id === id)?.label ?? id;
}
//#endregion
export { sortSizes as n, statusLabel as r, ORDER_STATUSES as t };
