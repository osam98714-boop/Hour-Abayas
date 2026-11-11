-- Hour Abayas store: catalog, per-size stock, guest orders, reviews, social links.
-- Payment stays cash-on-delivery. payment_method is stored so a real gateway
-- can be added later; nothing here charges a card.

create table if not exists store_settings (
  id int primary key default 1 check (id = 1),
  whatsapp text not null default '',
  channels jsonb not null default '[]'::jsonb,
  delivery_base_sar int not null default 15 check (delivery_base_sar >= 0 and delivery_base_sar <= 500)
);

insert into store_settings (id) values (1)
on conflict (id) do nothing;

create table if not exists store_admins (
  user_id text primary key,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id text primary key,
  name text not null,
  category text not null check (category in ('women', 'kids')),
  price_sar int not null check (price_sar >= 0),
  description text not null default '',
  fabric text not null default '',
  embroidery text not null default '',
  stones text not null default '',
  details text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on products (category, created_at desc);

create table if not exists product_images (
  id text primary key,
  product_id text not null references products (id) on delete cascade,
  data_url text not null,
  sort_order int not null default 0
);

create index if not exists product_images_product_idx on product_images (product_id, sort_order);

create table if not exists product_sizes (
  product_id text not null references products (id) on delete cascade,
  size_label text not null,
  qty int not null default 0 check (qty >= 0),
  primary key (product_id, size_label)
);

create sequence if not exists order_seq;

create table if not exists orders (
  id text primary key,
  number text not null unique,
  customer_name text not null,
  phone text not null,
  address text not null default '',
  fulfillment text not null check (fulfillment in ('delivery', 'pickup')),
  delivery_fee_sar int not null default 0,
  fee_is_estimate boolean not null default false,
  payment_method text not null default 'cod',
  status text not null default 'new',
  subtotal_sar int not null,
  total_sar int not null,
  admin_note text not null default '',
  stock_restored boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_created_idx on orders (created_at desc);

create table if not exists order_items (
  id text primary key,
  order_id text not null references orders (id) on delete cascade,
  product_id text,
  product_name text not null,
  size_label text not null,
  qty int not null check (qty > 0),
  unit_price_sar int not null
);

create index if not exists order_items_order_idx on order_items (order_id);

create table if not exists reviews (
  id text primary key,
  product_id text not null references products (id) on delete cascade,
  author_name text not null,
  rating int not null check (rating between 1 and 5),
  body text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists reviews_product_idx on reviews (product_id, created_at desc);

create table if not exists review_images (
  id text primary key,
  review_id text not null references reviews (id) on delete cascade,
  data_url text not null
);

-- One statement, one transaction: stock check + decrement + order insert.
-- A raised exception rolls the decrement back, including under concurrency.
create or replace function place_hour_order(
  p_order_id text,
  p_name text,
  p_phone text,
  p_address text,
  p_fulfillment text,
  p_items jsonb
) returns table (
  order_number text,
  subtotal_sar int,
  delivery_fee_sar int,
  total_sar int,
  fee_is_estimate boolean
)
language plpgsql
as $fn$
declare
  v_base int;
  v_fee int;
  v_sub int;
  v_wanted int;
  v_updated int;
  v_number text;
begin
  if p_fulfillment not in ('delivery', 'pickup') then
    raise exception 'bad_fulfillment';
  end if;

  select s.delivery_base_sar into v_base from store_settings s where s.id = 1;
  if v_base is null then
    v_base := 15;
  end if;
  v_fee := case when p_fulfillment = 'delivery' then v_base else 0 end;

  select count(*) into v_wanted
  from (
    select x.product_id, x.size_label
    from jsonb_to_recordset(p_items) as x(product_id text, size_label text, qty int)
    where x.qty > 0
    group by x.product_id, x.size_label
  ) wanted;

  if v_wanted = 0 then
    raise exception 'empty_cart';
  end if;

  select count(*) into v_updated
  from (
    select t.product_id, t.size_label, t.qty
    from (
      select x.product_id, x.size_label, sum(x.qty)::int as qty
      from jsonb_to_recordset(p_items) as x(product_id text, size_label text, qty int)
      where x.qty > 0
      group by x.product_id, x.size_label
    ) t
    join products p on p.id = t.product_id
    join product_sizes ps
      on ps.product_id = t.product_id
     and ps.size_label = t.size_label
     and ps.qty >= t.qty
  ) ok;

  if v_updated <> v_wanted then
    raise exception 'insufficient_stock';
  end if;

  update product_sizes ps
  set qty = ps.qty - t.qty
  from (
    select x.product_id, x.size_label, sum(x.qty)::int as qty
    from jsonb_to_recordset(p_items) as x(product_id text, size_label text, qty int)
    where x.qty > 0
    group by x.product_id, x.size_label
  ) t
  where ps.product_id = t.product_id
    and ps.size_label = t.size_label
    and ps.qty >= t.qty;

  get diagnostics v_updated = row_count;
  if v_updated <> v_wanted then
    raise exception 'insufficient_stock';
  end if;

  select coalesce(sum(p.price_sar * t.qty), 0)::int into v_sub
  from (
    select x.product_id, x.size_label, sum(x.qty)::int as qty
    from jsonb_to_recordset(p_items) as x(product_id text, size_label text, qty int)
    where x.qty > 0
    group by x.product_id, x.size_label
  ) t
  join products p on p.id = t.product_id;

  v_number := 'HR-' || lpad(nextval('order_seq')::text, 6, '0');

  insert into orders (
    id, number, customer_name, phone, address, fulfillment,
    delivery_fee_sar, fee_is_estimate, payment_method, status,
    subtotal_sar, total_sar
  ) values (
    p_order_id, v_number, p_name, p_phone, p_address, p_fulfillment,
    v_fee, p_fulfillment = 'delivery', 'cod', 'new',
    v_sub, v_sub + v_fee
  );

  insert into order_items (id, order_id, product_id, product_name, size_label, qty, unit_price_sar)
  select
    md5(p_order_id || t.product_id || t.size_label || random()::text),
    p_order_id,
    t.product_id,
    p.name,
    t.size_label,
    t.qty,
    p.price_sar
  from (
    select x.product_id, x.size_label, sum(x.qty)::int as qty
    from jsonb_to_recordset(p_items) as x(product_id text, size_label text, qty int)
    where x.qty > 0
    group by x.product_id, x.size_label
  ) t
  join products p on p.id = t.product_id;

  return query
  select v_number, v_sub, v_fee, v_sub + v_fee, (p_fulfillment = 'delivery');
end;
$fn$;

create or replace function set_hour_order(
  p_id text,
  p_status text,
  p_fee int,
  p_note text
) returns void
language plpgsql
as $fn$
declare
  v_status text;
  v_restored boolean;
  v_sub int;
begin
  if p_status not in ('new', 'confirmed', 'preparing', 'out', 'ready', 'completed', 'cancelled') then
    raise exception 'bad_status';
  end if;
  if p_fee < 0 or p_fee > 500 then
    raise exception 'bad_fee';
  end if;

  select status, stock_restored, subtotal_sar
    into v_status, v_restored, v_sub
  from orders
  where id = p_id
  for update;

  if not found then
    raise exception 'missing_order';
  end if;

  if v_status = 'cancelled' and p_status <> 'cancelled' then
    raise exception 'cancelled_final';
  end if;

  if p_status = 'cancelled' and v_status <> 'cancelled' and not v_restored then
    insert into product_sizes (product_id, size_label, qty)
    select oi.product_id, oi.size_label, sum(oi.qty)::int
    from order_items oi
    join products p on p.id = oi.product_id
    where oi.order_id = p_id
    group by oi.product_id, oi.size_label
    on conflict (product_id, size_label)
    do update set qty = product_sizes.qty + excluded.qty;
    v_restored := true;
  end if;

  update orders set
    status = p_status,
    delivery_fee_sar = p_fee,
    fee_is_estimate = false,
    admin_note = left(p_note, 2000),
    total_sar = v_sub + p_fee,
    stock_restored = v_restored,
    updated_at = now()
  where id = p_id;
end;
$fn$;
