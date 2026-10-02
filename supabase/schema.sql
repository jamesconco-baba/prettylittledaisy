create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null, description text,
  collection text, price_pence int not null check (price_pence >= 0),
  images text[] default '{}', active boolean default true, created_at timestamptz default now()
);
create table variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products on delete cascade,
  size text not null, colour text, stock int not null default 0 check (stock >= 0),
  unique (product_id, size, colour)
);
create table orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique, email text not null, shipping jsonb not null,
  status text not null default 'paid' check (status in ('paid','packed','shipped','delivered','refunded')),
  tracking_number text, subtotal_pence int, shipping_pence int, discount_pence int default 0,
  total_pence int, gift_message text, created_at timestamptz default now()
);
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders on delete cascade,
  variant_id uuid references variants, name text, size text, qty int, unit_pence int
);
create table discount_codes (
  code text primary key, percent_off int check (percent_off between 1 and 100),
  amount_off_pence int, active boolean default true, expires_at timestamptz, uses int default 0, max_uses int
);
alter table products enable row level security; alter table variants enable row level security;
alter table orders enable row level security; alter table order_items enable row level security;
alter table discount_codes enable row level security;
create policy "public read products" on products for select using (active);
create policy "public read variants" on variants for select using (true);

-- Phase 2: seed the four starter products with all sizes (safe to run once)
insert into products (slug,name,collection,price_pence,description) values
('ballerina-tulle-dress','Ballerina Tulle Dress','Occasion',5400,'Layered tulle skirt with a satin waist bow and ribbon ties at the shoulder.'),
('blossom-party-dress','Blossom Party Dress','Party',4800,'Soft rose dress with a gathered skirt, made for birthdays and twirling.'),
('duckling-day-dress','Duckling Day Dress','Everyday',3600,'Easy cotton dress in butter yellow with a pink bow detail.'),
('princess-occasion-gown','Princess Occasion Gown','Occasion',6800,'Floor-skimming ivory gown with a lined bodice and pearl buttons.');
insert into variants (product_id,size,stock) select p.id,s,5 from products p, unnest(array['1-2Y','2-3Y','3-4Y','4-5Y','5-6Y','6-7Y']) s;
