import { D as _enum, F as object, P as number, R as string, k as array } from "../_libs/@better-auth/core+[...].mjs";
import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-C18m8UQq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store.functions-wqLJS4Un.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var MAX_IMAGE = 16e5;
var StoreError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "StoreError";
	}
};
async function db() {
	const { getSql } = await import("./db-DB5oClP6.mjs").then((n) => n.t).then((n) => n.t);
	return getSql();
}
function parse(schema, raw) {
	const result = schema.safeParse(raw);
	if (!result.success) throw new StoreError("البيانات المرسلة غير مكتملة أو غير صالحة");
	return result.data;
}
function iso(value) {
	if (value instanceof Date) return value.toISOString();
	return typeof value === "string" ? value : "";
}
function asSizes(value) {
	const raw = typeof value === "string" ? JSON.parse(value) : value;
	if (!Array.isArray(raw)) return [];
	return raw.flatMap((row) => {
		if (!row || typeof row !== "object") return [];
		const size = "size" in row ? String(row.size) : "";
		const qty = Number("qty" in row ? row.qty : NaN);
		if (!size || !Number.isFinite(qty)) return [];
		return [{
			size,
			qty
		}];
	});
}
function asChannels(value) {
	const raw = typeof value === "string" ? JSON.parse(value) : value;
	if (!Array.isArray(raw)) return [];
	return raw.flatMap((row) => {
		if (!row || typeof row !== "object") return [];
		const label = "label" in row ? String(row.label) : "";
		const url = "url" in row ? String(row.url) : "";
		if (!label || !url) return [];
		return [{
			label,
			url
		}];
	});
}
function asStringList(value) {
	const raw = typeof value === "string" ? JSON.parse(value) : value;
	if (!Array.isArray(raw)) return [];
	return raw.filter((item) => typeof item === "string");
}
function assertImage(dataUrl) {
	if (!/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(dataUrl)) throw new StoreError("صيغة الصورة غير مدعومة. استخدمي JPG أو PNG أو WEBP");
	if (dataUrl.length > MAX_IMAGE) throw new StoreError("الصورة أكبر من المسموح بعد الضغط");
}
function httpsUrl(value) {
	const url = value.trim();
	if (!url) return "";
	if (!/^https:\/\/\S+$/i.test(url)) throw new StoreError("الرابط يجب أن يبدأ بـ https://");
	return url;
}
function normalizeWhatsapp(raw) {
	const value = raw.trim();
	if (!value) return "";
	if (/^https:\/\/(wa\.me|api\.whatsapp\.com|chat\.whatsapp\.com)\//i.test(value)) return value;
	let digits = value.replace(/[^\d]/g, "");
	if (digits.startsWith("00")) digits = digits.slice(2);
	if (digits.startsWith("0")) digits = `966${digits.slice(1)}`;
	if (digits.length === 9) digits = `966${digits}`;
	if (digits.length < 11 || digits.length > 15) throw new StoreError("رقم واتساب غير واضح");
	return `https://wa.me/${digits}`;
}
async function assertAdmin(userId) {
	if (!(await (await db())`select user_id from store_admins where user_id = ${userId} limit 1`).length) throw new StoreError("ليست لديك صلاحية إدارة المتجر");
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
var catalogSql = `
  select p.id, p.name, p.category, p.price_sar,
    coalesce((
      select json_agg(json_build_object('size', ps.size_label, 'qty', ps.qty))
      from product_sizes ps where ps.product_id = p.id
    ), '[]'::json) as sizes,
    (
      select i.data_url from product_images i
      where i.product_id = p.id
      order by i.sort_order, i.id
      limit 1
    ) as cover
  from products p
`;
function mapCatalog(row) {
	return {
		id: row.id,
		name: row.name,
		category: row.category,
		priceSar: Number(row.price_sar),
		cover: row.cover,
		sizes: asSizes(row.sizes)
	};
}
var getChrome_createServerFn_handler = createServerRpc({
	id: "be1c50265a60846c43fc5f4d667a878ab4228bc3e2914fb72269ef8e62d78d48",
	name: "getChrome",
	filename: "src/lib/store.functions.ts"
}, (opts) => getChrome.__executeServer(opts));
var getChrome = createServerFn({ method: "GET" }).handler(getChrome_createServerFn_handler, async () => {
	const sql = await db();
	const settings = await sql`
    select whatsapp, channels, delivery_base_sar from store_settings where id = 1
  `;
	const owners = await sql`select count(*)::int as n from store_admins`;
	const row = settings[0];
	return {
		whatsapp: row?.whatsapp ?? "",
		channels: asChannels(row?.channels ?? []),
		deliveryBaseSar: Number(row?.delivery_base_sar ?? 15),
		hasOwner: Number(owners[0]?.n ?? 0) > 0
	};
});
var getHome_createServerFn_handler = createServerRpc({
	id: "34bffbf187803eb831e69252634c087d7f827f01293050cfd3c6b1ea71e2e6de",
	name: "getHome",
	filename: "src/lib/store.functions.ts"
}, (opts) => getHome.__executeServer(opts));
var getHome = createServerFn({ method: "GET" }).handler(getHome_createServerFn_handler, async () => {
	const sql = await db();
	const load = async (category) => {
		return (await sql.query(`select p.id, p.name, p.price_sar,
        (select i.data_url from product_images i where i.product_id = p.id order by i.sort_order, i.id limit 1) as cover
       from products p where p.category = $1
       order by random() limit 4`, [category])).map((row) => ({
			id: row.id,
			name: row.name,
			priceSar: Number(row.price_sar),
			cover: row.cover
		}));
	};
	const [women, kids] = await Promise.all([load("women"), load("kids")]);
	return {
		women,
		kids
	};
});
var listCatalog_createServerFn_handler = createServerRpc({
	id: "ff64f0e539c6dab903b2b80e19f28ffc6b2cc3685e3220f5c705a3152f375c1c",
	name: "listCatalog",
	filename: "src/lib/store.functions.ts"
}, (opts) => listCatalog.__executeServer(opts));
var listCatalog = createServerFn({ method: "GET" }).validator((raw) => parse(object({ category: _enum(["women", "kids"]) }), raw)).handler(listCatalog_createServerFn_handler, async ({ data }) => {
	return (await (await db()).query(`${catalogSql} where p.category = $1 order by p.created_at desc`, [data.category])).map(mapCatalog);
});
var getProductsByIds_createServerFn_handler = createServerRpc({
	id: "127137aebc8c1e4826ea394f1c2d562fe532e022f30c283daee25fc2c8dfce95",
	name: "getProductsByIds",
	filename: "src/lib/store.functions.ts"
}, (opts) => getProductsByIds.__executeServer(opts));
var getProductsByIds = createServerFn({ method: "POST" }).validator((raw) => parse(object({ ids: array(string().min(1).max(80)).max(40) }), raw)).handler(getProductsByIds_createServerFn_handler, async ({ data }) => {
	if (!data.ids.length) return [];
	return (await (await db()).query(`${catalogSql} where p.id in (select value from jsonb_array_elements_text($1::jsonb))`, [JSON.stringify(data.ids)])).map(mapCatalog);
});
var getProduct_createServerFn_handler = createServerRpc({
	id: "95d9e6f00e88c9275ff890069aa2e9df745a703db7ba474cb0f04af8ab4183f2",
	name: "getProduct",
	filename: "src/lib/store.functions.ts"
}, (opts) => getProduct.__executeServer(opts));
var getProduct = createServerFn({ method: "GET" }).validator((raw) => parse(object({ id: string().min(1).max(80) }), raw)).handler(getProduct_createServerFn_handler, async ({ data }) => {
	const sql = await db();
	const product = (await sql`select id, name, category, price_sar, description, fabric, embroidery, stones, details
       from products where id = ${data.id} limit 1`)[0];
	if (!product) return null;
	const images = await sql`
      select id, data_url from product_images where product_id = ${product.id} order by sort_order, id
    `;
	const sizes = await sql`
      select size_label, qty from product_sizes where product_id = ${product.id}
    `;
	const reviews = (await sql`
      select r.id, r.author_name, r.rating, r.body, r.created_at,
        coalesce((select json_agg(ri.data_url) from review_images ri where ri.review_id = r.id), '[]'::json) as images
      from reviews r
      where r.product_id = ${product.id}
      order by r.created_at desc
    `).map((row) => ({
		id: row.id,
		authorName: row.author_name,
		rating: Number(row.rating),
		body: row.body,
		createdAt: iso(row.created_at),
		images: asStringList(row.images)
	}));
	return {
		id: product.id,
		name: product.name,
		category: product.category,
		priceSar: Number(product.price_sar),
		description: product.description,
		fabric: product.fabric,
		embroidery: product.embroidery,
		stones: product.stones,
		details: product.details,
		images: images.map((image) => ({
			id: image.id,
			dataUrl: image.data_url
		})),
		sizes: sizes.map((size) => ({
			size: size.size_label,
			qty: Number(size.qty)
		})),
		reviews
	};
});
var reviewSchema = object({
	productId: string().min(1).max(80),
	authorName: string().trim().min(2).max(40),
	rating: number().int().min(1).max(5),
	body: string().trim().max(1e3),
	images: array(string()).max(4)
});
var addReview_createServerFn_handler = createServerRpc({
	id: "df9f3ffe4c0f6a865c9daad9f022cca0840378f28edc786bb79c186182cb0211",
	name: "addReview",
	filename: "src/lib/store.functions.ts"
}, (opts) => addReview.__executeServer(opts));
var addReview = createServerFn({ method: "POST" }).validator((raw) => parse(reviewSchema, raw)).handler(addReview_createServerFn_handler, async ({ data }) => {
	for (const image of data.images) assertImage(image);
	const sql = await db();
	if (!(await sql`select id from products where id = ${data.productId} limit 1`).length) throw new StoreError("المنتج غير موجود");
	const id = `r_${crypto.randomUUID()}`;
	await sql`
      insert into reviews (id, product_id, author_name, rating, body)
      values (${id}, ${data.productId}, ${data.authorName}, ${data.rating}, ${data.body})
    `;
	for (const image of data.images) await sql`insert into review_images (id, review_id, data_url) values (${`ri_${crypto.randomUUID()}`}, ${id}, ${image})`;
	return { id };
});
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
var placeOrder_createServerFn_handler = createServerRpc({
	id: "90954bf6eb46204d3fcbe413f4732bb8c7d7db678553e104ffa92a324b365bba",
	name: "placeOrder",
	filename: "src/lib/store.functions.ts"
}, (opts) => placeOrder.__executeServer(opts));
var placeOrder = createServerFn({ method: "POST" }).validator((raw) => parse(checkoutSchema, raw)).handler(placeOrder_createServerFn_handler, async ({ data }) => {
	if (data.phone.replace(/[^\d]/g, "").length < 8) throw new StoreError("رقم التواصل غير مكتمل");
	const address = data.fulfillment === "delivery" ? data.address.trim() : data.address.trim() || "استلام من المنزل";
	if (data.fulfillment === "delivery" && address.length < 4) throw new StoreError("اكتبي الحي والعنوان داخل مكة");
	const sql = await db();
	try {
		const row = (await sql.query(`select order_number, subtotal_sar, delivery_fee_sar, total_sar, fee_is_estimate
         from place_hour_order($1, $2, $3, $4, $5, $6::jsonb)`, [
			`o_${crypto.randomUUID()}`,
			data.name,
			data.phone.trim(),
			address,
			data.fulfillment,
			JSON.stringify(data.items.map((item) => ({
				product_id: item.productId,
				size_label: item.size,
				qty: item.qty
			})))
		]))[0];
		if (!row) throw new StoreError("تعذّر إنشاء الطلب");
		return {
			number: row.order_number,
			subtotalSar: Number(row.subtotal_sar),
			deliveryFeeSar: Number(row.delivery_fee_sar),
			totalSar: Number(row.total_sar),
			feeIsEstimate: Boolean(row.fee_is_estimate)
		};
	} catch (error) {
		if (error instanceof StoreError) throw error;
		const message = error instanceof Error ? error.message : "";
		if (message.includes("insufficient_stock")) throw new StoreError("بعض المقاسات لم تعد متوفرة بالكمية المطلوبة");
		if (message.includes("empty_cart")) throw new StoreError("السلة فارغة");
		throw new StoreError("تعذّر حفظ الطلب. حاولي مرة أخرى");
	}
});
var getMyAccess_createServerFn_handler = createServerRpc({
	id: "116565cf57ff24c524f2abf6f5fa80eea8a8e81155e805ea84bb13859bf0d6f7",
	name: "getMyAccess",
	filename: "src/lib/store.functions.ts"
}, (opts) => getMyAccess.__executeServer(opts));
var getMyAccess = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyAccess_createServerFn_handler, async ({ context }) => {
	const sql = await db();
	const mine = await sql`
      select user_id from store_admins where user_id = ${context.userId} limit 1
    `;
	const any = await sql`select user_id from store_admins limit 1`;
	return {
		isAdmin: mine.length > 0,
		hasOwner: any.length > 0
	};
});
var claimStore_createServerFn_handler = createServerRpc({
	id: "58f14211ecb6b96d0bca955463e873e70152bd1ced1c418002c216003fbe24f3",
	name: "claimStore",
	filename: "src/lib/store.functions.ts"
}, (opts) => claimStore.__executeServer(opts));
var claimStore = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(claimStore_createServerFn_handler, async ({ context }) => {
	const sql = await db();
	const any = await sql`select user_id from store_admins limit 1`;
	if (any.length && any[0].user_id !== context.userId) throw new StoreError("المتجر له مالك بالفعل");
	if (!any.length) await sql`insert into store_admins (user_id) values (${context.userId})`;
	return { ok: true };
});
var getOverview_createServerFn_handler = createServerRpc({
	id: "b5313fb9701b4cf85b3e2a5d776e2d02958c7665af0b1f9958c55d41187c5ad8",
	name: "getOverview",
	filename: "src/lib/store.functions.ts"
}, (opts) => getOverview.__executeServer(opts));
var getOverview = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getOverview_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context.userId);
	const sql = await db();
	const [counts] = await sql`
      select
        (select count(*)::int from products) as products,
        (select count(*)::int from products where category = 'women') as women,
        (select count(*)::int from products where category = 'kids') as kids,
        (select count(*)::int from orders) as orders,
        (select count(*)::int from orders where status = 'new') as new_orders,
        (select coalesce(sum(total_sar), 0)::int from orders where status <> 'cancelled') as sales
    `;
	const low = await sql`
      select p.name as product_name, ps.size_label, ps.qty
      from product_sizes ps
      join products p on p.id = ps.product_id
      where ps.qty <= 2
      order by ps.qty, p.name
      limit 12
    `;
	return {
		products: Number(counts?.products ?? 0),
		women: Number(counts?.women ?? 0),
		kids: Number(counts?.kids ?? 0),
		orders: Number(counts?.orders ?? 0),
		newOrders: Number(counts?.new_orders ?? 0),
		salesSar: Number(counts?.sales ?? 0),
		lowStock: low.map((row) => ({
			productName: row.product_name,
			size: row.size_label,
			qty: Number(row.qty)
		}))
	};
});
var listAdminProducts_createServerFn_handler = createServerRpc({
	id: "fc91339771c075887c55453886e8c92eaefef77948d72e8e69d9d5afad8e20db",
	name: "listAdminProducts",
	filename: "src/lib/store.functions.ts"
}, (opts) => listAdminProducts.__executeServer(opts));
var listAdminProducts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listAdminProducts_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context.userId);
	return (await (await db()).query(`${catalogSql} order by p.created_at desc`)).map(mapCatalog);
});
async function saveSizes(productId, sizes) {
	if (new Set(sizes.map((size) => size.size.toUpperCase())).size !== sizes.length) throw new StoreError("يوجد مقاس مكرر");
	await (await db()).query(`with incoming as (
       select * from jsonb_to_recordset($2::jsonb) as x(size_label text, qty int)
     ),
     deleted as (
       delete from product_sizes
       where product_id = $1
         and size_label not in (select size_label from incoming)
       returning size_label
     ),
     upserted as (
       insert into product_sizes (product_id, size_label, qty)
       select $1, size_label, qty from incoming
       on conflict (product_id, size_label) do update set qty = excluded.qty
       returning size_label
     )
     select (select count(*) from deleted) + (select count(*) from upserted)`, [productId, JSON.stringify(sizes.map((size) => ({
		size_label: size.size.toUpperCase(),
		qty: size.qty
	})))]);
}
function productValues(input) {
	return input;
}
var createProduct_createServerFn_handler = createServerRpc({
	id: "802f6c4a6eaeb31a4b4df54ea57182361969d571eae0891fc48bd1e2b67359f6",
	name: "createProduct",
	filename: "src/lib/store.functions.ts"
}, (opts) => createProduct.__executeServer(opts));
var createProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => parse(productSchema, raw)).handler(createProduct_createServerFn_handler, async ({ context, data }) => {
	await assertAdmin(context.userId);
	const input = productValues(data);
	const id = `p_${crypto.randomUUID()}`;
	await (await db())`
      insert into products (id, name, category, price_sar, description, fabric, embroidery, stones, details)
      values (
        ${id}, ${input.name}, ${input.category}, ${input.priceSar}, ${input.description},
        ${input.fabric}, ${input.embroidery}, ${input.stones}, ${input.details}
      )
    `;
	await saveSizes(id, input.sizes);
	return { id };
});
var updateProduct_createServerFn_handler = createServerRpc({
	id: "41274f462d9efc9c15fe96117de7d643933793ac7d7333e80363e1412a1a6879",
	name: "updateProduct",
	filename: "src/lib/store.functions.ts"
}, (opts) => updateProduct.__executeServer(opts));
var updateProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => parse(productSchema.extend({ id: string().min(1).max(80) }), raw)).handler(updateProduct_createServerFn_handler, async ({ context, data }) => {
	await assertAdmin(context.userId);
	if (!(await (await db())`
      update products set
        name = ${data.name},
        category = ${data.category},
        price_sar = ${data.priceSar},
        description = ${data.description},
        fabric = ${data.fabric},
        embroidery = ${data.embroidery},
        stones = ${data.stones},
        details = ${data.details},
        updated_at = now()
      where id = ${data.id}
      returning id
    `).length) throw new StoreError("المنتج غير موجود");
	await saveSizes(data.id, data.sizes);
	return { id: data.id };
});
var deleteProduct_createServerFn_handler = createServerRpc({
	id: "cd02911c6606b71ebf66b532d825c6fd9886e0069512f83b6c44e180c98f0106",
	name: "deleteProduct",
	filename: "src/lib/store.functions.ts"
}, (opts) => deleteProduct.__executeServer(opts));
var deleteProduct = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => parse(object({ id: string().min(1).max(80) }), raw)).handler(deleteProduct_createServerFn_handler, async ({ context, data }) => {
	await assertAdmin(context.userId);
	await (await db())`delete from products where id = ${data.id}`;
	return { ok: true };
});
var addProductImage_createServerFn_handler = createServerRpc({
	id: "f5bf164fb9552bb18f4092619b346526af581ab0a7d23dff0e426e59b69dd4fd",
	name: "addProductImage",
	filename: "src/lib/store.functions.ts"
}, (opts) => addProductImage.__executeServer(opts));
var addProductImage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => parse(object({
	productId: string().min(1).max(80),
	dataUrl: string().min(20)
}), raw)).handler(addProductImage_createServerFn_handler, async ({ context, data }) => {
	await assertAdmin(context.userId);
	assertImage(data.dataUrl);
	const sql = await db();
	const count = await sql`
      select count(*)::int as n from product_images where product_id = ${data.productId}
    `;
	if (Number(count[0]?.n ?? 0) >= 24) throw new StoreError("الحد ٢٤ صورة للمنتج");
	const id = `i_${crypto.randomUUID()}`;
	await sql.query(`insert into product_images (id, product_id, data_url, sort_order)
       values ($1, $2, $3, (select coalesce(max(sort_order), -1) + 1 from product_images where product_id = $2))`, [
		id,
		data.productId,
		data.dataUrl
	]);
	return { id };
});
var deleteProductImage_createServerFn_handler = createServerRpc({
	id: "d41b03259655a589ab16708b1e50a5ffa2d797db0729386fbe83a7f08bc492ba",
	name: "deleteProductImage",
	filename: "src/lib/store.functions.ts"
}, (opts) => deleteProductImage.__executeServer(opts));
var deleteProductImage = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => parse(object({ id: string().min(1).max(80) }), raw)).handler(deleteProductImage_createServerFn_handler, async ({ context, data }) => {
	await assertAdmin(context.userId);
	await (await db())`delete from product_images where id = ${data.id}`;
	return { ok: true };
});
var deleteReview_createServerFn_handler = createServerRpc({
	id: "1cc2264210aa3f047f06e556bad5c1d4b6bac21caf899db930c84bc4489d9486",
	name: "deleteReview",
	filename: "src/lib/store.functions.ts"
}, (opts) => deleteReview.__executeServer(opts));
var deleteReview = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => parse(object({ id: string().min(1).max(80) }), raw)).handler(deleteReview_createServerFn_handler, async ({ context, data }) => {
	await assertAdmin(context.userId);
	await (await db())`delete from reviews where id = ${data.id}`;
	return { ok: true };
});
function mapOrder(row) {
	return {
		id: row.id,
		number: row.number,
		customerName: row.customer_name,
		phone: row.phone,
		fulfillment: row.fulfillment,
		status: row.status,
		totalSar: Number(row.total_sar),
		createdAt: iso(row.created_at)
	};
}
var listOrders_createServerFn_handler = createServerRpc({
	id: "136944701bc969aa8ada70fb7ca5938c4c1975bb114752711a9c68048237076a",
	name: "listOrders",
	filename: "src/lib/store.functions.ts"
}, (opts) => listOrders.__executeServer(opts));
var listOrders = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listOrders_createServerFn_handler, async ({ context }) => {
	await assertAdmin(context.userId);
	return (await (await db())`
      select id, number, customer_name, phone, fulfillment, status, total_sar, created_at
      from orders order by created_at desc
    `).map(mapOrder);
});
var getOrder_createServerFn_handler = createServerRpc({
	id: "15324980cfcd954093aba38ab79cefac7140029575b79922d2efa00ec0b6fddc",
	name: "getOrder",
	filename: "src/lib/store.functions.ts"
}, (opts) => getOrder.__executeServer(opts));
var getOrder = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((raw) => parse(object({ id: string().min(1).max(80) }), raw)).handler(getOrder_createServerFn_handler, async ({ context, data }) => {
	await assertAdmin(context.userId);
	const sql = await db();
	const order = (await sql`
      select id, number, customer_name, phone, address, fulfillment, delivery_fee_sar,
             fee_is_estimate, payment_method, status, subtotal_sar, total_sar, admin_note, created_at
      from orders where id = ${data.id} limit 1
    `)[0];
	if (!order) return null;
	const items = await sql`
      select id, product_id, product_name, size_label, qty, unit_price_sar
      from order_items where order_id = ${order.id}
    `;
	return {
		...mapOrder(order),
		address: order.address,
		deliveryFeeSar: Number(order.delivery_fee_sar),
		feeIsEstimate: Boolean(order.fee_is_estimate),
		paymentMethod: order.payment_method,
		subtotalSar: Number(order.subtotal_sar),
		adminNote: order.admin_note,
		items: items.map((item) => ({
			id: item.id,
			productId: item.product_id,
			productName: item.product_name,
			size: item.size_label,
			qty: Number(item.qty),
			unitPriceSar: Number(item.unit_price_sar)
		}))
	};
});
var updateOrder_createServerFn_handler = createServerRpc({
	id: "7b4f8aa67c87ff9494388d626a09abc2c37a1702a86b276ec488f354c190c9a0",
	name: "updateOrder",
	filename: "src/lib/store.functions.ts"
}, (opts) => updateOrder.__executeServer(opts));
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
}), raw)).handler(updateOrder_createServerFn_handler, async ({ context, data }) => {
	await assertAdmin(context.userId);
	const sql = await db();
	try {
		await sql.query(`select set_hour_order($1, $2, $3, $4)`, [
			data.id,
			data.status,
			data.deliveryFeeSar,
			data.adminNote
		]);
	} catch (error) {
		const message = error instanceof Error ? error.message : "";
		if (message.includes("cancelled_final")) throw new StoreError("الطلب الملغى لا يُعاد فتحه من هنا حتى لا يتضاعف المخزون");
		if (message.includes("missing_order")) throw new StoreError("الطلب غير موجود");
		throw new StoreError("تعذّر تحديث الطلب");
	}
	return { ok: true };
});
var linksSchema = object({
	whatsapp: string().max(200),
	channels: array(object({
		label: string().trim().min(1).max(40),
		url: string().trim().max(300)
	})).max(12),
	deliveryBaseSar: number().int().min(0).max(500)
});
var saveLinks_createServerFn_handler = createServerRpc({
	id: "64e078147b387e84a086aa68d3d03e0f4eff45c9466f9abe183078701bf58e7f",
	name: "saveLinks",
	filename: "src/lib/store.functions.ts"
}, (opts) => saveLinks.__executeServer(opts));
var saveLinks = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((raw) => parse(linksSchema, raw)).handler(saveLinks_createServerFn_handler, async ({ context, data }) => {
	await assertAdmin(context.userId);
	const whatsapp = normalizeWhatsapp(data.whatsapp);
	const channels = data.channels.map((channel) => ({
		label: channel.label.trim(),
		url: httpsUrl(channel.url)
	}));
	await (await db()).query(`update store_settings
       set whatsapp = $1, channels = $2::jsonb, delivery_base_sar = $3
       where id = 1`, [
		whatsapp,
		JSON.stringify(channels),
		data.deliveryBaseSar
	]);
	return { ok: true };
});
//#endregion
export { addProductImage_createServerFn_handler, addReview_createServerFn_handler, claimStore_createServerFn_handler, createProduct_createServerFn_handler, deleteProductImage_createServerFn_handler, deleteProduct_createServerFn_handler, deleteReview_createServerFn_handler, getChrome_createServerFn_handler, getHome_createServerFn_handler, getMyAccess_createServerFn_handler, getOrder_createServerFn_handler, getOverview_createServerFn_handler, getProduct_createServerFn_handler, getProductsByIds_createServerFn_handler, listAdminProducts_createServerFn_handler, listCatalog_createServerFn_handler, listOrders_createServerFn_handler, placeOrder_createServerFn_handler, saveLinks_createServerFn_handler, updateOrder_createServerFn_handler, updateProduct_createServerFn_handler };
