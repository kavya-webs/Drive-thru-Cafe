'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useOrders } from '@/context/OrderContext';
import { 
  CheckCircle2, 
  Clock, 
  Coffee, 
  Car, 
  CreditCard, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare,
  Sparkles,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

export const LiveTokenView: React.FC<{ onNavigateToMenu: () => void }> = ({ onNavigateToMenu }) => {
  const { activeOrder, clearActiveOrder } = useOrders();
  const [countdown, setCountdown] = useState<number>(8);

  // Auto-dismiss countdown when order is handed off (dispatched)
  useEffect(() => {
    if (!activeOrder || activeOrder.status !== 'dispatched') return;

    setCountdown(8);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          clearActiveOrder();
          onNavigateToMenu();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOrder?.status, clearActiveOrder, onNavigateToMenu]);

  const handleDismissOrder = () => {
    clearActiveOrder();
    onNavigateToMenu();
  };

  // Case 1: No active order
  if (!activeOrder) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl border border-concrete-300 dark:border-white/10 bg-concrete-100 dark:bg-white/5 shadow-inner">
          ☕
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-concrete-900 dark:text-white">
          No Active Drive-Thru Order
        </h2>
        <p className="text-xs sm:text-sm text-concrete-500 dark:text-zinc-400 mt-1.5 mb-6 max-w-sm mx-auto">
          Explore our signature cold brews, frappes, and handcrafted pizzas to get your live token.
        </p>
        <button
          onClick={onNavigateToMenu}
          className="px-6 py-3.5 rounded-2xl bg-brand-sky hover:bg-brand-skyDark text-black text-xs sm:text-sm font-bold shadow-lg shadow-brand-sky/20 transition-transform active:scale-95"
        >
          Browse Drive-Thru Menu →
        </button>
      </section>
    );
  }

  // Case 2: Order Handed Off / Dispatched (Requirement: Show order complete and then token should disappear)
  if (activeOrder.status === 'dispatched') {
    return (
      <section className="max-w-lg mx-auto px-4 py-10 sm:py-16 text-center animate-in zoom-in-95 duration-500">
        
        {/* Celebration Icon */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-5 rounded-3xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-4xl sm:text-5xl border-2 border-emerald-500/40 shadow-2xl shadow-emerald-500/20">
          <span className="animate-bounce">✓</span>
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-black flex items-center justify-center text-xs font-black">
            🎉
          </span>
        </div>

        <span className="text-[11px] font-black tracking-widest px-3.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 uppercase inline-block mb-2">
          ORDER HANDED OFF & PAID
        </span>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-concrete-900 dark:text-white">
          Enjoy Your Grey Dot Brew!
        </h2>
        
        <p className="text-xs sm:text-sm text-concrete-600 dark:text-zinc-400 mt-2 max-w-md mx-auto">
          Your order <span className="font-mono font-black text-brand-sky">{activeOrder.token}</span> has been successfully handed over at Lane 1 Window. Physical payment was received.
        </p>

        {/* Mini Receipt Summary */}
        <div className="my-6 p-4 sm:p-5 rounded-2xl border border-concrete-200 dark:border-white/10 bg-white dark:bg-noir-card text-left text-xs shadow-md">
          <div className="flex justify-between items-center font-bold pb-2.5 border-b border-concrete-100 dark:border-white/5 text-concrete-900 dark:text-white">
            <span className="flex items-center gap-1.5">
              <span>Token:</span>
              <span className="font-mono text-brand-sky font-black">{activeOrder.token}</span>
            </span>
            <span className="text-[11px] text-concrete-500 dark:text-zinc-400">
              {activeOrder.items.reduce((acc, i) => acc + i.quantity, 0)} Items Collected
            </span>
          </div>

          <div className="py-2.5 space-y-1.5 text-concrete-600 dark:text-zinc-400 text-xs">
            {activeOrder.items.map((it, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{it.quantity}x {it.name}</span>
                <span className="font-mono font-semibold">₹{(it.price * it.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center font-black pt-2.5 border-t border-concrete-100 dark:border-white/5 text-concrete-900 dark:text-white">
            <span className="text-xs">Total Paid at Counter:</span>
            <span className="text-emerald-500 font-mono text-base">₹{activeOrder.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Auto-Dismiss Countdown Card */}
        <div className="space-y-3">
          <div className="p-3 rounded-xl border border-brand-sky/20 bg-brand-sky/5 flex items-center justify-center gap-2 text-xs text-concrete-700 dark:text-zinc-300">
            <Clock className="w-4 h-4 text-brand-sky animate-spin" />
            <span>
              This token screen will automatically close in <strong className="text-brand-sky font-mono font-bold text-sm">{countdown}s</strong>
            </span>
          </div>

          <button
            onClick={handleDismissOrder}
            className="w-full py-3.5 px-6 rounded-2xl bg-brand-sky hover:bg-brand-skyDark text-black font-bold text-xs sm:text-sm shadow-lg shadow-brand-sky/20 transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Order Again / Return to Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </section>
    );
  }

  // Case 3: Order Cancelled / No-Show
  if (activeOrder.status === 'cancelled') {
    return (
      <section className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl border border-red-500/30 bg-red-500/10 text-red-500">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-concrete-900 dark:text-white">Order Cancelled</h2>
        <p className="text-xs text-concrete-500 dark:text-zinc-400 mt-1 mb-6">
          This order was cancelled by the drive-thru counter. Please contact customer care or visit the counter.
        </p>
        <button
          onClick={handleDismissOrder}
          className="px-6 py-3 rounded-xl bg-concrete-200 dark:bg-white/10 hover:bg-concrete-300 text-concrete-900 dark:text-white text-xs font-bold transition"
        >
          Return to Menu
        </button>
      </section>
    );
  }

  // Case 4: Active Live Order (incoming, brewing, ready)
  const isAccepted = ['brewing', 'ready'].includes(activeOrder.status);
  const isBrewing = activeOrder.status === 'brewing';
  const isReady = activeOrder.status === 'ready';

  return (
    <section className="max-w-3xl mx-auto px-3 sm:px-6 py-4 sm:py-8 pb-28">
      
      {/* Top Brand Tag */}
      <div className="text-center mb-5 sm:mb-6">
        <div className="relative h-7 w-24 sm:h-8 sm:w-28 mx-auto mb-2">
          <Image
            src="/grey_dot_logo_straight.png"
            alt="grey dot."
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-xl sm:text-3xl font-black tracking-tight text-concrete-900 dark:text-white">
          Live Drive-Thru Token
        </h1>
        <p className="text-[11px] sm:text-xs text-concrete-500 dark:text-zinc-400 mt-1">
          Quote token number or show this screen at Lane 1 window upon arrival.
        </p>
      </div>

      {/* Main Token Board Card */}
      <div className="p-4 sm:p-7 md:p-8 rounded-3xl border-2 border-brand-sky/40 text-center relative overflow-hidden mb-6 bg-white dark:bg-noir-card shadow-xl">
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-brand-sky via-sky-300 to-brand-sky"></div>
        
        <p className="text-[10px] sm:text-xs font-bold tracking-widest text-concrete-500 dark:text-zinc-400 uppercase">
          YOUR DRIVE-THRU TOKEN NUMBER
        </p>
        
        {/* Token Number Display */}
        <div className="my-3 sm:my-5 inline-block px-8 sm:px-12 py-3 sm:py-4 rounded-2xl border border-brand-sky/30 bg-concrete-50 dark:bg-white/5 shadow-inner">
          <span className="text-5xl sm:text-6xl md:text-7xl font-black text-brand-sky font-mono tracking-tight">
            {activeOrder.token}
          </span>
        </div>

        {/* Optional Vehicle & Location Badge */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs p-2.5 sm:p-3 rounded-xl max-w-md mx-auto mb-5 sm:mb-6 border border-concrete-200 dark:border-white/10 bg-concrete-100 dark:bg-white/5">
          <div className="flex items-center gap-1.5">
            <Car className="w-3.5 h-3.5 text-brand-sky flex-shrink-0" />
            <span className="font-semibold text-concrete-800 dark:text-zinc-200 text-[11px] sm:text-xs">
              {activeOrder.carType || activeOrder.carPlate
                ? `${activeOrder.carType || 'Car'} ${activeOrder.carPlate ? '(' + activeOrder.carPlate + ')' : ''}`
                : 'Express Walk-Up Counter'}
            </span>
          </div>
          <span className="text-concrete-400 dark:text-zinc-600">•</span>
          <div className="flex items-center gap-1 text-concrete-600 dark:text-zinc-400 text-[11px] sm:text-xs">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span>{activeOrder.distanceKm} km away</span>
          </div>
          <span className="text-concrete-400 dark:text-zinc-600">•</span>
          <span className="text-brand-sky font-bold text-[11px] sm:text-xs">Lane 1 Window</span>
        </div>

        {/* Dynamic Status Progress Bar */}
        <div className="max-w-md mx-auto my-4 sm:my-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-brand-sky flex items-center gap-1.5 text-[11px] sm:text-xs">
              <span className="w-2 h-2 rounded-full bg-brand-sky animate-pulse"></span>
              {isReady
                ? 'Your order is READY at the window!'
                : isBrewing
                ? 'Baristas are brewing your items'
                : 'Order received at counter'}
            </span>
            <span className="font-mono text-concrete-500 dark:text-zinc-400 font-bold text-[11px] sm:text-xs">
              {isReady ? 'Ready now!' : isBrewing ? 'Est. ~3 mins left' : 'Est. ~5-7 mins'}
            </span>
          </div>
          <div className="w-full rounded-full h-3 overflow-hidden p-0.5 border border-concrete-200 dark:border-white/10 bg-concrete-100 dark:bg-noir-surface">
            <div
              className="bg-gradient-to-r from-brand-sky to-sky-300 h-full rounded-full transition-all duration-1000 shadow-md"
              style={{
                width: isReady ? '100%' : isBrewing ? '65%' : '25%',
              }}
            />
          </div>
        </div>

        {/* 4 Stage Milestones */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 text-center pt-4 border-t border-concrete-200 dark:border-white/10">
          <div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 mx-auto rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/30 mb-1">
              ✓
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block truncate">
              Sent
            </span>
            <span className="text-[8px] sm:text-[9px] text-concrete-400 dark:text-zinc-500">
              {activeOrder.createdAt}
            </span>
          </div>

          <div>
            <div className={`w-7 h-7 sm:w-8 sm:h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold border mb-1 ${
              isAccepted
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'border-concrete-300 dark:border-white/10 text-concrete-400'
            }`}>
              {isAccepted ? '✓' : '2'}
            </div>
            <span className={`text-[10px] sm:text-[11px] font-semibold block truncate ${isAccepted ? 'text-emerald-600 dark:text-emerald-400' : 'text-concrete-400'}`}>
              Accepted
            </span>
            <span className="text-[8px] sm:text-[9px] text-concrete-400 dark:text-zinc-500">Counter</span>
          </div>

          <div>
            <div className={`w-7 h-7 sm:w-8 sm:h-8 mx-auto rounded-full flex items-center justify-center text-xs font-black shadow-md mb-1 ${
              isBrewing
                ? 'bg-brand-sky text-black animate-bounce'
                : isReady
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'border-concrete-300 dark:border-white/10 text-concrete-400'
            }`}>
              {isReady ? '✓' : '☕'}
            </div>
            <span className={`text-[10px] sm:text-[11px] font-bold block truncate ${isBrewing || isReady ? 'text-brand-sky' : 'text-concrete-400'}`}>
              Brewing
            </span>
            <span className="text-[8px] sm:text-[9px] text-concrete-400 dark:text-zinc-400">
              {isReady ? 'Done' : 'Now'}
            </span>
          </div>

          <div>
            <div className={`w-7 h-7 sm:w-8 sm:h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-1 border ${
              isReady
                ? 'bg-emerald-500 text-black border-emerald-500 animate-pulse'
                : 'border-concrete-300 dark:border-white/10 text-concrete-400'
            }`}>
              🏁
            </div>
            <span className={`text-[10px] sm:text-[11px] block font-semibold truncate ${isReady ? 'text-emerald-500 font-bold' : 'text-concrete-400'}`}>
              Window Handover
            </span>
            <span className="text-[8px] sm:text-[9px] text-concrete-400 dark:text-zinc-500">Lane 1</span>
          </div>
        </div>

      </div>

      {/* Items Details & Physical Payment Card */}
      <div className="p-4 sm:p-6 rounded-3xl border border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-card shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h3 className="text-sm font-bold text-concrete-900 dark:text-white">
            Order Items Summary
          </h3>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1 self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>PAY PHYSICALLY AT WINDOW</span>
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {activeOrder.items.map((it, idx) => (
            <div
              key={idx}
              className="flex justify-between py-1.5 border-b border-concrete-100 dark:border-white/5 text-concrete-600 dark:text-zinc-400"
            >
              <span>{it.quantity}x {it.name}</span>
              <span className="font-mono font-bold text-concrete-900 dark:text-white">
                ₹{(it.price * it.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="flex justify-between pt-2 text-sm font-bold text-concrete-900 dark:text-white">
            <span>Total Payable upon Handover</span>
            <span className="text-brand-sky font-mono text-base font-black">
              ₹{activeOrder.total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-xl border border-concrete-200 dark:border-white/10 bg-concrete-50 dark:bg-white/5 flex items-center gap-3 text-xs">
          <CreditCard className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <div>
            <span className="font-bold text-concrete-900 dark:text-white block">
              Pay physically at the drive-thru window upon collection
            </span>
            <span className="text-[11px] text-concrete-500 dark:text-zinc-400">
              Pay via UPI QR scan, cash, or card directly at the counter when you pull up to Lane 1.
            </span>
          </div>
        </div>
      </div>

      {/* Customer Care Contact Help Card */}
      <div className="p-4 sm:p-5 rounded-2xl border border-concrete-200 dark:border-white/10 bg-white dark:bg-noir-card shadow-sm text-xs">
        <h4 className="font-bold text-concrete-900 dark:text-white mb-2 flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5 text-brand-sky" />
          <span>Need Help with Your Drive-Thru Pickup?</span>
        </h4>
        <p className="text-[11px] text-concrete-500 dark:text-zinc-400 mb-3">
          Our team is at ITC Mantra, Ram Chowk, Mota Varachha. If you are stuck in traffic or need your items ready at a specific minute, reach out directly:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <a
            href="tel:+919727042420"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-concrete-100 dark:bg-white/5 hover:border-brand-sky border border-concrete-200 dark:border-white/10 text-concrete-800 dark:text-zinc-200 font-bold transition"
          >
            <Phone className="w-3.5 h-3.5 text-brand-sky" />
            <span>+91 97270 42420</span>
          </a>
          <a
            href="https://wa.me/919727042420?text=Hi%20Grey%20Dot%2C%20inquiring%20about%20my%20drive-thru%20order"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Us</span>
          </a>
          <a
            href="mailto:care@greydotcoffee.com"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-concrete-100 dark:bg-white/5 hover:border-brand-sky border border-concrete-200 dark:border-white/10 text-concrete-800 dark:text-zinc-200 font-bold transition"
          >
            <Mail className="w-3.5 h-3.5 text-brand-sky" />
            <span>care@greydotcoffee.com</span>
          </a>
        </div>
      </div>

    </section>
  );
};
