'use client';

import React from 'react';
import { useOrders } from '@/context/OrderContext';
import { Coffee, MapPin } from 'lucide-react';

interface BottomNavProps {
  currentView: 'menu' | 'track';
  onNavigate: (view: 'menu' | 'track') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate }) => {
  const { activeOrder } = useOrders();

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-noir-base/95 backdrop-blur-md border-t border-concrete-300 dark:border-white/10 px-3 py-2 sm:py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] transition-colors"
    >
      <div className="max-w-md mx-auto flex items-center justify-around gap-2.5">
        
        {/* Tab 1: Menu */}
        <button
          onClick={() => {
            onNavigate('menu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 py-2.5 px-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs font-bold whitespace-nowrap flex-shrink-0 ${
            currentView === 'menu'
              ? 'bg-brand-sky text-black shadow-md shadow-brand-sky/25 font-black scale-[1.02]'
              : 'text-concrete-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-concrete-100 dark:hover:bg-white/5'
          }`}
          aria-label="View Drive-Thru Menu"
        >
          <Coffee className="w-4 h-4 flex-shrink-0" />
          <span className="whitespace-nowrap">Drive-Thru Menu</span>
        </button>

        {/* Tab 2: Live Token */}
        <button
          onClick={() => {
            onNavigate('track');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex-1 py-2.5 px-3 rounded-2xl transition-all flex items-center justify-center gap-2 text-xs font-bold relative whitespace-nowrap flex-shrink-0 ${
            currentView === 'track'
              ? 'bg-brand-sky text-black shadow-md shadow-brand-sky/25 font-black scale-[1.02]'
              : 'text-concrete-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-concrete-100 dark:hover:bg-white/5'
          }`}
          aria-label="View Live Drive-Thru Token"
        >
          <div className="relative flex-shrink-0">
            <MapPin className="w-4 h-4 flex-shrink-0" />
            {activeOrder && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute -top-0.5 -right-0.5"></span>
            )}
          </div>
          <span className="whitespace-nowrap">
            {activeOrder ? `Live Token (${activeOrder.token})` : 'Live Token'}
          </span>
          {activeOrder && (
            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
          )}
        </button>

      </div>
    </nav>
  );
};
