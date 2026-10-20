-- PML PrintTech: bảng lưu lead báo giá (theo ERD trong BA spec mục 6).
-- Chạy trong Supabase SQL Editor. Enum khớp lib/quote.ts.
create extension if not exists pgcrypto;

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique check (reference ~ '^PML-[A-Z0-9]{6}$'),
  packaging_type text not null check (packaging_type in ('hop-giay','tui-giay','tem-nhan','mang-phuc-hop')),
  quantity_tier text not null check (quantity_tier in ('1000','5000','20000','100000')),
  material text not null check (material in ('ivory','kraft','duplex','pet-pe')),
  phone text not null check (phone ~ '^0(3|5|7|8|9)[0-9]{8}$'),
  name text check (char_length(name) <= 100),
  company text check (char_length(company) <= 150),
  note text check (char_length(note) <= 1000),
  est_min_vnd integer,
  est_max_vnd integer,
  consent boolean not null default false,
  status text not null default 'new' check (status in ('new','contacted','quoted','won','lost')),
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists quote_requests_dedupe_idx on public.quote_requests (phone, packaging_type, created_at);
create index if not exists quote_requests_created_at_idx on public.quote_requests (created_at);

create table if not exists public.notification_log (
  id uuid primary key default gen_random_uuid(),
  quote_request_id uuid not null references public.quote_requests(id) on delete cascade,
  channel text not null check (channel in ('email','telegram','zalo')),
  result text not null check (result in ('sent','failed')),
  error text,
  sent_at timestamptz not null default now()
);

-- RLS bật, không có policy cho anon/authenticated → chỉ service role (server) đọc/ghi được.
alter table public.quote_requests enable row level security;
alter table public.notification_log enable row level security;
revoke all on public.quote_requests from anon, authenticated;
revoke all on public.notification_log from anon, authenticated;
