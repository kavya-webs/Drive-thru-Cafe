# Grey Dot. Coffee Shop — Drive-Thru & To-Go System

> A dedicated, mobile-first drive-thru digital ordering and kitchen management system for **Grey Dot. Coffee Shop** (ITC Mantra, Ram Chowk, Mota Varachha, Surat).

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**, with real-time push architecture.

---

## ✨ Key Features & Architecture

1. **Unauthenticated Browsing by Default:**
   * Visitors land directly on the full visual menu without any login barrier.
   * Can browse, filter categories, view pricing, and add items to their drive-thru cart.
   * Authentication is only prompted when they click **"Proceed to Place Order"** or when clicking **"Sign In"** in the top navigation.

2. **Role Isolation & Barista Screen Access:**
   * Public navigation tabs show **Menu** and **Live Token** only (no Barista screen tab visible to customers).
   * Barista KDS is accessed exclusively through the **Sign In** modal:
     * **Email:** `admin@gmail.com`
     * **Password:** `admin`
     * Includes a 1-click **"Auto-Fill"** button for instant staff testing.
   * **Dedicated Barista Terminal View:** When logged in with admin credentials, the user sees **the Barista Screen only** (zero customer menus, cart drawers, or customer navigation). Barista terminal features:
     * Real-time 3-column ticket dispatch (*Incoming*, *Brewing & Kitchen*, *Ready at Window*).
     * Vehicle spotlights with license plate badges for drive-thru lane 1.
     * Sound toggle (synthesized alert chimes).
     * Live digital clock & queue metrics.
     * Dedicated **"Exit Terminal"** button to log out and return to the customer menu.

3. **Real Commercial Food Photography:**
   * Every single item on the menu features high-resolution food photography saved in `/public/images/`.
   * Covers signature items: Cold Coffee, Hazelnut Crunch Frappe, Margherita Pizza, Peri-Peri Cheese Fries, Creamy Alfredo Penne Pasta, Blueberry Cheesecake Shake, and Spanish Condensed Milk Latte.

4. **Optional Vehicle Identification:**
   * During checkout or in the cart drawer, customers can optionally specify:
     * **Car Model / Color** (e.g. *White Creta / Thar / i20*)
     * **License Plate** (e.g. *GJ-05-AB-1234*)
   * Marked explicitly as **[OPTIONAL]** so walk-up customers or passengers can skip it.

5. **Zero Advance Payment (Pay-at-Window Policy):**
   * Orders are placed with ₹0 upfront payment. Customers pay at the window via Cash, UPI QR scan, or Card upon collection.

6. **Audio Bell Chimes & Confetti Celebration:**
   * When an order is confirmed, confetti bursts and an authentic synthesized cafe bell chime plays.
   * Live assigned token (e.g. `#GD-44`) with real-time countdown and preparation milestone progress bar.

7. **1-Click Theme Switcher:**
   * Seamless toggle between **☀️ Light Mode** (concrete stucco grey with slate text) and **🌙 Dark Mode** (urban noir with glowing pastel sky-blue accents `#6EC6F1`).

---

## 🚀 Running Locally

### Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Test:
```bash
npm run build
npm start
```

---

## 🌐 1-Click Deployment Guide

This project is completely production-ready and can be deployed in under 2 minutes:

### Deploy to Vercel (Recommended):
1. Push this folder to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Grey Dot Coffee Shop drive-thru app"
   git remote add origin https://github.com/your-username/grey-dot-cafe.git
   git push -u origin main
   ```
2. Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository and click **Deploy**.
4. Your site will be live instantly on a fast global edge network with HTTPS!

### Deploy to Netlify:
1. Connect your repository on [netlify.com](https://netlify.com).
2. Set Build Command to `npm run build` and Publish Directory to `.next`.
3. Click **Deploy Site**.

---

## 🗄️ Optional Supabase Cloud Sync

The app operates with full local state simulation out-of-the-box (no external database required for demo or testing). To enable persistent multi-device cloud synchronization across customer phones and counter tablets:

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab, paste the contents of `supabase-schema.sql`, and click **Run**.
3. Add environment variables in `.env.local` (or in Vercel / Netlify environment variables settings):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Realtime order dispatch will now broadcast instantly across all devices.
