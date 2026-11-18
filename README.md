# Grey Dot. Coffee Shop — Drive-Thru & To-Go System

> A dedicated, mobile-first drive-thru digital ordering and kitchen management system for **Grey Dot. Coffee Shop** (ITC Mantra, Ram Chowk, Mota Varachha, Surat).

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**, with real-time push architecture.

---

## 🛡️ Anti-Fraud & Fake Order Protection (Option B Integrated)

To prevent prank orders, food wastage, and uncollected drive-thru orders with zero-advance payment, this system implements an industry-tested multi-layer security matrix:

1. **WhatsApp OTP Verification:**
   * When signing in or placing an order, customers receive an instant 4-digit verification code on WhatsApp.
   * Prevents ordering with someone else's phone number or fake identity.
   * *Demo Testing Code:* **`4242`** (with 1-click auto-fill button).

2. **Geofencing Location Perimeter (< 3.0 km):**
   * Uses GPS coordinates for **Grey Dot at Ram Chowk, Mota Varachha** (`21.2385° N, 72.8788° E`).
   * "Pay at Window" is strictly unlocked **only when the vehicle is within 3 km** of the drive-thru lane.
   * If a customer orders from across town (> 3 km away), Pay-at-Window is blocked to prevent drinks melting, and 1-tap UPI prepayment is required.
   * Includes 1-click demo toggles in the cart: **`Nearby (0.6km)`** vs **`Far (15km)`** for live client testing.

3. **Order Value Threshold (The ₹350 Rule):**
   * **Orders ≤ ₹350 (1–2 coffees/fries):** Can proceed with **Pay at Window (Cash / UPI upon collection)** with ₹0 upfront payment.
   * **Orders > ₹350 (Pizzas, family orders):** Automatically enforces **1-Tap UPI Payment (GPay / PhonePe / Paytm / Dynamic QR)** to guarantee zero kitchen wastage.

4. **Barista No-Show Reporting & Blacklist:**
   * If an uncollected order sits at the drive-thru window and the customer drives away without paying, the barista taps **`❌ No-Show / Cancel`** on the KDS.
   * That phone number is instantly blacklisted in the system (`blacklisted_phones` table / `greydot-blacklist`).
   * Any future order from that phone number permanently disables "Pay at Window" and requires full UPI payment in advance.
   * Baristas can inspect and manage all blacklisted numbers from the KDS top bar.

---

## ✨ System Features & Architecture

* **Unauthenticated Browsing by Default:** Public visitors can browse the full menu, categories, and customize their cart without logging in.
* **Role-Based Access Control:**
  * Public customers see only **Menu** and **Live Token** tracker.
  * Barista Display is only accessible via **Sign In** using credentials:
    * **Email:** `admin@gmail.com`
    * **Password:** `admin`
  * When logged in as admin, the interface renders **the Barista Screen only** with full KDS controls, sound toggles, and live lane dispatch.
* **Commercial Food Photography:** 7 high-resolution commercial food photographs stored locally in `/public/images/`.
* **Optional Vehicle Details:** Car Model & Number Plate inputs formatted with automotive badges on tickets.
* **Web Audio Synthesis:** Two-tone cafe chime and tri-tone ready alert play without external MP3 dependencies.

---

## 🚀 Running Locally

```bash
# Development
npm run dev

# Production Build
npm run build
npm start
```

---

## 🗄️ Supabase Cloud Setup

The app runs with local state simulation out-of-the-box. To enable persistent multi-device cloud synchronization across customer phones and counter iPads:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab, paste the contents of `supabase-schema.sql`, and click **Run**.
3. Add environment variables in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
