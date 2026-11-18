# Grey Dot. Coffee Shop — Drive-Thru & To-Go System

> A dedicated, mobile-first drive-thru digital ordering and kitchen management system for **Grey Dot. Coffee Shop** (ITC Mantra, Ram Chowk, Mota Varachha, Surat).

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**, with real-time push architecture.

---

## 🚗 Physical Payment Policy (100% Pay at Window)

* **Zero Online Payment Gateways:** All orders are paid for **physically upon collection** at the Lane 1 drive-thru window.
* **Accepted at Window:** Cash, Counter UPI QR scan, or Debit/Credit Card on the POS terminal.
* **Customer Verification:** Customer identity is verified via WhatsApp OTP (demo code `4242`) to prevent prank orders using fake phone numbers.
* **Geofence Awareness:** Displays proximity to Grey Dot Ram Chowk (`< 3.0 km`) so customers order when approaching the lane.
* **No-Show Blacklist:** If an order is prepared and the vehicle does not arrive to pay, the barista marks `❌ No-Show / Cancel` on the KDS terminal, which flags that number from placing future orders.

---

## ✨ Features & User Experience

1. **Unauthenticated Browsing by Default:** Public visitors can browse the entire menu and customize their cart without logging in.
2. **Role Isolation:**
   * Public customers see only **Menu** and **Live Token** tracker.
   * Barista Display is only accessible via **Sign In** using credentials:
     * **Email:** `admin@gmail.com`
     * **Password:** `admin`
   * When logged in as admin, the interface renders **the Barista Screen only** with full KDS controls, sound toggles, and live lane dispatch.
3. **Commercial Food Photography:** 7 high-resolution commercial food photographs stored locally in `/public/images/`.
4. **Optional Vehicle Details:** Car Model & Number Plate inputs formatted with automotive badges on tickets.
5. **Web Audio Synthesis:** Two-tone cafe chime and tri-tone ready alert play without external MP3 dependencies.

---

## 🚀 Running Locally

```bash
# Development Server
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
