'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useOrders } from '@/context/OrderContext';
import { ArrowRight, Check } from 'lucide-react';

interface SuccessOverlayProps {
  onGoToTrack: () => void;
}

export const SuccessOverlay: React.FC<SuccessOverlayProps> = ({ onGoToTrack }) => {
  const { showSuccessModal, closeSuccessModal, activeOrder } = useOrders();

  useEffect(() => {
    if (showSuccessModal) {
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6ec6f1', '#ffffff', '#10b981', '#fbbf24'],
        });
      } catch (e) {
        // confetti error fallback
      }

      // Auto close and go to track after 4s
      const timer = setTimeout(() => {
        closeSuccessModal();
        onGoToTrack();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showSuccessModal, closeSuccessModal, onGoToTrack]);

  if (!showSuccessModal || !activeOrder) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="max-w-md w-full rounded-3xl border border-concrete-300 dark:border-white/10 p-8 sm:p-10 text-center relative overflow-hidden bg-white dark:bg-noir-surface shadow-2xl">
        
        {/* Glowing Top Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-brand-sky shadow-[0_0_20px_#6ec6f1]"></div>

        {/* Animated SVG Checkmark */}
        <div className="w-20 h-20 mx-auto mb-4 relative flex items-center justify-center">
          <svg className="w-20 h-20" viewBox="0 0 52 52">
            <circle
              className="stroke-brand-sky fill-none"
              strokeWidth="3"
              strokeDasharray="166"
              strokeDashoffset="0"
              cx="26"
              cy="26"
              r="25"
            />
            <path
              className="stroke-brand-sky fill-none"
              strokeWidth="3.5"
              strokeLinecap="round"
              d="M14.1 27.2l7.1 7.2 16.7-16.8"
            />
          </svg>
        </div>

        <span className="text-xs font-black tracking-widest text-brand-sky uppercase block">
          TRANSMITTED TO COUNTER
        </span>
        <h2 className="text-2xl font-black text-concrete-900 dark:text-white tracking-tight mt-1 mb-2">
          Order Confirmed!
        </h2>
        <p className="text-xs text-concrete-600 dark:text-zinc-400 leading-relaxed max-w-xs mx-auto">
          Your order has popped up on the Barista counter screen at Grey Dot Ram Chowk.
        </p>

        {/* Token Card */}
        <div className="my-6 p-4 rounded-2xl border border-concrete-200 dark:border-white/10 bg-concrete-50 dark:bg-white/5">
          <span className="text-[10px] text-concrete-500 dark:text-zinc-500 font-bold uppercase tracking-wider block">
            ASSIGNED PICKUP TOKEN
          </span>
          <div className="text-5xl font-black text-brand-sky font-mono tracking-tight my-1">
            {activeOrder.token}
          </div>
          <span className="text-xs text-concrete-600 dark:text-zinc-300 font-medium">
            {activeOrder.carType || activeOrder.carPlate
              ? `🚗 ${activeOrder.carType} (${activeOrder.carPlate})`
              : '🚶 Walk-Up Express Counter'}
          </span>
        </div>

        <button
          onClick={() => {
            closeSuccessModal();
            onGoToTrack();
          }}
          className="w-full py-3.5 text-sm font-bold rounded-xl bg-brand-sky hover:bg-brand-skyDark text-black shadow-lg shadow-brand-sky/20 transition-all flex items-center justify-center gap-2"
        >
          <span>Open Live Token Tracker</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <span className="text-[10px] text-concrete-400 dark:text-zinc-500 mt-3 block">
          Auto-opening live token in 4 seconds...
        </span>

      </div>
    </div>
  );
};
