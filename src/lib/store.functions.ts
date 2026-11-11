import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import type {
  CatalogItem,
  Channel,
  ChromeData,
  HomeData,
  OrderDetail,
  OrderStatus,
  OrderSummary,
  Overview,
  ProductDetail,
  ProductInput,
  Review,
  SizeStock,
  Spot,
} from "@/lib/types";

const MAX_IMAGE = 1_600_000;

class StoreError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "StoreError";
  }
}

async function db() {
  const { getSql } = await import("@/lib/db");
  return getSql();
}

function parse<T>(schema: z.ZodType<T>, raw: unknown): T {
  const result = schema.safeParse(raw);
  if (!result.success) throw new StoreError("البيانات المرسلة غير مكتملة أو غير صالحة");
  return result.data;
}

function iso(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  return typeof value === "string" ? value : "";
}

function asSizes(value: unknown): SizeStock[] {
  const raw = typeof value === "string" ? JSON.parse(value) : value;
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const size = "size" in row ? String(row.size) : "";
    const qty = Number("qty" in row ? row.qty : NaN);
    if (!size || !Number.isFinite(qty)) return [];
    return [{ size, qty }];
  });
}

function asChannels(value: unknown): Channel[] {
  const raw = typeof value === "string" ? JSON.parse(value) : value;
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((row) => {
    if (!row || typeof row !== "object") return [];
    const label = "label" in row ? String(row.label) : "";
    const url = "url" in row ? String(row.url) : "";
    if (!label || !url) return [];
    return [{ label, url }];
  });
}

function asStringList(value: unknown): string[] {
  const raw = typeof value === "string" ? JSON.parse(value) : value;
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is string => typeof item === "string");
}

function assertImage(dataUrl: string) {
  if (!/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(dataUrl)) {
    throw new StoreError("صيغة الصورة غير مدعومة. استخدمي JPG أو PNG أو WEBP");
  }
  if (dataUrl.length > MAX_IMAGE) throw new StoreError("الصورة أكبر من المسموح بعد الضغط");
}

function httpsUrl(value: string): string {
  const url = value.trim();
  if (!url) return "";
  if (!/^https:\/\/\S+$/i.test(url)) throw new StoreError("الرابط يجب أن يبدأ بـ https://");
  return url;
}

function normalizeWhatsapp(raw: string): string {
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

async function assertAdmin(userId: string) {
  const sql = await db();
  const rows = await sql<{ user_id: string }>`select user_id from store_admins where user_id = ${userId} limit 1`;
  if (!rows.length) throw new StoreError("ليست لديك صلاحية إدارة المتجر");
}

const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  category: z.enum(["women", "kids"]),
  priceSar: z.number().int().min(1).max(100000),
  description: z.string().trim().max(4000),
  fabric: z.string().trim().max(400),
  embroidery: z.string().trim().max(400),
  stones: z.string().trim().max(400),
  details: z.string().trim().max(2000),
  sizes: z
    .array(
      z.object({
        size: z.string().trim().min(1).max(16),
        qty: z.number().int().min(0).max(9999),
      }),
    )
    .min(1)
    .max(40),
});

const catalogSql = `
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

function mapCatalog(row: {
  id: string;
  name: string;
  category: "women" | "kids";
  price_sar: number;
  sizes: unknown;
  cover: string | null;
}): CatalogItem {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    priceSar: Number(row.price_sar),
    cover: row.cover,
    sizes: asSizes(row.sizes),
  };
}

export const getChrome = createServerFn({ method: "GET" }).handler(async (): Promise<ChromeData> => {
  const sql = await db();
  const settings = await sql<{ whatsapp: string; channels: unknown; delivery_base_sar: number }>`
    select whatsapp, channels, delivery_base_sar from store_settings where id = 1
  `;
  const owners = await sql<{ n: number }>`select count(*)::int as n from store_admins`;
  const row = settings[0];
  return {
    whatsapp: row?.whatsapp ?? "",
    channels: asChannels(row?.channels ?? []),
    deliveryBaseSar: Number(row?.delivery_base_sar ?? 15),
    hasOwner: Number(owners[0]?.n ?? 0) > 0,
  };
});

export const getHome = createServerFn({ method: "GET" }).handler(async (): Promise<HomeData> => {
  const sql = await db();
  const load = async (category: "women" | "kids"): Promise<Spot[]> => {
    const rows = await sql.query<{ id: string; name: string; price_sar: number; cover: string | null }>(
      `select p.id, p.name, p.price_sar,
        (select i.data_url from product_images i where i.product_id = p.id order by i.sort_order, i.id limit 1) as cover
       from products p where p.category = $1
       order by random() limit 4`,
      [category],
    );
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      priceSar: Number(row.price_sar),
      cover: row.cover,
    }));
  };
  const [women, kids] = await Promise.all([load("women"), load("kids")]);
  return { women, kids };
});

export const listCatalog = createServerFn({ method: "GET" })
  .validator((raw: unknown) => parse(z.object({ category: z.enum(["women", "kids"]) }), raw))
  .handler(async ({ data }): Promise<CatalogItem[]> => {
    const sql = await db();
    const rows = await sql.query<Parameters<typeof mapCatalog>[0]>(
      `${catalogSql} where p.category = $1 order by p.created_at desc`,
      [data.category],
    );
    return rows.map(mapCatalog);
  });

export const getProductsByIds = createServerFn({ method: "POST" })
  .validator((raw: unknown) => parse(z.object({ ids: z.array(z.string().min(1).max(80)).max(40) }), raw))
  .handler(async ({ data }): Promise<CatalogItem[]> => {
    if (!data.ids.length) return [];
    const sql = await db();
    const rows = await sql.query<Parameters<typeof mapCatalog>[0]>(
      `${catalogSql} where p.id in (select value from jsonb_array_elements_text($1::jsonb))`,
      [JSON.stringify(data.ids)],
    );
    return rows.map(mapCatalog);
  });

export const getProduct = createServerFn({ method: "GET" })
  .validator((raw: unknown) => parse(z.object({ id: z.string().min(1).max(80) }), raw))
  .handler(async ({ data }): Promise<ProductDetail | null> => {
    const sql = await db();
    const rows = await sql<{
      id: string;
      name: string;
      category: "women" | "kids";
      price_sar: number;
      description: string;
      fabric: string;
      embroidery: string;
      stones: string;
      details: string;
    }>`select id, name, category, price_sar, description, fabric, embroidery, stones, details
       from products where id = ${data.id} limit 1`;
    const product = rows[0];
    if (!product) return null;
    const images = await sql<{ id: string; data_url: string }>`
      select id, data_url from product_images where product_id = ${product.id} order by sort_order, id
    `;
    const sizes = await sql<{ size_label: string; qty: number }>`
      select size_label, qty from product_sizes where product_id = ${product.id}
    `;
    const reviewRows = await sql<{
      id: string;
      author_name: string;
      rating: number;
      body: string;
      created_at: unknown;
      images: unknown;
    }>`
      select r.id, r.author_name, r.rating, r.body, r.created_at,
        coalesce((select json_agg(ri.data_url) from review_images ri where ri.review_id = r.id), '[]'::json) as images
      from reviews r
      where r.product_id = ${product.id}
      order by r.created_at desc
    `;
    const reviews: Review[] = reviewRows.map((row) => ({
      id: row.id,
      authorName: row.author_name,
      rating: Number(row.rating),
      body: row.body,
      createdAt: iso(row.created_at),
      images: asStringList(row.images),
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
      images: images.map((image) => ({ id: image.id, dataUrl: image.data_url })),
      sizes: sizes.map((size) => ({ size: size.size_label, qty: Number(size.qty) })),
      reviews,
    };
  });

const reviewSchema = z.object({
  productId: z.string().min(1).max(80),
  authorName: z.string().trim().min(2).max(40),
  rating: z.number().int().min(1).max(5),
  body: z.string().trim().max(1000),
  images: z.array(z.string()).max(4),
});

export const addReview = createServerFn({ method: "POST" })
  .validator((raw: unknown) => parse(reviewSchema, raw))
  .handler(async ({ data }) => {
    for (const image of data.images) assertImage(image);
    const sql = await db();
    const found = await sql<{ id: string }>`select id from products where id = ${data.productId} limit 1`;
    if (!found.length) throw new StoreError("المنتج غير موجود");
    const id = `r_${crypto.randomUUID()}`;
    await sql`
      insert into reviews (id, product_id, author_name, rating, body)
      values (${id}, ${data.productId}, ${data.authorName}, ${data.rating}, ${data.body})
    `;
    for (const image of data.images) {
      const imageId = `ri_${crypto.randomUUID()}`;
      await sql`insert into review_images (id, review_id, data_url) values (${imageId}, ${id}, ${image})`;
    }
    return { id };
  });

const checkoutSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(8).max(20),
  address: z.string().trim().max(400),
  fulfillment: z.enum(["delivery", "pickup"]),
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(80),
        size: z.string().trim().min(1).max(16),
        qty: z.number().int().min(1).max(10),
      }),
    )
    .min(1)
    .max(30),
});

export const placeOrder = createServerFn({ method: "POST" })
  .validator((raw: unknown) => parse(checkoutSchema, raw))
  .handler(async ({ data }) => {
    const digits = data.phone.replace(/[^\d]/g, "");
    if (digits.length < 8) throw new StoreError("رقم التواصل غير مكتمل");
    const address =
      data.fulfillment === "delivery"
        ? data.address.trim()
        : data.address.trim() || "استلام من المنزل";
    if (data.fulfillment === "delivery" && address.length < 4) {
      throw new StoreError("اكتبي الحي والعنوان داخل مكة");
    }
    const sql = await db();
    try {
      const rows = await sql.query<{
        order_number: string;
        subtotal_sar: number;
        delivery_fee_sar: number;
        total_sar: number;
        fee_is_estimate: boolean;
      }>(
        `select order_number, subtotal_sar, delivery_fee_sar, total_sar, fee_is_estimate
         from place_hour_order($1, $2, $3, $4, $5, $6::jsonb)`,
        [
          `o_${crypto.randomUUID()}`,
          data.name,
          data.phone.trim(),
          address,
          data.fulfillment,
          JSON.stringify(
            data.items.map((item) => ({
              product_id: item.productId,
              size_label: item.size,
              qty: item.qty,
            })),
          ),
        ],
      );
      const row = rows[0];
      if (!row) throw new StoreError("تعذّر إنشاء الطلب");
      return {
        number: row.order_number,
        subtotalSar: Number(row.subtotal_sar),
        deliveryFeeSar: Number(row.delivery_fee_sar),
        totalSar: Number(row.total_sar),
        feeIsEstimate: Boolean(row.fee_is_estimate),
      };
    } catch (error) {
      if (error instanceof StoreError) throw error;
      const message = error instanceof Error ? error.message : "";
      if (message.includes("insufficient_stock")) {
        throw new StoreError("بعض المقاسات لم تعد متوفرة بالكمية المطلوبة");
      }
      if (message.includes("empty_cart")) throw new StoreError("السلة فارغة");
      throw new StoreError("تعذّر حفظ الطلب. حاولي مرة أخرى");
    }
  });

export const getMyAccess = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await db();
    const mine = await sql<{ user_id: string }>`
      select user_id from store_admins where user_id = ${context.userId} limit 1
    `;
    const any = await sql<{ user_id: string }>`select user_id from store_admins limit 1`;
    return { isAdmin: mine.length > 0, hasOwner: any.length > 0 };
  });

export const claimStore = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await db();
    const any = await sql<{ user_id: string }>`select user_id from store_admins limit 1`;
    if (any.length && any[0].user_id !== context.userId) {
      throw new StoreError("المتجر له مالك بالفعل");
    }
    if (!any.length) {
      await sql`insert into store_admins (user_id) values (${context.userId})`;
    }
    return { ok: true };
  });

export const getOverview = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Overview> => {
    await assertAdmin(context.userId);
    const sql = await db();
    const [counts] = await sql<{
      products: number;
      women: number;
      kids: number;
      orders: number;
      new_orders: number;
      sales: number;
    }>`
      select
        (select count(*)::int from products) as products,
        (select count(*)::int from products where category = 'women') as women,
        (select count(*)::int from products where category = 'kids') as kids,
        (select count(*)::int from orders) as orders,
        (select count(*)::int from orders where status = 'new') as new_orders,
        (select coalesce(sum(total_sar), 0)::int from orders where status <> 'cancelled') as sales
    `;
    const low = await sql<{ product_name: string; size_label: string; qty: number }>`
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
        qty: Number(row.qty),
      })),
    };
  });

export const listAdminProducts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<CatalogItem[]> => {
    await assertAdmin(context.userId);
    const sql = await db();
    const rows = await sql.query<Parameters<typeof mapCatalog>[0]>(
      `${catalogSql} order by p.created_at desc`,
    );
    return rows.map(mapCatalog);
  });

async function saveSizes(productId: string, sizes: SizeStock[]) {
  const unique = new Set(sizes.map((size) => size.size.toUpperCase()));
  if (unique.size !== sizes.length) throw new StoreError("يوجد مقاس مكرر");
  const sql = await db();
  await sql.query(
    `with incoming as (
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
     select (select count(*) from deleted) + (select count(*) from upserted)`,
    [
      productId,
      JSON.stringify(sizes.map((size) => ({ size_label: size.size.toUpperCase(), qty: size.qty }))),
    ],
  );
}

function productValues(input: ProductInput) {
  return input;
}

export const createProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => parse(productSchema, raw))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const input = productValues(data);
    const id = `p_${crypto.randomUUID()}`;
    const sql = await db();
    await sql`
      insert into products (id, name, category, price_sar, description, fabric, embroidery, stones, details)
      values (
        ${id}, ${input.name}, ${input.category}, ${input.priceSar}, ${input.description},
        ${input.fabric}, ${input.embroidery}, ${input.stones}, ${input.details}
      )
    `;
    await saveSizes(id, input.sizes);
    return { id };
  });

export const updateProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) =>
    parse(productSchema.extend({ id: z.string().min(1).max(80) }), raw),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const sql = await db();
    const updated = await sql`
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
    `;
    if (!updated.length) throw new StoreError("المنتج غير موجود");
    await saveSizes(data.id, data.sizes);
    return { id: data.id };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => parse(z.object({ id: z.string().min(1).max(80) }), raw))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const sql = await db();
    await sql`delete from products where id = ${data.id}`;
    return { ok: true };
  });

export const addProductImage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) =>
    parse(z.object({ productId: z.string().min(1).max(80), dataUrl: z.string().min(20) }), raw),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    assertImage(data.dataUrl);
    const sql = await db();
    const count = await sql<{ n: number }>`
      select count(*)::int as n from product_images where product_id = ${data.productId}
    `;
    if (Number(count[0]?.n ?? 0) >= 24) throw new StoreError("الحد ٢٤ صورة للمنتج");
    const id = `i_${crypto.randomUUID()}`;
    await sql.query(
      `insert into product_images (id, product_id, data_url, sort_order)
       values ($1, $2, $3, (select coalesce(max(sort_order), -1) + 1 from product_images where product_id = $2))`,
      [id, data.productId, data.dataUrl],
    );
    return { id };
  });

export const deleteProductImage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => parse(z.object({ id: z.string().min(1).max(80) }), raw))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const sql = await db();
    await sql`delete from product_images where id = ${data.id}`;
    return { ok: true };
  });

export const deleteReview = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => parse(z.object({ id: z.string().min(1).max(80) }), raw))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const sql = await db();
    await sql`delete from reviews where id = ${data.id}`;
    return { ok: true };
  });

function mapOrder(row: {
  id: string;
  number: string;
  customer_name: string;
  phone: string;
  fulfillment: "delivery" | "pickup";
  status: OrderStatus;
  total_sar: number;
  created_at: unknown;
}): OrderSummary {
  return {
    id: row.id,
    number: row.number,
    customerName: row.customer_name,
    phone: row.phone,
    fulfillment: row.fulfillment,
    status: row.status,
    totalSar: Number(row.total_sar),
    createdAt: iso(row.created_at),
  };
}

export const listOrders = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<OrderSummary[]> => {
    await assertAdmin(context.userId);
    const sql = await db();
    const rows = await sql<{
      id: string;
      number: string;
      customer_name: string;
      phone: string;
      fulfillment: "delivery" | "pickup";
      status: OrderStatus;
      total_sar: number;
      created_at: unknown;
    }>`
      select id, number, customer_name, phone, fulfillment, status, total_sar, created_at
      from orders order by created_at desc
    `;
    return rows.map(mapOrder);
  });

export const getOrder = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => parse(z.object({ id: z.string().min(1).max(80) }), raw))
  .handler(async ({ context, data }): Promise<OrderDetail | null> => {
    await assertAdmin(context.userId);
    const sql = await db();
    const rows = await sql<{
      id: string;
      number: string;
      customer_name: string;
      phone: string;
      address: string;
      fulfillment: "delivery" | "pickup";
      delivery_fee_sar: number;
      fee_is_estimate: boolean;
      payment_method: string;
      status: OrderStatus;
      subtotal_sar: number;
      total_sar: number;
      admin_note: string;
      created_at: unknown;
    }>`
      select id, number, customer_name, phone, address, fulfillment, delivery_fee_sar,
             fee_is_estimate, payment_method, status, subtotal_sar, total_sar, admin_note, created_at
      from orders where id = ${data.id} limit 1
    `;
    const order = rows[0];
    if (!order) return null;
    const items = await sql<{
      id: string;
      product_id: string | null;
      product_name: string;
      size_label: string;
      qty: number;
      unit_price_sar: number;
    }>`
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
        unitPriceSar: Number(item.unit_price_sar),
      })),
    };
  });

export const updateOrder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) =>
    parse(
      z.object({
        id: z.string().min(1).max(80),
        status: z.enum(["new", "confirmed", "preparing", "out", "ready", "completed", "cancelled"]),
        deliveryFeeSar: z.number().int().min(0).max(500),
        adminNote: z.string().max(2000),
      }),
      raw,
    ),
  )
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const sql = await db();
    try {
      await sql.query(`select set_hour_order($1, $2, $3, $4)`, [
        data.id,
        data.status,
        data.deliveryFeeSar,
        data.adminNote,
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "";
      if (message.includes("cancelled_final")) {
        throw new StoreError("الطلب الملغى لا يُعاد فتحه من هنا حتى لا يتضاعف المخزون");
      }
      if (message.includes("missing_order")) throw new StoreError("الطلب غير موجود");
      throw new StoreError("تعذّر تحديث الطلب");
    }
    return { ok: true };
  });

const linksSchema = z.object({
  whatsapp: z.string().max(200),
  channels: z
    .array(
      z.object({
        label: z.string().trim().min(1).max(40),
        url: z.string().trim().max(300),
      }),
    )
    .max(12),
  deliveryBaseSar: z.number().int().min(0).max(500),
});

export const saveLinks = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((raw: unknown) => parse(linksSchema, raw))
  .handler(async ({ context, data }) => {
    await assertAdmin(context.userId);
    const whatsapp = normalizeWhatsapp(data.whatsapp);
    const channels = data.channels.map((channel) => ({
      label: channel.label.trim(),
      url: httpsUrl(channel.url),
    }));
    const sql = await db();
    await sql.query(
      `update store_settings
       set whatsapp = $1, channels = $2::jsonb, delivery_base_sar = $3
       where id = 1`,
      [whatsapp, JSON.stringify(channels), data.deliveryBaseSar],
    );
    return { ok: true };
  });
