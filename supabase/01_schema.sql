-- CafeSite / jalankan seluruh file di Supabase SQL Editor, lalu 02_seed.sql.
-- Tidak membuat akun atau password contoh. Lihat SETUP_SUPABASE.md untuk admin pertama.
begin;
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','staff'))
);
create table if not exists public.staff_modules (
  id text primary key check (id in ('orders','menu','tables','cafe','gallery','testimonials','faq','location','reports')),
  enabled boolean not null default false
);
insert into public.staff_modules(id,enabled) values
 ('orders',true),('menu',true),('tables',true),('cafe',false),('gallery',false),
 ('testimonials',false),('faq',false),('location',false),('reports',false)
on conflict do nothing;

create table if not exists public.menu_items (
  id text primary key check (length(id) between 1 and 80),
  data jsonb not null check (jsonb_typeof(data)='object' and data->>'id'=id
    and data ? 'price' and jsonb_typeof(data->'price')='number'
    and (data->>'price')::numeric between 0 and 10000000
    and (data->>'price')::numeric=trunc((data->>'price')::numeric)
    and data->>'category' in ('coffee','non-coffee','food','snack','dessert')),
  is_available boolean not null default true,
  sort_order integer not null default 0
);
create table if not exists public.content (
  key text primary key check (key in ('cafe','gallery','testimonials','faq','location')),
  data jsonb not null
);
create table if not exists public.floors (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 80),
  sort_order integer not null default 0
);
create table if not exists public.cafe_tables (
  id text primary key check (id ~ '^[A-Za-z0-9_-]{1,40}$'),
  floor_id uuid not null references public.floors(id) on delete restrict,
  label text not null check (length(label) between 1 and 80),
  x numeric not null default 10 check (x between 0 and 100),
  y numeric not null default 10 check (y between 0 and 100),
  status text not null default 'available' check (status in ('available','occupied','dirty'))
);
create sequence if not exists public.order_queue_seq;
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  idempotency_key uuid not null,
  queue_number bigint not null default nextval('public.order_queue_seq'),
  customer_name text not null check(length(customer_name) between 2 and 80),
  phone text not null check(phone ~ '^[0-9]{8,15}$'),
  fulfillment text not null check(fulfillment in ('dine_in','takeaway')),
  table_id text references public.cafe_tables(id) on delete restrict,
  status text not null default 'waiting' check(status in ('waiting','preparing','ready','completed','cancelled')),
  payment_method text not null default 'cod' check(payment_method='cod'),
  payment_status text not null default 'unpaid' check(payment_status in ('unpaid','paid')),
  total bigint not null default 0 check(total between 0 and 100000000),
  paid_amount bigint not null default 0 check(paid_amount >= 0 and paid_amount <= total),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id,idempotency_key),
  check ((fulfillment='dine_in' and table_id is not null) or (fulfillment='takeaway' and table_id is null)),
  check ((payment_status='paid' and paid_amount=total) or (payment_status='unpaid' and paid_amount=0))
);
create unique index if not exists one_active_order_per_table on public.orders(table_id)
where table_id is not null and status in ('waiting','preparing','ready');
create index if not exists orders_owner_created on public.orders(user_id,created_at desc);
create index if not exists orders_created on public.orders(created_at desc);
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id text not null,
  name text not null,
  unit_price bigint not null check(unit_price between 0 and 10000000),
  quantity integer not null check(quantity between 1 and 20),
  notes text not null default '' check(length(notes)<=300),
  created_at timestamptz not null default now()
);
create index if not exists order_items_order on public.order_items(order_id);
create table if not exists public.order_requests (
  order_id uuid not null references public.orders(id) on delete cascade,
  idempotency_key uuid not null,
  primary key(order_id,idempotency_key)
);

-- SECURITY DEFINER helpers have a fixed search_path and expose no PII.
create or replace function public.can_module(module_name text)
returns boolean language sql stable security definer set search_path=public
as $$ select exists(select 1 from public.profiles p where p.id=auth.uid()
 and (p.role='admin' or (p.role='staff' and exists(select 1 from public.staff_modules m where m.id=module_name and m.enabled)))) $$;
revoke all on function public.can_module(text) from public;
grant execute on function public.can_module(text) to anon,authenticated,service_role;

alter table public.profiles enable row level security;
alter table public.staff_modules enable row level security;
alter table public.menu_items enable row level security;
alter table public.content enable row level security;
alter table public.floors enable row level security;
alter table public.cafe_tables enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.order_requests enable row level security;
drop policy if exists profile_read on public.profiles;
create policy profile_read on public.profiles for select to authenticated using(id=auth.uid() or public.can_module('admin'));
drop policy if exists modules_read on public.staff_modules;
create policy modules_read on public.staff_modules for select to authenticated using(exists(select 1 from public.profiles where id=auth.uid()));
drop policy if exists menu_public on public.menu_items;
create policy menu_public on public.menu_items for select to anon,authenticated using(true);
drop policy if exists content_public on public.content;
create policy content_public on public.content for select to anon,authenticated using(true);
drop policy if exists floors_public on public.floors;
create policy floors_public on public.floors for select to anon,authenticated using(true);
drop policy if exists tables_public on public.cafe_tables;
create policy tables_public on public.cafe_tables for select to anon,authenticated using(true);
drop policy if exists orders_read on public.orders;
create policy orders_read on public.orders for select to authenticated using(user_id=auth.uid() or public.can_module('orders') or public.can_module('reports'));
drop policy if exists items_read on public.order_items;
create policy items_read on public.order_items for select to authenticated using(exists(select 1 from public.orders o where o.id=order_id));

-- No client-side write grants. All mutations pass authenticated server validation.
revoke all on public.profiles,public.staff_modules,public.menu_items,public.content,public.floors,public.cafe_tables,public.orders,public.order_items,public.order_requests from anon,authenticated;
grant select on public.menu_items,public.content,public.floors,public.cafe_tables to anon,authenticated;
grant select on public.profiles,public.staff_modules,public.orders,public.order_items to authenticated;
grant all on public.profiles,public.staff_modules,public.menu_items,public.content,public.floors,public.cafe_tables,public.orders,public.order_items,public.order_requests to service_role;
grant usage,select on sequence public.order_queue_seq to service_role;

create or replace function public.order_document(order_uuid uuid)
returns jsonb language sql stable security definer set search_path=public
as $$ select to_jsonb(o)-'idempotency_key' || jsonb_build_object('items',coalesce((select jsonb_agg(to_jsonb(i)-'order_id' order by i.created_at,i.id) from public.order_items i where i.order_id=o.id),'[]'::jsonb)) from public.orders o where o.id=order_uuid $$;

create or replace function public.insert_order_items(order_uuid uuid, line_items jsonb)
returns bigint language plpgsql security definer set search_path=public
as $$
declare line jsonb; item public.menu_items; quantity_value integer; amount bigint:=0; portions integer:=0;
begin
 if jsonb_typeof(line_items) <> 'array' or jsonb_array_length(line_items) not between 1 and 30 then raise exception 'Pesanan harus berisi 1–30 item.'; end if;
 for line in select * from jsonb_array_elements(line_items) loop
   if jsonb_typeof(line->'quantity') <> 'number' or (line->>'quantity')::numeric <> trunc((line->>'quantity')::numeric) then raise exception 'Jumlah tidak valid.'; end if;
   quantity_value:=(line->>'quantity')::integer;
   if quantity_value not between 1 and 20 or length(coalesce(line->>'notes',''))>300 then raise exception 'Jumlah atau catatan tidak valid.'; end if;
   select * into item from public.menu_items where id=line->>'menuItemId' for share;
   if not found or not item.is_available then raise exception 'Salah satu menu habis atau tidak tersedia. Perbarui keranjang.'; end if;
   amount:=amount+(item.data->>'price')::bigint*quantity_value;
   portions:=portions+quantity_value;
   if portions>100 then raise exception 'Maksimal 100 porsi dalam satu pengiriman.'; end if;
   insert into public.order_items(order_id,menu_item_id,name,unit_price,quantity,notes)
   values(order_uuid,item.id,item.data->>'name',(item.data->>'price')::bigint,quantity_value,coalesce(line->>'notes',''));
 end loop;
 return amount;
end $$;

create or replace function public.create_cafe_order(actor uuid, request_key uuid, customer text, customer_phone text, fulfillment_value text, table_code text, line_items jsonb)
returns jsonb language plpgsql security definer set search_path=public
as $$
declare order_uuid uuid; table_row public.cafe_tables; total_value bigint;
begin
 perform pg_advisory_xact_lock(hashtextextended(actor::text,0));
 select id into order_uuid from public.orders where user_id=actor and idempotency_key=request_key;
 if found then return public.order_document(order_uuid); end if;
 if (select count(*) from public.orders where user_id=actor and created_at>now()-interval '10 minutes')>=5 then raise exception 'Terlalu banyak pesanan. Tunggu beberapa menit atau hubungi kasir.'; end if;
 if fulfillment_value='dine_in' then
   select * into table_row from public.cafe_tables where id=table_code for update;
   if not found or table_row.status<>'available' then raise exception 'Meja tidak tersedia. Hubungi kasir atau pilih meja lain.'; end if;
 else table_code:=null;
 end if;
 insert into public.orders(user_id,idempotency_key,customer_name,phone,fulfillment,table_id)
 values(actor,request_key,customer,customer_phone,fulfillment_value,table_code) returning id into order_uuid;
 total_value:=public.insert_order_items(order_uuid,line_items);
 update public.orders set total=total_value where id=order_uuid;
 if table_code is not null then update public.cafe_tables set status='occupied' where id=table_code; end if;
 return public.order_document(order_uuid);
end $$;

create or replace function public.add_cafe_order_items(actor uuid, order_uuid uuid, request_key uuid, line_items jsonb)
returns jsonb language plpgsql security definer set search_path=public
as $$
declare current_order public.orders; additional bigint;
begin
 select * into current_order from public.orders where id=order_uuid and user_id=actor for update;
 if not found then raise exception 'Pesanan tidak ditemukan.'; end if;
 if exists(select 1 from public.order_requests where order_id=order_uuid and idempotency_key=request_key) then return public.order_document(order_uuid); end if;
 if current_order.status not in ('waiting','preparing','ready') or current_order.payment_status<>'unpaid' then raise exception 'Pesanan sudah dibayar atau ditutup. Buat pesanan baru melalui kasir.'; end if;
 if (select coalesce(sum(quantity),0) from public.order_items where order_id=order_uuid)>=200 then raise exception 'Batas pesanan tercapai. Hubungi kasir.'; end if;
 additional:=public.insert_order_items(order_uuid,line_items);
 update public.orders set total=total+additional,status=case when status='ready' then 'preparing' else status end,updated_at=now() where id=order_uuid;
 insert into public.order_requests(order_id,idempotency_key) values(order_uuid,request_key);
 return public.order_document(order_uuid);
end $$;

create or replace function public.update_cafe_order(order_uuid uuid, next_status text default null, mark_paid boolean default false)
returns jsonb language plpgsql security definer set search_path=public
as $$
declare current_order public.orders;
begin
 select * into current_order from public.orders where id=order_uuid for update;
 if not found then raise exception 'Pesanan tidak ditemukan.'; end if;
 if mark_paid and current_order.status in ('completed','cancelled') then raise exception 'Pesanan sudah ditutup.'; end if;
 if next_status is not null and next_status<>current_order.status then
   if not ((current_order.status='waiting' and next_status in ('preparing','cancelled'))
       or (current_order.status='preparing' and next_status='ready')
       or (current_order.status='ready' and next_status='completed')) then raise exception 'Urutan status tidak valid.'; end if;
   if next_status='cancelled' and current_order.payment_status='paid' then raise exception 'Pesanan sudah dibayar; hubungi admin untuk penanganan pengembalian.'; end if;
   if next_status='completed' and current_order.payment_status<>'paid' and not mark_paid then raise exception 'Konfirmasi pembayaran kasir sebelum menyelesaikan pesanan.'; end if;
 end if;
 if mark_paid and next_status='cancelled' then raise exception 'Pembayaran dan pembatalan tidak dapat dilakukan bersamaan.'; end if;
 update public.orders set status=coalesce(next_status,status),
  payment_status=case when mark_paid then 'paid' else payment_status end,
  paid_amount=case when mark_paid then total else paid_amount end,updated_at=now() where id=order_uuid;
 if next_status in ('completed','cancelled') and current_order.table_id is not null then
   update public.cafe_tables set status='dirty' where id=current_order.table_id;
 end if;
 return public.order_document(order_uuid);
end $$;

create or replace function public.save_cafe_table(table_code text, floor_uuid uuid, table_label text, pos_x numeric, pos_y numeric, new_status text)
returns jsonb language plpgsql security definer set search_path=public
as $$
declare table_row public.cafe_tables;
begin
 perform pg_advisory_xact_lock(hashtextextended(table_code,1));
 select * into table_row from public.cafe_tables where id=table_code for update;
 if exists(select 1 from public.orders where table_id=table_code and status in ('waiting','preparing','ready')) and new_status<>'occupied' then raise exception 'Meja memiliki pesanan aktif. Selesaikan pesanan terlebih dahulu.'; end if;
 insert into public.cafe_tables(id,floor_id,label,x,y,status) values(table_code,floor_uuid,table_label,pos_x,pos_y,new_status)
 on conflict(id) do update set floor_id=excluded.floor_id,label=excluded.label,x=excluded.x,y=excluded.y,status=excluded.status
 returning * into table_row;
 return to_jsonb(table_row);
end $$;

create or replace function public.delete_cafe_table(table_code text)
returns void language plpgsql security definer set search_path=public
as $$
begin
 perform pg_advisory_xact_lock(hashtextextended(table_code,1));
 if exists(select 1 from public.orders where table_id=table_code and status in ('waiting','preparing','ready')) then
  raise exception 'Meja memiliki pesanan aktif. Selesaikan pesanan terlebih dahulu.';
 end if;
 delete from public.cafe_tables where id=table_code;
end $$;

-- Explicitly revoke PostgreSQL's default PUBLIC execute on privileged functions.
revoke all on function public.order_document(uuid) from public,anon,authenticated;
revoke all on function public.insert_order_items(uuid,jsonb) from public,anon,authenticated;
revoke all on function public.create_cafe_order(uuid,uuid,text,text,text,text,jsonb) from public,anon,authenticated;
revoke all on function public.add_cafe_order_items(uuid,uuid,uuid,jsonb) from public,anon,authenticated;
revoke all on function public.update_cafe_order(uuid,text,boolean) from public,anon,authenticated;
revoke all on function public.save_cafe_table(text,uuid,text,numeric,numeric,text) from public,anon,authenticated;
revoke all on function public.delete_cafe_table(text) from public,anon,authenticated;
grant execute on function public.order_document(uuid),public.insert_order_items(uuid,jsonb),public.create_cafe_order(uuid,uuid,text,text,text,text,jsonb),public.add_cafe_order_items(uuid,uuid,uuid,jsonb),public.update_cafe_order(uuid,text,boolean),public.save_cafe_table(text,uuid,text,numeric,numeric,text),public.delete_cafe_table(text) to service_role;

-- Staff upload only raster assets. No SVG/HTML, random file names, no overwrites.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('cafe-assets','cafe-assets',true,5242880,array['image/jpeg','image/png','image/webp','image/avif'])
on conflict(id) do update set public=true,file_size_limit=5242880,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists cafe_assets_read on storage.objects;
create policy cafe_assets_read on storage.objects for select to anon,authenticated using(bucket_id='cafe-assets');
drop policy if exists cafe_assets_insert on storage.objects;
create policy cafe_assets_insert on storage.objects for insert to authenticated with check(bucket_id='cafe-assets' and (public.can_module('menu') or public.can_module('gallery')));

-- Supabase Realtime broadcasts changes while enforcing each subscriber's SELECT RLS.
do $$ declare target text; begin
 if exists(select 1 from pg_publication where pubname='supabase_realtime') then
  foreach target in array array['orders','order_items','menu_items','cafe_tables','floors','content','staff_modules','profiles'] loop
   if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename=target) then
    execute format('alter publication supabase_realtime add table public.%I',target);
   end if;
  end loop;
 end if;
end $$;
commit;
