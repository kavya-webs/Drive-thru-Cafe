-- =========================================================================
-- Grey Dot. Coffee Shop Drive-Thru — Supabase Database Schema
-- Run this in your Supabase project's SQL Editor to create tables & realtime sync
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Orders Table
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  token text not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  car_type text default '',
  car_plate text default '',
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(10,2) not null default 0.00,
  tax numeric(10,2) not null default 0.00,
  total numeric(10,2) not null default 0.00,
  status text not null check (status in ('incoming', 'brewing', 'ready', 'dispatched')) default 'incoming',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.orders enable row level security;

-- Policies:
-- Allow anyone (public/customers) to insert an order
create policy "Allow public to create drive-thru orders"
  on public.orders for insert
  with check (true);

-- Allow public to read orders (for live token tracking)
create policy "Allow public to read orders"
  on public.orders for select
  using (true);

-- Allow staff/admin to update order status
create policy "Allow staff to update order status"
  on public.orders for update
  using (true);

-- 3. Enable Realtime Replication on Orders Table
-- This triggers instant push alerts to the Barista tablet when a new car orders!
alter publication supabase_realtime add table public.orders;

-- 4. Sample Seed Data
insert into public.orders (token, customer_name, customer_phone, customer_email, car_type, car_plate, items, subtotal, tax, total, status)
values
  ('GD-41', 'Hardik S.', '+91 99042 11223', 'hardik@gmail.com', '', '', '[{"name": "Spanish Condensed Milk Latte", "price": 169, "quantity": 1}, {"name": "Blueberry Cheesecake Thick Shake", "price": 199, "quantity": 1}]'::jsonb, 368.00, 18.40, 386.40, 'ready'),
  ('GD-42', 'Kavya Patel', '+91 97244 08033', 'kavya@example.com', 'White Creta', 'GJ-05-AB-1234', '[{"name": "Grey Dot Classic Cold Coffee", "price": 179, "quantity": 1}, {"name": "Classic Margherita Pizza (8\")", "price": 249, "quantity": 1}]'::jsonb, 428.00, 21.40, 449.40, 'brewing'),
  ('GD-43', 'Vikram M.', '+91 99241 88990', 'vikram@gmail.com', 'Black Thar', 'GJ-05-CD-9988', '[{"name": "Hazelnut Crunch Frappe", "price": 219, "quantity": 2}, {"name": "Peri-Peri Cheese Fries", "price": 149, "quantity": 1}]'::jsonb, 587.00, 29.35, 616.35, 'incoming');
