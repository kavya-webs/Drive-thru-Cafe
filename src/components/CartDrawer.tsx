'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { X, Plus, Minus, Car, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  onTriggerAuth: (vehicleData?: { carType?: string; carPlate?: string }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onTriggerAuth }) => {
  const { cart, isDrawerOpen, closeDrawer, updateQuantity, subtotal, tax, total, clearCart } = useCart();
  const { currentUser, createOrder } = useOrders();

  const [carType, setCarType] = useState('');
  const [carPlate, setCarPlate] = useState('');

  if (!isDrawerOpen) return null;

  const handleCheckout = () => {
    if (!currentUser) {
      // Trigger user authentication modal with current vehicle input
      onTriggerAuth({ carType, carPlate });
    } else {
      // User is already authenticated! Place order with actual cart items
      const cartItemsFormatted = cart.map(ci => ({
        id: ci.item.id,
        name: ci.item.name,
        price: ci.item.price,
        quantity: ci.quantity,
        image: ci.item.image,
      }));

      createOrder({ carType, carPlate }, cartItemsFormatted, { subtotal, tax, total });
      clearCart();
      closeDrawer();
    }
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
        <div className="p-5 border-b border-concrete-200 dark:border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🚗</span>
            <h3 className="font-bold text-base text-concrete-900 dark:text-white">
              Your Drive-Thru Order
            </h3>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1 rounded-lg text-concrete-400 hover:text-concrete-900 dark:hover:text-white transition"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List with Real Food Photos */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
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
                className="p-3.5 rounded-2xl border border-concrete-200 dark:border-white/10 bg-concrete-50 dark:bg-noir-card flex items-center justify-between gap-3 shadow-sm"
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
        <div className="p-4 border-t border-concrete-200 dark:border-white/10 bg-concrete-100 dark:bg-white/5 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold flex items-center gap-1.5 text-concrete-800 dark:text-zinc-200">
              <Car className="w-3.5 h-3.5 text-brand-sky" />
              <span>Vehicle Details</span>
              <span className="text-[10px] font-bold text-brand-sky bg-brand-sky/10 px-2 py-0.5 rounded border border-brand-sky/20">
                OPTIONAL
              </span>
            </label>
            <span className="text-[10px] text-concrete-500 dark:text-zinc-400">
              For car window identification
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

          <p className="text-[10px] text-concrete-500 dark:text-zinc-400">
            Can leave blank if you are picking up on foot at the express takeaway counter.
          </p>
        </div>

        {/* Bill Breakdown & Action CTA */}
        <div className="p-5 border-t border-concrete-200 dark:border-white/10 bg-white dark:bg-noir-surface">
          <div className="space-y-1.5 text-xs text-concrete-600 dark:text-zinc-400 mb-4">
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
              <span>Total (Pay at Window)</span>
              <span className="text-brand-sky font-mono text-lg font-black">
                ₹{total.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-3.5 text-sm font-bold rounded-xl bg-brand-sky hover:bg-brand-skyDark text-black shadow-lg shadow-brand-sky/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span>Proceed to Place Order →</span>
          </button>

          <p className="text-center text-[11px] text-concrete-500 dark:text-zinc-500 mt-2.5 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Pay at window upon collection (Cash / UPI / Card)</span>
          </p>
        </div>

      </aside>
    </>
  );
};
