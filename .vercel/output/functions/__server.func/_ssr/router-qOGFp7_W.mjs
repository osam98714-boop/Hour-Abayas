import { o as __toESM } from "../_runtime.mjs";
import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { D as _enum, F as object, M as literal, P as number, R as string, k as array, z as union } from "../_libs/@better-auth/core+[...].mjs";
import { C as require_jsx_runtime, S as useRouter, X as require_react, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, v as createFileRoute, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as auth } from "./server-BCsOmMwp.mjs";
import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-C18m8UQq.mjs";
import { i as Menu, n as TriangleAlert, r as ShoppingBag, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store.functions-B2Ptul7i.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var StoreError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "StoreError";
	}
};
function parse(schema, raw) {
	const result = schema.safeParse(raw);
	if (!result.success) throw new StoreError("البيانات المرسلة غير مكتملة أو غير صالحة");
	return result.data;
}
var productSchema = object({
	name: string().trim().min(2).max(120),
	category: _enum(["women", "kids"]),
	priceSar: number().int().min(1).max(1e5),
	description: string().trim().max(4e3),
	fabric: string().trim().max(400),
	embroidery: string().trim().max(400),
	stones: string().trim().max(400),
	details: string().trim().max(2e3),
	sizes: array(object({
		size: string().trim().min(1).max(16),
		qty: number().int().min(0).max(9999)
	})).min(1).max(40)
});
var getChrome = createServerFn({ method: "GET" }).handler(createSsrRpc("be1c50265a60846c43fc5f4d667a878ab4228bc3e2914fb72269ef8e62d78d48"));
var getHome = createServerFn({ method: "GET" }).handler(createSsrRpc("34bffbf187803eb831e69252634c087d7f827f01293050cfd3c6b1ea71e2e6de"));
var listCatalog = createServerFn({ method: "GET" }).validator((raw) => parse(object({ category: _enum(["women", "kids"]) }), raw)).handler(createSsrRpc("ff64f0e539c6dab903b2b80e19f28ffc6b2cc3685e3220f5c705a3152f375c1c"));
var getProductsByIds = createServerFn({ method: "POST" }).validator((raw) => parse(object({ ids: array(string().min(1).max(80)).max(40) }), raw)).handler(createSsrRpc("127137aebc8c1e4826ea394f1c2d562fe532e022f30c283daee25fc2c8dfce95"));
var getProduct = createServerFn({ method: "GET" }).validator((raw) => parse(object({ id: string().min(1).max(80) }), raw)).handler(createSsrRpc("95d9e6f00e88c9275ff890069aa2e9df745a703db7ba474cb0f04af8ab4183f2"));
var reviewSchema = object({
	productId: string().min(1).max(80),
	authorName: string().trim().min(2).max(40),
	rating: number().int().min(1).max(5),
	body: string().trim().max(1e3),
	images: array(string()).max(4)
});
var addReview = createServerFn({ method: "POST" }).validator((raw) => parse(reviewSchema, raw)).handler(createSsrRpc("df9f3ffe4c0f6a865c9daad9f022cca0840378f28edc786bb79c186182cb0211"));
var checkoutSchema = object({
	name: string().trim().min(2).max(80),
	phone: string().trim().min(8).max(20),
	address: string().trim().max(400),
	fulfillment: _enum(["delivery", "pickup"]),
	items: array(object({
		productId: string().min(1).max(80),
		size: string().trim().min(1).max(16),
		qty: number().int().min(1).max(10)
	})).min(1).max(30)
});
var placeOrder = createServerFn({ method: "POST" }).validator((raw) => parse(checkoutSchema, raw)).handler(createSsrRpc("90954bf6eb46204d3fcbe413f4732bb8c7d7db678553e104ffa92a324b365bba"));
var getMyAccess = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("116565cf57ff24c524f2abf6f5fa80eea8a8e81155e805ea84bb13859bf0d6f7"));
var claimStore = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("58f14211ecb6b96d0bca955463e873e70152bd1ced1c418002c216003fbe24f3"));
var getOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b5313fb9701b4cf85b3e2a5d776e2d02958c7665af0b1f9958c55d41187c5ad8"));
var listAdminProducts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("fc91339771c075887c55453886e8c92eaefef77948d72e8e69d9d5afad8e20db"));
var createProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => parse(productSchema, raw)).handler(createSsrRpc("802f6c4a6eaeb31a4b4df54ea57182361969d571eae0891fc48bd1e2b67359f6"));
var updateProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => parse(productSchema.extend({ id: string().min(1).max(80) }), raw)).handler(createSsrRpc("41274f462d9efc9c15fe96117de7d643933793ac7d7333e80363e1412a1a6879"));
var deleteProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => parse(object({ id: string().min(1).max(80) }), raw)).handler(createSsrRpc("cd02911c6606b71ebf66b532d825c6fd9886e0069512f83b6c44e180c98f0106"));
var addProductImage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => parse(object({
	productId: string().min(1).max(80),
	dataUrl: string().min(20)
}), raw)).handler(createSsrRpc("f5bf164fb9552bb18f4092619b346526af581ab0a7d23dff0e426e59b69dd4fd"));
var deleteProductImage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => parse(object({ id: string().min(1).max(80) }), raw)).handler(createSsrRpc("d41b03259655a589ab16708b1e50a5ffa2d797db0729386fbe83a7f08bc492ba"));
var deleteReview = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => parse(object({ id: string().min(1).max(80) }), raw)).handler(createSsrRpc("1cc2264210aa3f047f06e556bad5c1d4b6bac21caf899db930c84bc4489d9486"));
var listOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("136944701bc969aa8ada70fb7ca5938c4c1975bb114752711a9c68048237076a"));
var getOrder = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((raw) => parse(object({ id: string().min(1).max(80) }), raw)).handler(createSsrRpc("15324980cfcd954093aba38ab79cefac7140029575b79922d2efa00ec0b6fddc"));
var updateOrder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => parse(object({
	id: string().min(1).max(80),
	status: _enum([
		"new",
		"confirmed",
		"preparing",
		"out",
		"ready",
		"completed",
		"cancelled"
	]),
	deliveryFeeSar: number().int().min(0).max(500),
	adminNote: string().max(2e3)
}), raw)).handler(createSsrRpc("7b4f8aa67c87ff9494388d626a09abc2c37a1702a86b276ec488f354c190c9a0"));
var linksSchema = object({
	whatsapp: string().max(200),
	channels: array(object({
		label: string().trim().min(1).max(40),
		url: string().trim().max(300)
	})).max(12),
	deliveryBaseSar: number().int().min(0).max(500)
});
var saveLinks = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => parse(linksSchema, raw)).handler(createSsrRpc("64e078147b387e84a086aa68d3d03e0f4eff45c9466f9abe183078701bf58e7f"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-qOGFp7_W.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FALLBACK_MESSAGE = "حدث خطأ غير متوقع. أعيدي تحميل الصفحة.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-6 text-center text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-danger",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 1.75
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "تعذّر عرض الصفحة"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-muted",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var KEY = "hour-abayas-cart";
var listeners = /* @__PURE__ */ new Set();
function emit() {
	for (const listener of listeners) listener();
}
function subscribeCart(listener) {
	listeners.add(listener);
	return () => listeners.delete(listener);
}
function readCart() {
	if (typeof window === "undefined") return [];
	try {
		const raw = window.localStorage.getItem(KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.flatMap((row) => {
			if (!row || typeof row !== "object") return [];
			const item = row;
			if (typeof item.productId !== "string" || typeof item.size !== "string") return [];
			const qty = Number(item.qty);
			if (!Number.isInteger(qty) || qty < 1) return [];
			return [{
				productId: item.productId,
				size: item.size,
				qty
			}];
		});
	} catch {
		return [];
	}
}
function writeCart(lines) {
	window.localStorage.setItem(KEY, JSON.stringify(lines));
	emit();
}
function cartCount(lines = readCart()) {
	return lines.reduce((sum, line) => sum + line.qty, 0);
}
function clearCart() {
	writeCart([]);
}
/** Adds quantity if the resulting line still fits the live stock for that size. */
function addToCart(line, stock) {
	if (stock < 1) return {
		ok: false,
		message: "هذا المقاس غير متوفر"
	};
	const lines = readCart();
	const index = lines.findIndex((item) => item.productId === line.productId && item.size === line.size);
	const nextQty = (index >= 0 ? lines[index].qty : 0) + line.qty;
	if (nextQty > stock) return {
		ok: false,
		message: "الكمية المطلوبة أكبر من المتوفر لهذا المقاس"
	};
	if (index >= 0) lines[index] = {
		...lines[index],
		qty: nextQty
	};
	else lines.push({
		...line,
		qty: nextQty
	});
	writeCart(lines);
	return { ok: true };
}
function setLineQty(productId, size, qty, stock) {
	const lines = readCart();
	const index = lines.findIndex((item) => item.productId === productId && item.size === size);
	if (index < 0) return { ok: true };
	if (qty < 1) {
		lines.splice(index, 1);
		writeCart(lines);
		return { ok: true };
	}
	if (qty > stock) return {
		ok: false,
		message: "لا يمكن تجاوز كمية هذا المقاس"
	};
	lines[index] = {
		...lines[index],
		qty
	};
	writeCart(lines);
	return { ok: true };
}
function removeLine(productId, size) {
	writeCart(readCart().filter((item) => !(item.productId === productId && item.size === size)));
}
var ChromeContext = (0, import_react.createContext)(null);
function ChromeProvider({ value, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChromeContext.Provider, {
		value,
		children
	});
}
function useChrome() {
	const value = (0, import_react.useContext)(ChromeContext);
	if (!value) return {
		whatsapp: "",
		channels: [],
		deliveryBaseSar: 15,
		hasOwner: false
	};
	return value;
}
function Brand() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: "flex items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "grid h-11 w-11 place-items-center rounded-full border border-gold text-xl font-bold text-gold-deep",
			children: "ح"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-lg font-extrabold",
				children: "حور"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block text-xs tracking-widest text-gold-deep",
				children: "HOUR ABAYAS"
			})]
		})]
	});
}
function Header() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [count, setCount] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const sync = () => setCount(cartCount(readCart()));
		sync();
		return subscribeCart(sync);
	}, []);
	const links = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/women",
		className: "nav-link",
		onClick: () => setOpen(false),
		children: "عبايات النساء"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/kids",
		className: "nav-link",
		onClick: () => setOpen(false),
		children: "عبايات الأطفال"
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "site-header",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "wrap flex h-20 items-center justify-between gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "desk-nav flex items-center gap-6 text-sm font-semibold",
					children: links
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/cart",
						className: "btn-line",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {
								className: "size-4",
								"aria-hidden": "true"
							}),
							"السلة",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {
								className: "grid h-6 min-w-6 place-items-center bg-ink px-1 text-xs text-paper",
								children: count
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn-line menu-btn px-3",
						"aria-expanded": open,
						"aria-label": open ? "إغلاق القائمة" : "فتح القائمة",
						onClick: () => setOpen((value) => !value),
						children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					})]
				})
			]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			className: "menu-panel wrap flex flex-col gap-1 pb-4 text-base font-semibold",
			children: links
		}) : null]
	});
}
function Footer() {
	const chrome = useChrome();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-20 bg-ink text-paper",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "wrap grid gap-8 py-12 md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-2xl font-extrabold",
						children: "حور"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs tracking-[0.2em] text-gold",
						children: "HOUR ABAYAS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-gold",
						children: "أناقة .. بكل تفاصيلها"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-paper/80",
						children: "عبايات نساء وأطفال تُصنع محليًا في مكة المكرمة. التوصيل داخل مكة، والاستلام من المنزل مجاني."
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold",
					children: "التسوق"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-col gap-2 text-sm text-paper/85",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/women",
							children: "عبايات النساء"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/kids",
							children: "عبايات الأطفال"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/cart",
							children: "سلة المشتريات"
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold",
					children: "التواصل"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-col gap-2 text-sm",
					children: [
						chrome.whatsapp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: chrome.whatsapp,
							target: "_blank",
							rel: "noreferrer",
							children: "واتساب"
						}) : null,
						chrome.channels.map((channel) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: channel.url,
							target: "_blank",
							rel: "noreferrer",
							children: channel.label
						}, channel.url + channel.label)),
						!chrome.whatsapp && chrome.channels.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-paper/70",
							children: "روابط واتساب والقنوات تُضاف من لوحة الإدارة، ولا تُعرض روابط غير حقيقية."
						}) : null
					]
				})] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-paper/15",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "wrap flex flex-wrap items-center justify-between gap-3 py-4 text-xs text-paper/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "© حور | HOUR ABAYAS" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin",
					children: "إدارة المتجر"
				})]
			})
		})]
	});
}
function StoreFrame({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
var styles_default = "/assets/styles-DYJjE8LU.css";
var Route$18 = createRootRoute({
	loader: () => getChrome(),
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "حور | HOUR ABAYAS" },
			{
				name: "description",
				content: "أناقة .. بكل تفاصيلها. عبايات نساء وأطفال من مكة المكرمة."
			},
			{
				name: "theme-color",
				content: "#141414"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			}
		]
	}),
	component: Root
});
function Root() {
	const chrome = Route$18.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "ar",
		dir: "rtl",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChromeProvider, {
				value: chrome,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$16 = () => import("./routes-Ib665la2.mjs");
var Route$17 = createFileRoute("/")({
	loader: () => getHome(),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./admin-CyQokBma.mjs");
var Route$16 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./cart-uD2daCA2.mjs");
var Route$15 = createFileRoute("/cart")({
	head: () => ({ meta: [{ title: "سلة المشتريات | حور" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./checkout-CWG8JZ1w.mjs");
var Route$14 = createFileRoute("/checkout")({
	head: () => ({ meta: [{ title: "إتمام الطلب | حور" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./kids-DzbDbVdq.mjs");
var Route$13 = createFileRoute("/kids")({
	loader: () => listCatalog({ data: { category: "kids" } }),
	head: () => ({ meta: [{ title: "عبايات الأطفال | حور" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./login-msiB8Wdt.mjs");
var Route$12 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "دخول الإدارة | حور" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./women-BB7M1LqE.mjs");
var Route$11 = createFileRoute("/women")({
	loader: () => listCatalog({ data: { category: "women" } }),
	head: () => ({ meta: [{ title: "عبايات النساء | حور" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./admin.index-olKobW1u.mjs");
var Route$10 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./admin.links-CeHzuwRe.mjs");
var Route$9 = createFileRoute("/admin/links")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./admin.orders-ByKocBSM.mjs");
var Route$8 = createFileRoute("/admin/orders")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./admin.products-ClDUrDmi.mjs");
var Route$7 = createFileRoute("/admin/products")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./product._id-DuYy3xQU.mjs");
var Route$6 = createFileRoute("/product/$id")({
	loader: ({ params }) => getProduct({ data: { id: params.id } }),
	head: () => ({ meta: [{ title: "تفاصيل العباية | حور" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin.orders.index-CwGy7O1e.mjs");
var Route$5 = createFileRoute("/admin/orders/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./admin.orders._id-CjMhaDCg.mjs");
var Route$4 = createFileRoute("/admin/orders/$id")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./admin.products.index-CGLoHylS.mjs");
var Route$3 = createFileRoute("/admin/products/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin.products._id-DjroAqJY.mjs");
var Route$2 = createFileRoute("/admin/products/$id")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./admin.products.new-Bqol6WNu.mjs");
var Route$1 = createFileRoute("/admin/products/new")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: ({ request }) => auth.handler(request),
	POST: ({ request }) => auth.handler(request)
} } });
var IndexRoute = Route$17.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$18
});
var AdminRoute = Route$16.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$18
});
var CartRoute = Route$15.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$18
});
var CheckoutRoute = Route$14.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$18
});
var KidsRoute = Route$13.update({
	id: "/kids",
	path: "/kids",
	getParentRoute: () => Route$18
});
var LoginRoute = Route$12.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$18
});
var WomenRoute = Route$11.update({
	id: "/women",
	path: "/women",
	getParentRoute: () => Route$18
});
var AdminIndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminLinksRoute = Route$9.update({
	id: "/links",
	path: "/links",
	getParentRoute: () => AdminRoute
});
var AdminOrdersRoute = Route$8.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AdminRoute
});
var AdminProductsRoute = Route$7.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AdminRoute
});
var ProductIdRoute = Route$6.update({
	id: "/product/$id",
	path: "/product/$id",
	getParentRoute: () => Route$18
});
var AdminOrdersIndexRoute = Route$5.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminOrdersRoute
});
var AdminOrdersIdRoute = Route$4.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminOrdersRoute
});
var AdminProductsIndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminProductsRoute
});
var AdminProductsIdRoute = Route$2.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminProductsRoute
});
var AdminProductsNewRoute = Route$1.update({
	id: "/new",
	path: "/new",
	getParentRoute: () => AdminProductsRoute
});
var ApiAuthSplatRoute = Route.update({
	id: "/api/auth/$",
	path: "/api/auth/$",
	getParentRoute: () => Route$18
});
var AdminOrdersRouteChildren = {
	AdminOrdersIdRoute,
	AdminOrdersIndexRoute
};
var AdminOrdersRouteWithChildren = AdminOrdersRoute._addFileChildren(AdminOrdersRouteChildren);
var AdminProductsRouteChildren = {
	AdminProductsIdRoute,
	AdminProductsNewRoute,
	AdminProductsIndexRoute
};
var AdminRouteChildren = {
	AdminLinksRoute,
	AdminOrdersRoute: AdminOrdersRouteWithChildren,
	AdminProductsRoute: AdminProductsRoute._addFileChildren(AdminProductsRouteChildren),
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	CartRoute,
	CheckoutRoute,
	KidsRoute,
	LoginRoute,
	WomenRoute,
	ProductIdRoute,
	ApiAuthSplatRoute
};
var routeTree = Route$18._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { listOrders as A, getChrome as C, getProduct as D, getOverview as E, saveLinks as M, updateOrder as N, getProductsByIds as O, updateProduct as P, deleteReview as S, getOrder as T, addReview as _, Route$11 as a, deleteProduct as b, StoreFrame as c, clearCart as d, readCart as f, addProductImage as g, subscribeCart as h, Route$6 as i, placeOrder as j, listAdminProducts as k, useChrome as l, setLineQty as m, Route$2 as n, Route$13 as o, removeLine as p, Route$4 as r, Route$17 as s, router_exports as t, addToCart as u, claimStore as v, getMyAccess as w, deleteProductImage as x, createProduct as y };
