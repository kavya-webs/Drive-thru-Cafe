'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useOrders } from '@/context/OrderContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  Clock, 
  CheckCircle, 
  Car, 
  LogOut, 
  PlusCircle, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Flame, 
  CheckCheck,
  UserX,
  CreditCard,
  ShieldAlert,
  Trash2
} from 'lucide-react';
import { playChimeSound, playReadyAlert } from '@/lib/audio';

interface BaristaKDSProps {
  onLogout?: () => void;
}

export const BaristaKDS: React.FC<BaristaKDSProps> = ({ onLogout }) => {
  const { 
    orders, 
    updateOrderStatus, 
    logoutAdmin, 
    simulateIncomingOrder, 
    markNoShow,
    clearAllOrders,
    blacklistedPhones 
  } = useOrders();
  const { theme, toggleTheme } = useTheme();

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showBlacklistDrawer, setShowBlacklistDrawer] = useState(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = (orderId: string, nextStatus: 'brewing' | 'ready' | 'dispatched') => {
    updateOrderStatus(orderId, nextStatus);
    if (soundEnabled) {
      if (nextStatus === 'ready') {
        playReadyAlert();
      } else {
        playChimeSound();
      }
    }
  };

  const incomingOrders = orders.filter(o => o.status === 'incoming');
  const brewingOrders = orders.filter(o => o.status === 'brewing');
  const readyOrders = orders.filter(o => o.status === 'ready');

  const handleExit = () => {
    if (onLogout) {
      onLogout();
    } else {
      logoutAdmin();
    }
  };

  return (
    <div className="min-h-screen bg-concrete-100 dark:bg-noir-base text-concrete-900 dark:text-zinc-100 flex flex-col font-sans transition-colors">
      
      {/* PROFESSIONAL BARISTA TERMINAL TOP BAR */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-noir-surface/95 backdrop-blur-md border-b border-concrete-300 dark:border-white/10 px-4 sm:px-6 py-3.5 shadow-sm">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-4">
          
          {/* Left: Terminal Identity */}
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-28 sm:w-32">
              <Image
                src="/grey_dot_logo_straight.png"
                alt="grey dot."
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="h-6 w-px bg-concrete-300 dark:border-white/10 hidden sm:block"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase text-concrete-900 dark:text-white">
                  KDS Terminal · Station 01
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  LANE 1 LIVE
                </span>
              </div>
              <p className="text-[11px] text-concrete-500 dark:text-zinc-400">
                Ram Chowk, Mota Varachha · Physical Payment Counter
              </p>
            </div>
          </div>

          {/* Middle: Live Queue Counts */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-bold font-mono">
            <span className="px-3 py-1.5 rounded-xl border border-sky-500/30 bg-sky-500/10 text-brand-sky">
              Incoming: {incomingOrders.length}
            </span>
            <span className="px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-500">
              Brewing: {brewingOrders.length}
            </span>
            <span className="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
              Ready at Window: {readyOrders.length}
            </span>
          </div>

          {/* Right: Sound, Clock, Theme, Blacklist Drawer, Simulate, Exit */}
          <div className="flex items-center gap-2.5">
            
            {/* Live Clock */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-concrete-200 dark:border-white/10 bg-concrete-50 dark:bg-white/5 font-mono text-xs font-bold text-concrete-700 dark:text-zinc-300">
              <Clock className="w-3.5 h-3.5 text-brand-sky" />
              <span>{currentTime || '12:00:00 PM'}</span>
            </div>

            {/* Blacklist Count Pill */}
            <button
              onClick={() => setShowBlacklistDrawer(!showBlacklistDrawer)}
              className="px-2.5 py-1.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-bold hover:bg-red-500/20 transition flex items-center gap-1"
              title="View No-Show Flagged Numbers"
            >
              <UserX className="w-3.5 h-3.5" />
              <span>Flagged: {blacklistedPhones.length}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playChimeSound();
              }}
              className="p-2 rounded-xl border border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-card text-concrete-700 dark:text-zinc-300 hover:border-brand-sky transition"
              title={soundEnabled ? 'Mute Alert Chimes' : 'Unmute Alert Chimes'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-500" />
              ) : (
                <VolumeX className="w-4 h-4 text-zinc-400" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-card text-concrete-700 dark:text-zinc-300 hover:border-brand-sky transition"
              title="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-sky-600" />
              )}
            </button>

            {/* Simulate Incoming Order */}
            <button
              onClick={simulateIncomingOrder}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-sky hover:bg-brand-skyDark text-black shadow-sm transition flex items-center gap-1.5"
              title="Simulate a car pulling up and placing order"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ Simulate Car</span>
            </button>

            {/* Reset Queue Button */}
            {orders.length > 0 && (
              <button
                onClick={clearAllOrders}
                className="px-2.5 py-1.5 rounded-xl border border-concrete-300 dark:border-white/10 hover:border-red-400 text-concrete-600 dark:text-zinc-400 hover:text-red-400 text-xs font-bold transition flex items-center gap-1"
                title="Clear all orders queue"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reset Queue</span>
              </button>
            )}

            {/* Prominent Exit / Sign Out Button */}
            <button
              onClick={handleExit}
              className="px-3 py-1.5 rounded-xl text-xs font-bold border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition flex items-center gap-1.5"
              title="Sign out from Barista Terminal and return to customer menu"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Terminal</span>
            </button>

          </div>

        </div>
      </header>

      {/* MAIN KDS LANES GRID (3 WORKSTATIONS) */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ========================================= */}
          {/* LANE 1: INCOMING DRIVE-THRU TICKETS */}
          {/* ========================================= */}
          <div className="flex flex-col rounded-3xl border border-concrete-300 dark:border-white/10 bg-white/60 dark:bg-noir-card/60 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-concrete-200 dark:border-white/10 mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-sky animate-ping"></span>
                <h2 className="font-bold text-sm tracking-wide uppercase text-concrete-900 dark:text-white">
                  Incoming Orders ({incomingOrders.length})
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold text-brand-sky bg-brand-sky/10 px-2 py-0.5 rounded border border-brand-sky/20">
                ACTION REQUIRED
              </span>
            </div>

            <div className="space-y-4 overflow-y-auto flex-1 max-h-[calc(100vh-210px)] pr-1">
              {incomingOrders.length === 0 ? (
                <div className="py-20 text-center text-concrete-400 dark:text-zinc-500 rounded-2xl border border-dashed border-concrete-200 dark:border-white/10">
                  <span className="text-3xl block mb-2">🚗</span>
                  <p className="text-xs font-bold">No incoming orders</p>
                  <p className="text-[11px] mt-1">Click "+ Simulate Car" to test drive-thru queue</p>
                </div>
              ) : (
                incomingOrders.map(ord => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border-l-4 border-l-brand-sky border-y border-r border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-surface shadow-md space-y-3"
                  >
                    {/* Ticket Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-brand-sky font-mono">
                            {ord.token}
                          </span>
                          <span className="text-xs font-bold text-concrete-900 dark:text-white">
                            {ord.customerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <p className="text-[11px] font-mono text-concrete-500 dark:text-zinc-400">
                            {ord.customerPhone}
                          </p>
                          <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded">
                            OTP Verified ✓
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold border border-concrete-200 dark:border-white/10 bg-concrete-100 dark:bg-white/5 text-concrete-600 dark:text-zinc-400 block mb-1">
                          {ord.createdAt}
                        </span>
                        <span className="text-[10px] font-mono text-concrete-500 dark:text-zinc-400">
                          📍 {ord.distanceKm} km away
                        </span>
                      </div>
                    </div>

                    {/* Vehicle Identification Badge & Payment Pill */}
                    <div className="flex flex-wrap items-center gap-2">
                      {ord.carType || ord.carPlate ? (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                          <Car className="w-3.5 h-3.5" />
                          <span>{ord.carType || 'Car'}</span>
                          {ord.carPlate && (
                            <span className="font-mono bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-[11px]">
                              {ord.carPlate}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-block text-[11px] text-concrete-600 dark:text-zinc-400 bg-concrete-100 dark:bg-white/5 px-2.5 py-1 rounded-lg font-medium">
                          🚶 Walk-Up Express Counter
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded bg-sky-500/15 text-sky-600 dark:text-brand-sky border border-sky-500/30">
                        <span>COLLECT AT WINDOW (₹{ord.total.toFixed(2)})</span>
                      </span>
                    </div>

                    {/* Ordered Items List */}
                    <div className="space-y-1.5 py-2 border-y border-concrete-200 dark:border-white/10 text-xs">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-brand-sky text-xs w-4">
                              {it.quantity}x
                            </span>
                            <span className="font-semibold text-concrete-800 dark:text-zinc-200">
                              {it.name}
                            </span>
                          </div>
                          <span className="font-mono text-concrete-500 dark:text-zinc-400 text-[11px]">
                            ₹{it.price * it.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total & Action Buttons */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] text-concrete-500 dark:text-zinc-400 block font-semibold">COLLECT AT WINDOW</span>
                        <span className="text-sm font-black font-mono text-concrete-900 dark:text-white">
                          ₹{ord.total.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStatusChange(ord.id, 'brewing')}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-sky hover:bg-brand-skyDark text-black shadow-md transition flex items-center gap-1.5"
                        >
                          <Flame className="w-3.5 h-3.5" />
                          <span>Accept & Brew ☕</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

          {/* ========================================= */}
          {/* LANE 2: IN PREPARATION / BREWING */}
          {/* ========================================= */}
          <div className="flex flex-col rounded-3xl border border-concrete-300 dark:border-white/10 bg-white/60 dark:bg-noir-card/60 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-concrete-200 dark:border-white/10 mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                <h2 className="font-bold text-sm tracking-wide uppercase text-concrete-900 dark:text-white">
                  Brewing & Kitchen ({brewingOrders.length})
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                IN PROGRESS
              </span>
            </div>

            <div className="space-y-4 overflow-y-auto flex-1 max-h-[calc(100vh-210px)] pr-1">
              {brewingOrders.length === 0 ? (
                <div className="py-20 text-center text-concrete-400 dark:text-zinc-500 rounded-2xl border border-dashed border-concrete-200 dark:border-white/10">
                  <span className="text-3xl block mb-2">☕</span>
                  <p className="text-xs font-bold">Kitchen queue clear</p>
                  <p className="text-[11px] mt-1">Accept incoming tickets to start brewing</p>
                </div>
              ) : (
                brewingOrders.map(ord => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border-l-4 border-l-amber-500 border-y border-r border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-surface shadow-md space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-amber-500 font-mono">
                            {ord.token}
                          </span>
                          <span className="text-xs font-bold text-concrete-900 dark:text-white">
                            {ord.customerName}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-concrete-500 dark:text-zinc-400">
                          {ord.customerPhone}
                        </p>
                      </div>

                      <span className="text-[10px] px-2 py-0.5 rounded font-bold border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        Brewing
                      </span>
                    </div>

                    {/* Vehicle & Payment */}
                    <div className="flex flex-wrap items-center gap-2">
                      {ord.carType || ord.carPlate ? (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                          <Car className="w-3.5 h-3.5" />
                          <span>{ord.carType || 'Car'}</span>
                          {ord.carPlate && (
                            <span className="font-mono bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-[11px]">
                              {ord.carPlate}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-block text-[11px] text-concrete-600 dark:text-zinc-400 bg-concrete-100 dark:bg-white/5 px-2.5 py-1 rounded-lg font-medium">
                          🚶 Walk-Up Express Counter
                        </span>
                      )}

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500/15 text-brand-sky">
                        COLLECT AT WINDOW (₹{ord.total.toFixed(2)})
                      </span>
                    </div>

                    <div className="space-y-1.5 py-2 border-y border-concrete-200 dark:border-white/10 text-xs">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-amber-500 text-xs w-4">
                              {it.quantity}x
                            </span>
                            <span className="font-semibold text-concrete-800 dark:text-zinc-200">
                              {it.name}
                            </span>
                          </div>
                          <span className="font-mono text-concrete-500 dark:text-zinc-400 text-[11px]">
                            ₹{it.price * it.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] text-concrete-500 dark:text-zinc-400 block font-semibold">EST. TIME</span>
                        <span className="text-xs font-mono font-bold text-concrete-800 dark:text-zinc-200">
                          ~3 mins left
                        </span>
                      </div>

                      <button
                        onClick={() => handleStatusChange(ord.id, 'ready')}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-black shadow-md transition flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Mark Ready at Window 🛎️</span>
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

          {/* ========================================= */}
          {/* LANE 3: READY AT DRIVE-THRU WINDOW */}
          {/* ========================================= */}
          <div className="flex flex-col rounded-3xl border border-concrete-300 dark:border-white/10 bg-white/60 dark:bg-noir-card/60 p-4 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between pb-3 border-b border-concrete-200 dark:border-white/10 mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <h2 className="font-bold text-sm tracking-wide uppercase text-concrete-900 dark:text-white">
                  Ready at Window ({readyOrders.length})
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                DRIVE-THRU LANE 1
              </span>
            </div>

            <div className="space-y-4 overflow-y-auto flex-1 max-h-[calc(100vh-210px)] pr-1">
              {readyOrders.length === 0 ? (
                <div className="py-20 text-center text-concrete-400 dark:text-zinc-500 rounded-2xl border border-dashed border-concrete-200 dark:border-white/10">
                  <span className="text-3xl block mb-2">🎉</span>
                  <p className="text-xs font-bold">No orders waiting at window</p>
                  <p className="text-[11px] mt-1">Ready orders will appear here for handover</p>
                </div>
              ) : (
                readyOrders.map(ord => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-2xl border-l-4 border-l-emerald-500 border-y border-r border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-surface shadow-md space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-black text-emerald-500 font-mono">
                            {ord.token}
                          </span>
                          <span className="text-xs font-bold text-concrete-900 dark:text-white">
                            {ord.customerName}
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-concrete-500 dark:text-zinc-400">
                          {ord.customerPhone}
                        </p>
                      </div>

                      <span className="text-[10px] px-2.5 py-0.5 rounded font-black bg-emerald-500 text-black animate-pulse">
                        READY
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {ord.carType || ord.carPlate ? (
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                          <Car className="w-3.5 h-3.5" />
                          <span>{ord.carType || 'Car'}</span>
                          {ord.carPlate && (
                            <span className="font-mono bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded text-[11px]">
                              {ord.carPlate}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="inline-block text-[11px] text-concrete-600 dark:text-zinc-400 bg-concrete-100 dark:bg-white/5 px-2.5 py-1 rounded-lg font-medium">
                          🚶 Walk-Up Express Counter
                        </span>
                      )}

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
                        COLLECT AT WINDOW (₹{ord.total.toFixed(2)})
                      </span>
                    </div>

                    <div className="space-y-1.5 py-2 border-y border-concrete-200 dark:border-white/10 text-xs">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-emerald-500 text-xs w-4">
                              {it.quantity}x
                            </span>
                            <span className="font-semibold text-concrete-800 dark:text-zinc-200">
                              {it.name}
                            </span>
                          </div>
                          <span className="font-mono text-concrete-500 dark:text-zinc-400 text-[11px]">
                            ₹{it.price * it.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Actions: Collected Handover OR Mark No-Show */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
                      <div>
                        <span className="text-[10px] text-concrete-500 dark:text-zinc-400 block font-semibold">
                          COLLECT AT WINDOW
                        </span>
                        <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                          ₹{ord.total.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* No-show reporting to blacklist fake orders */}
                        <button
                          onClick={() => markNoShow(ord.id)}
                          className="px-2.5 py-2 rounded-xl text-[11px] font-bold border border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 transition flex items-center gap-1"
                          title="Mark customer as no-show and blacklist phone"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>No-Show / Cancel</span>
                        </button>

                        <button
                          onClick={() => handleStatusChange(ord.id, 'dispatched')}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-black shadow-md transition flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Handed Over & Paid ✅</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </main>

      {/* BLACKLISTED NUMBERS SLIDE-OVER MODAL */}
      {showBlacklistDrawer && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl border border-red-500/30 bg-white dark:bg-noir-surface p-6 shadow-2xl relative">
            <button
              onClick={() => setShowBlacklistDrawer(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-concrete-400 hover:text-white"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 text-red-500 mb-2 font-bold text-sm">
              <ShieldAlert className="w-5 h-5" />
              <span>No-Show Blacklist (Physical Fraud Protection)</span>
            </div>
            <p className="text-xs text-concrete-500 dark:text-zinc-400 mb-4">
              Phone numbers flagged for uncollected orders will be blocked from placing drive-thru orders.
            </p>
            <div className="max-h-60 overflow-y-auto space-y-2 mb-4">
              {blacklistedPhones.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-concrete-300 dark:border-white/10 text-center text-xs text-concrete-400">
                  No flagged numbers yet. If someone doesn't pick up their order, click "No-Show / Cancel" on their ticket.
                </div>
              ) : (
                blacklistedPhones.map((p, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-red-500/20 bg-red-500/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-red-500 font-bold">{p}</span>
                    <span className="text-[10px] text-red-400">Blocked</span>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setShowBlacklistDrawer(false)}
              className="w-full py-2.5 rounded-xl bg-concrete-100 dark:bg-white/10 text-xs font-bold text-concrete-800 dark:text-white hover:bg-concrete-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
