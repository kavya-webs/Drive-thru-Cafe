'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { RotateCcw } from 'lucide-react';

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [statusMessage, setStatusMessage] = useState('Calibrating Espresso Grind...');

  const startAnimation = () => {
    setProgress(10);
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(interval);
          setStatusMessage('Drive-Thru Lane Online!');
          setTimeout(() => onComplete(), 700);
          return 100;
        }

        if (next <= 35) setStatusMessage('Calibrating Espresso Grind...');
        else if (next <= 65) setStatusMessage('Connecting to Drive-Thru Dispatch...');
        else if (next <= 85) setStatusMessage('Synchronizing Ram Chowk Menu...');
        else setStatusMessage('Drive-Thru Lane Online!');

        return next;
      });
    }, 90);
  };

  useEffect(() => {
    startAnimation();
  }, []);

  return (
    <section className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl border border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-card shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-sky to-transparent"></div>

        <div className="relative h-10 w-36 mx-auto mb-6">
          <Image
            src="/grey_dot_logo_straight.png"
            alt="grey dot."
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Animated Coffee Brewing Cup Icon with Steam */}
        <div className="relative w-28 h-28 mx-auto my-4 flex items-center justify-center">
          <svg className="absolute -top-6 w-16 h-12" viewBox="0 0 60 40" fill="none">
            <path
              className="animate-[steamFloat_2.2s_infinite_ease-out]"
              d="M18 35 C15 25, 25 15, 20 5"
              stroke="#6ec6f1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              className="animate-[steamFloat_2.6s_infinite_0.5s_ease-out]"
              d="M30 38 C27 28, 37 18, 32 8"
              stroke="#6ec6f1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              className="animate-[steamFloat_2.4s_infinite_1s_ease-out]"
              d="M42 35 C39 25, 49 15, 44 5"
              stroke="#6ec6f1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg border border-concrete-200 dark:border-white/10 bg-concrete-100 dark:bg-white/5">
            ☕
          </div>
        </div>

        <h3 className="text-lg font-bold tracking-tight mt-2 text-concrete-900 dark:text-white">
          {statusMessage}
        </h3>
        <p className="text-xs text-concrete-500 dark:text-zinc-400 mt-1">
          Connecting to Grey Dot Mota Varachha counter
        </p>

        {/* Progress Track */}
        <div className="w-full rounded-full h-2.5 my-6 overflow-hidden p-0.5 border border-concrete-200 dark:border-white/10 bg-concrete-100 dark:bg-noir-surface">
          <div
            className="h-full rounded-full bg-brand-sky transition-all duration-300 shadow-[0_0_12px_rgba(110,198,241,0.35)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-concrete-500 dark:text-zinc-500">
          <span className="font-mono font-bold text-brand-sky">{progress}%</span>
          <span>DRIVE-THRU READY</span>
        </div>

        <button
          onClick={startAnimation}
          className="mt-8 px-4 py-2.5 rounded-xl border border-concrete-300 dark:border-white/10 text-xs font-semibold text-concrete-700 dark:text-zinc-300 hover:border-brand-sky transition w-full flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Replay Loading Sequence</span>
        </button>

      </div>
    </section>
  );
};
