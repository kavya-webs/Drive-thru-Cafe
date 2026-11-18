'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { 
  X, 
  Plus, 
  Minus, 
  Car, 
  ShieldCheck, 
  MapPin, 
  AlertTriangle, 
  QrCode, 
  CheckCircle2, 
  Sparkles, 
  Smartphone,
  CreditCard
} from 'lucide-react';
import { isWithinGeofence } from '@/lib/geo';

interface CartDrawerProps {
  onTriggerAuth: (vehicleData?: { carType?: string; carPlate?: string }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onTriggerAuth }) => {
  const { cart, isDrawerOpen, closeDrawer, updateQuantity, subtotal, tax, total, clearCart } = useCart();
  const { 
    currentUser, 
    createOrder, 
    userDistanceKm, 
    setUserDistanceKm, 
    isPhoneBlacklisted 
  } = useOrders();

  const [carType, setCarType] = useState('');
  const [carPlate, setCarPlate] = useState('');
  
  // Payment Mode Selection ('pay_at_window' | 'upi_online')
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<'pay_at_window' | 'upi_online'>('pay_at_window');
  const [showUpiModal, setShowUpiModal] = useState(false);

  if (!isDrawerOpen) return null;

  const isWithinZone = isWithinGeofence(userDistanceKm);
  const isHighValue = total > 350; // OPTION B RULE: Orders > 350 require UPI
  const isUserBlacklisted = currentUser ? isPhoneBlacklisted(currentUser.phone) : false;

  // Pay at Window is allowed ONLY IF: Total <= 350 AND Within 3 km AND NOT Blacklisted
  const canPayAtWindow = !isHighValue && isWithinZone && !isUserBlacklisted;

  const handleCheckoutInitiation = () => {
    if (!currentUser) {
      onTriggerAuth({ carType, carPlate });
      return;
    }

    // If order requires UPI or user selected UPI, trigger UPI confirmation
    if (!canPayAtWindow || selectedPaymentMode === 'upi_online') {
      setShowUpiModal(true);
    } else {
      // Execute Pay-at-Window order
      executeOrderPlacement('pay_at_window', 'pending');
    }
  };

  const executeOrderPlacement = (mode: 'pay_at_window' | 'upi_online', status: 'pending' | 'paid', txnId?: string) => {
    const cartItemsFormatted = cart.map(ci => ({
      id: ci.item.id,
      name: ci.item.name,
      price: ci.item.price,
      quantity: ci.quantity,
      image: ci.item.image,
    }));

    createOrder(
      { carType, carPlate },
      cartItemsFormatted,
      { subtotal, tax, total },
      { paymentMode: mode, paymentStatus: status, transactionId: txnId }
    );

    clearCart();
    setShowUpiModal(false);
    closeDrawer();
  };

  return (
    <>
      {/* Dark backdrop overlay */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-black/65 backdrop-blur-sm z-50 transition-opacity"
      />

      {/* Slide-over Drawer Panel */}
      <aside className="fixed top-0 right-0 bottom-0 w-full max-w-md z-50 flex flex-col bg-white dark:bg-noir-surface border-l border-concrete-300 dark:border-white/10 shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-concrete-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🚗</span>
            <div>
              <h3 className="font-bold text-base text-concrete-900 dark:text-white leading-tight">
                Your Drive-Thru Order
              </h3>
              <p className="text-[11px] text-concrete-500 dark:text-zinc-400">
                Ram Chowk Lane 1 · Surat
              </p>
            </div>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1 rounded-lg text-concrete-400 hover:text-concrete-900 dark:hover:text-white transition"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ========================================================================= */}
        {/* OPTION B: GEOFENCE LOCATION CHECK (< 3 KM)                                */}
        {/* ========================================================================= */}
        <div className="px-4 py-2.5 border-b border-concrete-200 dark:border-white/10 bg-concrete-50 dark:bg-white/5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <MapPin className={`w-3.5 h-3.5 ${isWithinZone ? 'text-emerald-500' : 'text-red-500'}`} />
            <div>
              <span className="font-bold text-concrete-800 dark:text-zinc-200 block">
                {isWithinZone ? `📍 ${userDistanceKm} km from Grey Dot` : `📍 ${userDistanceKm} km away`}
              </span>
              <span className="text-[10px] text-concrete-500 dark:text-zinc-400">
                {isWithinZone ? 'Within 3 km Drive-Thru Perimeter' : 'Outside 3 km Lane Boundary'}
              </span>
            </div>
          </div>

          {/* Quick simulator buttons for client testing */}
          <div className="flex items-center gap-1 font-mono text-[10px]">
            <button
              onClick={() => setUserDistanceKm(0.6)}
              className={`px-2 py-0.5 rounded border transition ${
                userDistanceKm <= 3
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-bold'
                  : 'bg-white dark:bg-noir-card text-concrete-600 dark:text-zinc-400 border-concrete-300 dark:border-white/10'
              }`}
              title="Simulate car within 0.6 km"
            >
              Nearby (0.6km)
            </button>
            <button
              onClick={() => setUserDistanceKm(14.8)}
              className={`px-2 py-0.5 rounded border transition ${
                userDistanceKm > 3
                  ? 'bg-red-500/20 text-red-500 border-red-500/30 font-bold'
                  : 'bg-white dark:bg-noir-card text-concrete-600 dark:text-zinc-400 border-concrete-300 dark:border-white/10'
              }`}
              title="Simulate car 14.8 km away"
            >
              Far (15km)
            </button>
          </div>
        </div>

        {/* Cart Items List with Real Food Photos */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 text-concrete-500 dark:text-zinc-500">
              <span className="text-4xl block mb-2">☕</span>
              <p className="text-sm font-bold text-concrete-800 dark:text-zinc-300">Your drive-thru cart is empty</p>
              <p className="text-xs mt-1 text-concrete-500 dark:text-zinc-400">Choose cold brews, shakes, or bites from the menu!</p>
            </div>
          ) : (
            cart.map(({ item, quantity }) => (
              <div
                key={item.id}
                className="p-3 rounded-2xl border border-concrete-200 dark:border-white/10 bg-concrete-50 dark:bg-noir-card flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-concrete-200 dark:border-white/10">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-concrete-900 dark:text-white line-clamp-1">
                      {item.name}
                    </h4>
                    <span className="text-xs font-bold text-brand-sky font-mono">
                      ₹{item.price}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-7 h-7 rounded-lg border border-concrete-300 dark:border-white/10 bg-white dark:bg-white/5 flex items-center justify-center font-bold text-xs hover:border-brand-sky transition text-concrete-800 dark:text-white"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold font-mono px-1 text-concrete-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-7 h-7 rounded-lg border border-concrete-300 dark:border-white/10 bg-white dark:bg-white/5 flex items-center justify-center font-bold text-xs hover:border-brand-sky transition text-concrete-800 dark:text-white"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* OPTIONAL VEHICLE DETAILS SECTION */}
        <div className="p-3.5 border-t border-concrete-200 dark:border-white/10 bg-concrete-100 dark:bg-white/5 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold flex items-center gap-1.5 text-concrete-800 dark:text-zinc-200">
              <Car className="w-3.5 h-3.5 text-brand-sky" />
              <span>Vehicle Details</span>
              <span className="text-[10px] font-bold text-brand-sky bg-brand-sky/10 px-2 py-0.5 rounded border border-brand-sky/20">
                OPTIONAL
              </span>
            </label>
            <span className="text-[10px] text-concrete-500 dark:text-zinc-400">
              For drive-thru window identification
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <input
                type="text"
                placeholder="Car Type (e.g. Creta / Thar)"
                value={carType}
                onChange={e => setCarType(e.target.value)}
                className="w-full bg-white dark:bg-noir-card border border-concrete-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-concrete-900 dark:text-white placeholder-concrete-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-sky transition"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Plate No. (e.g. GJ-05-AB-1234)"
                value={carPlate}
                onChange={e => setCarPlate(e.target.value)}
                className="w-full bg-white dark:bg-noir-card border border-concrete-300 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-concrete-900 dark:text-white placeholder-concrete-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-sky transition uppercase"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* OPTION B: ANTI-WASTE SECURITY POLICY & PAYMENT SELECTOR                   */}
        {/* ========================================================================= */}
        <div className="p-4 border-t border-concrete-200 dark:border-white/10 bg-concrete-50 dark:bg-white/5 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-concrete-800 dark:text-zinc-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-sky" />
              <span>Payment Policy</span>
            </span>
            {isHighValue && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold">
                Order &gt; ₹350 Rule
              </span>
            )}
          </div>

          {/* Conditional Policy Message */}
          {isHighValue ? (
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-600 dark:text-amber-400 leading-snug">
              ⚠️ <strong>Anti-Wastage Protection:</strong> Orders exceeding ₹350 require 1-tap UPI payment confirmation before brewing.
            </div>
          ) : !isWithinZone ? (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-500 leading-snug">
              📍 <strong>Outside 3 km Zone:</strong> You are {userDistanceKm} km away. Pay at Window is only available within 3 km of Ram Chowk. Please pay via UPI to place this order.
            </div>
          ) : isUserBlacklisted ? (
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-red-500 leading-snug">
              ⚠️ <strong>Prepayment Required:</strong> Your number has a recorded uncollected order. Please pay via UPI to proceed.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setSelectedPaymentMode('pay_at_window')}
                className={`p-2.5 rounded-xl border text-left transition ${
                  selectedPaymentMode === 'pay_at_window'
                    ? 'border-brand-sky bg-brand-sky/10 text-brand-sky'
                    : 'border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-card text-concrete-700 dark:text-zinc-300'
                }`}
              >
                <div className="font-bold flex items-center gap-1">
                  <span>🚗 Pay at Window</span>
                </div>
                <div className="text-[10px] text-concrete-500 dark:text-zinc-400 font-normal mt-0.5">
                  ₹0 advance · Pay at counter
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPaymentMode('upi_online')}
                className={`p-2.5 rounded-xl border text-left transition ${
                  selectedPaymentMode === 'upi_online'
                    ? 'border-brand-sky bg-brand-sky/10 text-brand-sky'
                    : 'border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-card text-concrete-700 dark:text-zinc-300'
                }`}
              >
                <div className="font-bold flex items-center gap-1">
                  <span>⚡ 1-Tap UPI</span>
                </div>
                <div className="text-[10px] text-concrete-500 dark:text-zinc-400 font-normal mt-0.5">
                  GPay / PhonePe (Fast lane)
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Bill Breakdown & Action CTA */}
        <div className="p-4 sm:p-5 border-t border-concrete-200 dark:border-white/10 bg-white dark:bg-noir-surface">
          <div className="space-y-1.5 text-xs text-concrete-600 dark:text-zinc-400 mb-3.5">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono font-bold text-concrete-900 dark:text-white">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>GST (5%)</span>
              <span className="font-mono font-bold text-concrete-900 dark:text-white">
                ₹{tax.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-concrete-900 dark:text-white pt-2 border-t border-concrete-200 dark:border-white/10">
              <span>Total Amount</span>
              <span className="text-brand-sky font-mono text-lg font-black">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckoutInitiation}
            disabled={cart.length === 0}
            className="w-full py-3.5 text-sm font-bold rounded-xl bg-brand-sky hover:bg-brand-skyDark text-black shadow-lg shadow-brand-sky/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>
              {!canPayAtWindow || selectedPaymentMode === 'upi_online'
                ? `Proceed to 1-Tap UPI (₹${total.toFixed(2)}) →`
                : 'Confirm Drive-Thru Order (Pay at Window) →'}
            </span>
          </button>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* 1-TAP UPI PAYMENT MODAL (REQUIRED FOR > ₹350 OR ONLINE PAYMENT)           */}
      {/* ========================================================================= */}
      {showUpiModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="max-w-md w-full rounded-3xl border border-brand-sky/40 p-7 bg-white dark:bg-noir-surface shadow-2xl relative">
            
            <button
              onClick={() => setShowUpiModal(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-concrete-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-4">
              <span className="text-[10px] font-mono font-black tracking-widest text-brand-sky uppercase block">
                INSTANT ZERO-WAIT DISPATCH
              </span>
              <h3 className="text-xl font-black text-concrete-900 dark:text-white mt-0.5">
                1-Tap UPI Payment
              </h3>
              <p className="text-xs text-concrete-500 dark:text-zinc-400 mt-1">
                Amount: <strong className="font-mono text-base text-brand-sky font-bold">₹{total.toFixed(2)}</strong> to Grey Dot Coffee Shop
              </p>
            </div>

            {/* Dynamic UPI QR Code Box */}
            <div className="p-4 rounded-2xl bg-white border border-concrete-300 dark:border-white/10 shadow-inner max-w-[220px] mx-auto text-center mb-4">
              {/* Generated SVG QR Code representation */}
              <div className="w-40 h-40 mx-auto relative flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                  {/* Outer corner squares */}
                  <rect x="5" y="5" width="28" height="28" rx="4" fill="#000000" />
                  <rect x="9" y="9" width="20" height="20" rx="2" fill="#ffffff" />
                  <rect x="13" y="13" width="12" height="12" rx="1" fill="#000000" />

                  <rect x="67" y="5" width="28" height="28" rx="4" fill="#000000" />
                  <rect x="71" y="9" width="20" height="20" rx="2" fill="#ffffff" />
                  <rect x="75" y="13" width="12" height="12" rx="1" fill="#000000" />

                  <rect x="5" y="67" width="28" height="28" rx="4" fill="#000000" />
                  <rect x="9" y="71" width="20" height="20" rx="2" fill="#ffffff" />
                  <rect x="13" y="75" width="12" height="12" rx="1" fill="#000000" />

                  {/* QR Matrix blocks */}
                  <rect x="38" y="8" width="6" height="6" fill="#000000" />
                  <rect x="48" y="14" width="6" height="6" fill="#000000" />
                  <rect x="56" y="8" width="6" height="6" fill="#000000" />
                  <rect x="38" y="24" width="6" height="6" fill="#000000" />
                  <rect x="48" y="30" width="6" height="6" fill="#000000" />
                  <rect x="56" y="22" width="6" height="6" fill="#000000" />

                  <rect x="10" y="42" width="6" height="6" fill="#000000" />
                  <rect x="22" y="48" width="6" height="6" fill="#000000" />
                  <rect x="34" y="42" width="6" height="6" fill="#000000" />
                  <rect x="44" y="46" width="12" height="12" rx="2" fill="#6ec6f1" />
                  <rect x="64" y="42" width="6" height="6" fill="#000000" />
                  <rect x="78" y="48" width="6" height="6" fill="#000000" />
                  <rect x="86" y="42" width="6" height="6" fill="#000000" />

                  <rect x="38" y="68" width="6" height="6" fill="#000000" />
                  <rect x="48" y="76" width="6" height="6" fill="#000000" />
                  <rect x="60" y="68" width="6" height="6" fill="#000000" />
                  <rect x="72" y="74" width="6" height="6" fill="#000000" />
                  <rect x="84" y="68" width="6" height="6" fill="#000000" />
                  <rect x="80" y="82" width="8" height="8" fill="#000000" />
                  <rect x="50" y="86" width="6" height="6" fill="#000000" />
                </svg>
              </div>
              <p className="text-[10px] font-mono text-zinc-500 font-bold mt-1">
                UPI ID: greydotcoffee@oksbi
              </p>
            </div>

            {/* Quick UPI App Deep-link Triggers */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-xs font-bold text-center">
              <button
                type="button"
                onClick={() => executeOrderPlacement('upi_online', 'paid', `UPI-GPAY-${Date.now().toString().slice(-6)}`)}
                className="p-2.5 rounded-xl border border-concrete-300 dark:border-white/10 hover:border-brand-sky bg-concrete-50 dark:bg-white/5 transition flex flex-col items-center gap-1 text-concrete-800 dark:text-zinc-200"
              >
                <span className="text-base">🟢</span>
                <span className="text-[11px]">Google Pay</span>
              </button>

              <button
                type="button"
                onClick={() => executeOrderPlacement('upi_online', 'paid', `UPI-PHONEPE-${Date.now().toString().slice(-6)}`)}
                className="p-2.5 rounded-xl border border-concrete-300 dark:border-white/10 hover:border-brand-sky bg-concrete-50 dark:bg-white/5 transition flex flex-col items-center gap-1 text-concrete-800 dark:text-zinc-200"
              >
                <span className="text-base">🟣</span>
                <span className="text-[11px]">PhonePe</span>
              </button>

              <button
                type="button"
                onClick={() => executeOrderPlacement('upi_online', 'paid', `UPI-PAYTM-${Date.now().toString().slice(-6)}`)}
                className="p-2.5 rounded-xl border border-concrete-300 dark:border-white/10 hover:border-brand-sky bg-concrete-50 dark:bg-white/5 transition flex flex-col items-center gap-1 text-concrete-800 dark:text-zinc-200"
              >
                <span className="text-base">🔵</span>
                <span className="text-[11px]">Paytm</span>
              </button>
            </div>

            {/* 1-Tap Instant Simulated Payment Button */}
            <button
              onClick={() => executeOrderPlacement('upi_online', 'paid', `UPI-VERIFIED-${Date.now().toString().slice(-6)}`)}
              className="w-full py-3 text-sm font-bold rounded-xl bg-brand-sky hover:bg-brand-skyDark text-black shadow-lg shadow-brand-sky/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Simulate 1-Tap UPI Success (₹{total.toFixed(2)}) →</span>
            </button>

            <p className="text-center text-[10px] text-concrete-400 dark:text-zinc-500 mt-2">
              Protects Grey Dot from fake orders · Immediate barista kitchen alert
            </p>

          </div>
        </div>
      )}
    </>
  );
};
