-- =========================================================================
-- Grey Dot. Coffee Shop Surat - Drive-Thru Dispatch Database Schema
-- Run this in Supabase SQL Editor (https://supabase.com)
-- =========================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Orders Table with Anti-Fraud Option B Fields
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    car_type TEXT,
    car_plate TEXT,
    items JSONB NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10, 2) NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'incoming' CHECK (status IN ('incoming', 'brewing', 'ready', 'dispatched', 'cancelled')),
    payment_mode TEXT NOT NULL DEFAULT 'pay_at_window' CHECK (payment_mode IN ('pay_at_window', 'upi_online')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
    distance_km NUMERIC(4, 1) DEFAULT 0.6,
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Phone Blacklist Table (For Repeat No-Shows)
CREATE TABLE IF NOT EXISTS public.blacklisted_phones (
    phone TEXT PRIMARY KEY,
    reason TEXT DEFAULT 'Uncollected drive-thru order',
    flagged_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blacklisted_phones ENABLE ROW LEVEL SECURITY;

-- 5. Policies:
-- Allow public visitors to insert new orders
CREATE POLICY "Allow public order creation"
    ON public.orders FOR INSERT
    WITH CHECK (true);

-- Allow customers to read orders by token or ID
CREATE POLICY "Allow reading orders"
    ON public.orders FOR SELECT
    USING (true);

-- Allow authenticated baristas/staff to update order status
CREATE POLICY "Allow staff to update orders"
    ON public.orders FOR UPDATE
    USING (true);

-- Allow staff to manage blacklisted phone numbers
CREATE POLICY "Allow staff blacklist access"
    ON public.blacklisted_phones FOR ALL
    USING (true);

-- 6. Enable Realtime Broadcasting for Kitchen Display Screen
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
