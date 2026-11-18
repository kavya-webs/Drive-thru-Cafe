'use client';

import React from 'react';
import Image from 'next/image';
import { useOrders } from '@/context/OrderContext';
import { CheckCircle2, Clock, Coffee, Car, CreditCard, ChevronRight, ShieldCheck, MapPin } from 'lucide-react';

export const LiveTokenView: React.FC<{ onNavigateToMenu: () => void }> = ({ onNavigateToMenu }) => {
  const { activeOrder } = useOrders();

  if (!activeOrder) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center text-3xl border border-concrete-300 dark:border-white/10 bg-concrete-100 dark:bg-white/5">
          ☕
        </div>
        <h2 className="text-xl font-bold text-concrete-900 dark:text-white">No Active Drive-Thru Order</h2>
        <p className="text-xs text-concrete-500 dark:text-zinc-400 mt-1 mb-6">
          Explore our menu and place a takeaway order to get your live token.
        </p>
        <button
          onClick={onNavigateToMenu}
          className="px-6 py-3 rounded-xl bg-brand-sky hover:bg-brand-skyDark text-black text-sm font-bold shadow-md transition"
        >
          Browse Menu Now →
        </button>
      </section>
    );
  }

  const isAccepted = ['brewing', 'ready', 'dispatched'].includes(activeOrder.status);
  const isBrewing = activeOrder.status === 'brewing';
  const isReady = ['ready', 'dispatched'].includes(activeOrder.status);

  return (
    <section className="max-w-3xl mx-auto px-4 py-8 pb-24">
      
      {/* Top Brand Tag */}
      <div className="text-center mb-6">
        <div className="relative h-8 w-28 mx-auto mb-2">
          <Image
            src="/grey_dot_logo_straight.png"
            alt="grey dot."
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-concrete-900 dark:text-white">
          Live Drive-Thru Token
        </h1>
        <p className="text-xs text-concrete-500 dark:text-zinc-400 mt-1">
          Say your token number or show this screen when you pull up to Lane 1 window.
        </p>
      </div>

      {/* Main Token Board Card */}
      <div className="p-6 md:p-8 rounded-3xl border-2 border-brand-sky/40 text-center relative overflow-hidden mb-6 bg-white dark:bg-noir-card shadow-xl">
        <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-brand-sky via-sky-300 to-brand-sky"></div>
        
        <p className="text-xs font-bold tracking-widest text-concrete-500 dark:text-zinc-400 uppercase">
          YOUR DRIVE-THRU TOKEN NUMBER
        </p>
        
        <div className="my-4 inline-block px-10 py-4 rounded-2xl border border-brand-sky/30 bg-concrete-50 dark:bg-white/5 shadow-inner">
          <span className="text-6xl md:text-7xl font-black text-brand-sky font-mono tracking-tight">
            {activeOrder.token}
          </span>
        </div>

        {/* Optional Vehicle & Location Badge */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs p-3 rounded-xl max-w-md mx-auto mb-6 border border-concrete-200 dark:border-white/10 bg-concrete-100 dark:bg-white/5">
          <div className="flex items-center gap-1.5">
            <Car className="w-4 h-4 text-brand-sky flex-shrink-0" />
            <span className="font-semibold text-concrete-800 dark:text-zinc-200">
              {activeOrder.carType || activeOrder.carPlate
                ? `${activeOrder.carType || 'Car'} ${activeOrder.carPlate ? '(' + activeOrder.carPlate + ')' : ''}`
                : 'Express Walk-Up Counter'}
            </span>
          </div>
          <span className="text-concrete-400 dark:text-zinc-600">•</span>
          <div className="flex items-center gap-1 text-concrete-600 dark:text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            <span>{activeOrder.distanceKm} km away</span>
          </div>
          <span className="text-concrete-400 dark:text-zinc-600">•</span>
          <span className="text-brand-sky font-bold">Lane 1 Window</span>
        </div>

        {/* Dynamic Status Progress Bar */}
        <div className="max-w-md mx-auto my-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-brand-sky flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-brand-sky animate-pulse"></span>
              {isReady
                ? 'Your order is READY at the window!'
                : isBrewing
                ? 'Baristas are brewing your items'
                : 'Order received at counter'}
            </span>
            <span className="font-mono text-concrete-500 dark:text-zinc-400 font-bold">
              {isReady ? 'Ready now!' : 'Est. 4 min left'}
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
        <div className="grid grid-cols-4 gap-2 text-center pt-4 border-t border-concrete-200 dark:border-white/10">
          <div>
            <div className="w-8 h-8 mx-auto rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold border border-emerald-500/30 mb-1">
              ✓
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">Transmitted</span>
            <span className="text-[9px] text-concrete-400 dark:text-zinc-500">{activeOrder.createdAt}</span>
          </div>

          <div>
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold border mb-1 ${
              isAccepted
                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                : 'border-concrete-300 dark:border-white/10 text-concrete-400'
            }`}>
              {isAccepted ? '✓' : '2'}
            </div>
            <span className={`text-[11px] font-semibold block ${isAccepted ? 'text-emerald-600 dark:text-emerald-400' : 'text-concrete-400'}`}>
              Accepted
            </span>
            <span className="text-[9px] text-concrete-400 dark:text-zinc-500">Counter</span>
          </div>

          <div>
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-black shadow-md mb-1 ${
              isBrewing
                ? 'bg-brand-sky text-black animate-bounce'
                : isReady
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'border-concrete-300 dark:border-white/10 text-concrete-400'
            }`}>
              {isReady ? '✓' : '☕'}
            </div>
            <span className={`text-[11px] font-bold block ${isBrewing || isReady ? 'text-brand-sky' : 'text-concrete-400'}`}>
              Brewing
            </span>
            <span className="text-[9px] text-concrete-400 dark:text-zinc-400">
              {isReady ? 'Done' : 'Now'}
            </span>
          </div>

          <div>
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-1 border ${
              isReady
                ? 'bg-emerald-500 text-black border-emerald-500 animate-pulse'
                : 'border-concrete-300 dark:border-white/10 text-concrete-400'
            }`}>
              🏁
            </div>
            <span className={`text-[11px] block font-semibold ${isReady ? 'text-emerald-500 font-bold' : 'text-concrete-400'}`}>
              Window Handover
            </span>
            <span className="text-[9px] text-concrete-400 dark:text-zinc-500">Lane 1</span>
          </div>
        </div>

      </div>

      {/* Items Details & Payment Guarantee Card */}
      <div className="p-6 rounded-3xl border border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-card shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-concrete-900 dark:text-white">
            Order Items Summary
          </h3>
          {activeOrder.paymentStatus === 'paid' ? (
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>PAID IN ADVANCE VIA UPI</span>
            </span>
          ) : (
            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              PAY AT WINDOW
            </span>
          )}
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
            <span>{activeOrder.paymentStatus === 'paid' ? 'Total Paid' : 'Total Payable at Window'}</span>
            <span className="text-brand-sky font-mono text-base font-black">
              ₹{activeOrder.total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-5 p-3.5 rounded-xl border border-concrete-200 dark:border-white/10 bg-concrete-50 dark:bg-white/5 flex items-center gap-3 text-xs">
          <CreditCard className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <div>
            <span className="font-bold text-concrete-900 dark:text-white block">
              {activeOrder.paymentStatus === 'paid'
                ? `Transaction ID: ${activeOrder.transactionId || 'UPI-VERIFIED'}`
                : 'Pay at drive-thru window upon collection'}
            </span>
            <span className="text-concrete-500 dark:text-zinc-400">
              {activeOrder.paymentStatus === 'paid'
                ? 'Your order is pre-paid. Simply flash this screen or say your token number for zero-wait handover.'
                : 'Pay via UPI QR scan, cash, or card when you pull up to the window.'}
            </span>
          </div>
        </div>
      </div>

    </section>
  );
};
