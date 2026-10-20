-- PML PrintTech: bảng lead báo giá, ERD MVP theo "TRẢ LỜI OPEN-1..8" (mục 3) trong BA spec.
-- Chạy trong Supabase SQL Editor. Không lưu IP, không dedupe, không UTM (OPEN-3/4/6).
create extension if not exists pgcrypto;

create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null,
  packaging_type text,
  quantity int,
  material text,
  phone text,
  price_min int,
  price_max int,
  created_at timestamptz default now()
);

-- RLS bật, KHÔNG có policy nào → anon/authenticated không đọc/ghi được; chỉ service role (server) ghi.
alter table public.quote_requests enable row level security;
revoke all on public.quote_requests from anon, authenticated;
