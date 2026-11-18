'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useOrders } from '@/context/OrderContext';
import { useCart } from '@/context/CartContext';
import { X, ShieldCheck, Lock, User, Key, AlertCircle, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingVehicleData?: { carType?: string; carPlate?: string };
  initialTab?: 'customer' | 'staff';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  pendingVehicleData,
  initialTab = 'customer',
}) => {
  const { setCurrentUser, loginAdmin, createOrder } = useOrders();
  const { cart, subtotal, tax, total, clearCart, closeDrawer } = useCart();

  const [activeTab, setActiveTab] = useState<'customer' | 'staff'>(initialTab);

  // Customer Form State
  const [name, setName] = useState('Kavya Patel');
  const [phone, setPhone] = useState('97244 08033');
  const [email, setEmail] = useState('kavya@example.com');

  // Staff Form State
  const [adminEmail, setAdminEmail] = useState('admin@gmail.com');
  const [adminPassword, setAdminPassword] = useState('admin');
  const [adminError, setAdminError] = useState(false);

  if (!isOpen) return null;

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) return;

    // Check if user accidentally entered admin email in customer tab
    if (email.trim().toLowerCase() === 'admin@gmail.com') {
      setActiveTab('staff');
      return;
    }

    const user = { name: name.trim(), phone: phone.trim(), email: email.trim() };
    setCurrentUser(user);
    localStorage.setItem('greydot-user', JSON.stringify(user));

    // If there was a pending order in cart, place it now
    if (cart.length > 0) {
      const cartItemsFormatted = cart.map(ci => ({
        id: ci.item.id,
        name: ci.item.name,
        price: ci.item.price,
        quantity: ci.quantity,
        image: ci.item.image,
      }));

      createOrder(
        pendingVehicleData || { carType: '', carPlate: '' },
        cartItemsFormatted,
        { subtotal, tax, total }
      );
      clearCart();
      closeDrawer();
    }

    onClose();
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(adminEmail, adminPassword);
    if (success) {
      setAdminError(false);
      onClose();
    } else {
      setAdminError(true);
    }
  };

  const fillAdminCredentials = () => {
    setAdminEmail('admin@gmail.com');
    setAdminPassword('admin');
    setAdminError(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="max-w-md w-full rounded-3xl border p-7 sm:p-9 relative bg-white dark:bg-noir-surface border-concrete-300 dark:border-white/10 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-concrete-400 hover:text-concrete-900 dark:hover:text-white transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="relative h-9 w-32 mx-auto mb-2">
            <Image
              src="/grey_dot_logo_straight.png"
              alt="grey dot."
              fill
              className="object-contain"
            />
          </div>
          <p className="text-xs text-concrete-500 dark:text-zinc-400">
            ITC Mantra, Ram Chowk, Mota Varachha, Surat
          </p>
        </div>

        {/* Sign In Mode Selector Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-concrete-100 dark:bg-white/5 border border-concrete-200 dark:border-white/10 mb-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('customer')}
            className={`py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'customer'
                ? 'bg-brand-sky text-black shadow-sm'
                : 'text-concrete-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Customer Sign-In</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('staff')}
            className={`py-2 px-3 rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'staff'
                ? 'bg-brand-sky text-black shadow-sm'
                : 'text-concrete-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Staff / Barista</span>
          </button>
        </div>

        {/* TAB 1: CUSTOMER SIGN IN */}
        {activeTab === 'customer' && (
          <form onSubmit={handleCustomerSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-concrete-700 dark:text-zinc-300 mb-1">
                Your Full Name
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Kavya Patel"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-concrete-50 dark:bg-noir-card border border-concrete-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-concrete-900 dark:text-white focus:outline-none focus:border-brand-sky transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-concrete-700 dark:text-zinc-300 mb-1">
                WhatsApp / Mobile Number
              </label>
              <div className="flex gap-2">
                <span className="px-3.5 py-3 rounded-xl border border-concrete-300 dark:border-white/10 bg-concrete-100 dark:bg-white/5 text-sm font-bold text-concrete-600 dark:text-zinc-400 flex items-center">
                  +91
                </span>
                <input
                  required
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-concrete-50 dark:bg-noir-card border border-concrete-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-concrete-900 dark:text-white focus:outline-none focus:border-brand-sky transition flex-1"
                />
              </div>
              <span className="text-[11px] text-concrete-500 dark:text-zinc-500 mt-1 block">
                We will text your live token to this number.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-concrete-700 dark:text-zinc-300 mb-1">
                Email Address
              </label>
              <input
                required
                type="email"
                placeholder="kavya@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-concrete-50 dark:bg-noir-card border border-concrete-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-concrete-900 dark:text-white focus:outline-none focus:border-brand-sky transition"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 text-sm font-bold rounded-xl bg-brand-sky hover:bg-brand-skyDark text-black shadow-lg shadow-brand-sky/20 transition-all flex items-center justify-center gap-2"
              >
                <span>{cart.length > 0 ? 'Confirm & Place Drive-Thru Order →' : 'Sign In as Customer →'}</span>
              </button>
            </div>

            <div className="text-center pt-1">
              <p className="text-[11px] text-concrete-500 dark:text-zinc-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>No advance payment needed · Pay at Drive-Thru Window</span>
              </p>
            </div>
          </form>
        )}

        {/* TAB 2: STAFF / BARISTA LOGIN */}
        {activeTab === 'staff' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="text-center mb-2">
              <p className="text-xs text-concrete-600 dark:text-zinc-300">
                Staff-only portal for live kitchen order queue & dispatch terminal.
              </p>
            </div>

            {adminError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Invalid credentials. Use admin@gmail.com / admin</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-concrete-700 dark:text-zinc-300 mb-1">
                Barista Email
              </label>
              <input
                required
                type="email"
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                className="w-full bg-concrete-50 dark:bg-noir-card border border-concrete-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-concrete-900 dark:text-white focus:outline-none focus:border-brand-sky transition font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-concrete-700 dark:text-zinc-300 mb-1">
                Terminal Password
              </label>
              <input
                required
                type="password"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="w-full bg-concrete-50 dark:bg-noir-card border border-concrete-300 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-concrete-900 dark:text-white focus:outline-none focus:border-brand-sky transition font-mono"
              />
            </div>

            {/* Quick Demo Helper Box */}
            <div className="p-3.5 rounded-xl border border-concrete-200 dark:border-white/10 bg-concrete-50 dark:bg-white/5 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-brand-sky font-bold flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  <span>Admin Credentials:</span>
                </span>
                <button
                  type="button"
                  onClick={fillAdminCredentials}
                  className="text-[11px] font-bold text-brand-sky hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-Fill</span>
                </button>
              </div>
              <div className="font-mono text-[11px] text-concrete-600 dark:text-zinc-300 space-y-0.5">
                <div>Email: <strong className="text-concrete-900 dark:text-white">admin@gmail.com</strong></div>
                <div>Password: <strong className="text-concrete-900 dark:text-white">admin</strong></div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 text-sm font-bold rounded-xl bg-brand-sky hover:bg-brand-skyDark text-black shadow-lg shadow-brand-sky/20 transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Enter Barista KDS Screen 🔓</span>
              </button>
            </div>

            <p className="text-center text-[11px] text-concrete-500 dark:text-zinc-500">
              Entering admin credentials will lock the interface to the Barista Display only.
            </p>
          </form>
        )}

      </div>
    </div>
  );
};
