'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useOrders } from '@/context/OrderContext';
import { useCart } from '@/context/CartContext';
import { X, ShieldCheck, Lock, User, Key, AlertCircle, Sparkles, CheckCircle2, MessageSquare, ArrowLeft } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingVehicleData?: { carType?: string; carPlate?: string };
  initialTab?: 'customer' | 'staff';
  onVerifiedCheckout?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  pendingVehicleData,
  initialTab = 'customer',
  onVerifiedCheckout,
}) => {
  const { setCurrentUser, loginAdmin, isPhoneBlacklisted, createOrder } = useOrders();
  const { cart, subtotal, tax, total, clearCart, closeDrawer } = useCart();

  const [activeTab, setActiveTab] = useState<'customer' | 'staff'>(initialTab);

  // Customer Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // WhatsApp OTP Verification Step
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [otpSentNotification, setOtpSentNotification] = useState(false);

  // Staff Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) return;

    if (email.trim().toLowerCase() === 'admin@gmail.com') {
      setActiveTab('staff');
      return;
    }

    // Trigger WhatsApp OTP step
    setStep('otp');
    setOtpSentNotification(true);
    setOtpError(false);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();

    // In demo / staging: Accept standard OTP 4242 or any 4 digits
    if (otp.trim() === '4242' || (otp.length === 4 && /^\d+$/.test(otp))) {
      setOtpError(false);
      const isBlacklisted = isPhoneBlacklisted(phone);

      const user = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        isVerified: true,
        isFlagged: isBlacklisted,
      };

      setCurrentUser(user);
      localStorage.setItem('greydot-user', JSON.stringify(user));

      if (onVerifiedCheckout) {
        onVerifiedCheckout();
      } else if (cart.length > 0) {
        // If there was an active checkout, place it
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
          { subtotal, tax, total },
          user
        );
        clearCart();
        closeDrawer();
      }

      onClose();
    } else {
      setOtpError(true);
    }
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
        <div className="text-center mb-5">
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

        {/* Mode Selector Tabs (Customer vs Staff) */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-concrete-100 dark:bg-white/5 border border-concrete-200 dark:border-white/10 mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('customer');
              setStep('details');
            }}
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

        {/* ======================================================== */}
        {/* TAB 1: CUSTOMER SIGN-IN WITH WHATSAPP OTP VERIFICATION */}
        {/* ======================================================== */}
        {activeTab === 'customer' && step === 'details' && (
          <form onSubmit={handleSendOtp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-concrete-700 dark:text-zinc-300 mb-1">
                Your Full Name
              </label>
              <input
                required
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-concrete-50 dark:bg-noir-card border border-concrete-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-concrete-900 dark:text-white focus:outline-none focus:border-brand-sky transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-concrete-700 dark:text-zinc-300 mb-1 flex items-center justify-between">
                <span>WhatsApp / Mobile Number</span>
                <span className="text-[10px] text-brand-sky font-semibold">Instant OTP Protection</span>
              </label>
              <div className="flex gap-2">
                <span className="px-3.5 py-2.5 rounded-xl border border-concrete-300 dark:border-white/10 bg-concrete-100 dark:bg-white/5 text-sm font-bold text-concrete-600 dark:text-zinc-400 flex items-center">
                  +91
                </span>
                <input
                  required
                  type="tel"
                  placeholder="98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-concrete-50 dark:bg-noir-card border border-concrete-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-concrete-900 dark:text-white focus:outline-none focus:border-brand-sky transition flex-1 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-concrete-700 dark:text-zinc-300 mb-1">
                Email Address
              </label>
              <input
                required
                type="email"
                placeholder="name@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-concrete-50 dark:bg-noir-card border border-concrete-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-concrete-900 dark:text-white focus:outline-none focus:border-brand-sky transition"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 text-sm font-bold rounded-xl bg-brand-sky hover:bg-brand-skyDark text-black shadow-lg shadow-brand-sky/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Verify Mobile via WhatsApp OTP →</span>
              </button>
            </div>

            <div className="text-center pt-1">
              <p className="text-[11px] text-concrete-500 dark:text-zinc-500 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>A 4-digit security code will be sent to confirm your car pickup</span>
              </p>
            </div>
          </form>
        )}

        {/* STEP 2: WHATSAPP OTP INPUT SCREEN */}
        {activeTab === 'customer' && step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            
            {/* Simulated WhatsApp notification banner */}
            {otpSentNotification && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-between gap-2 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">💬</span>
                  <div>
                    <span className="font-bold block">WhatsApp Message Received</span>
                    <span className="text-[11px] text-concrete-600 dark:text-zinc-300">Your Grey Dot OTP is: <strong className="font-mono font-bold text-emerald-500">4242</strong></span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOtp('4242')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500 text-black font-bold text-[10px] hover:bg-emerald-400 transition"
                >
                  Use Code
                </button>
              </div>
            )}

            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-brand-sky/10 border border-brand-sky/20 text-brand-sky flex items-center justify-center text-xl mx-auto mb-2">
                📱
              </div>
              <h3 className="font-bold text-base text-concrete-900 dark:text-white">
                Enter WhatsApp OTP
              </h3>
              <p className="text-xs text-concrete-500 dark:text-zinc-400 mt-1">
                Sent 4-digit code to <strong className="text-concrete-900 dark:text-white font-mono">+91 {phone}</strong>
              </p>
            </div>

            {otpError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Invalid OTP. Please enter 4242</span>
              </div>
            )}

            <div>
              <input
                required
                type="text"
                maxLength={4}
                autoFocus
                placeholder="• • • •"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[1em] text-2xl font-mono font-black py-3 rounded-2xl bg-concrete-50 dark:bg-noir-card border-2 border-concrete-300 dark:border-white/10 focus:border-brand-sky focus:outline-none text-concrete-900 dark:text-white transition"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-concrete-500 dark:text-zinc-400 px-1">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="flex items-center gap-1 hover:text-brand-sky transition"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Change Number</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOtp('4242');
                  setOtpSentNotification(true);
                }}
                className="text-brand-sky font-bold hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                <span>Resend / Auto-Fill (4242)</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={otp.length !== 4}
                className="w-full py-3.5 text-sm font-bold rounded-xl bg-brand-sky hover:bg-brand-skyDark text-black shadow-lg shadow-brand-sky/20 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Verify & Confirm Identity →</span>
              </button>
            </div>
          </form>
        )}

        {/* ======================================================== */}
        {/* TAB 2: STAFF / BARISTA LOGIN                             */}
        {/* ======================================================== */}
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
                placeholder="admin@gmail.com"
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                className="w-full bg-concrete-50 dark:bg-noir-card border border-concrete-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-concrete-900 dark:text-white focus:outline-none focus:border-brand-sky transition font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-concrete-700 dark:text-zinc-300 mb-1">
                Terminal Password
              </label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="w-full bg-concrete-50 dark:bg-noir-card border border-concrete-300 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-concrete-900 dark:text-white focus:outline-none focus:border-brand-sky transition font-mono"
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
          </form>
        )}

      </div>
    </div>
  );
};
