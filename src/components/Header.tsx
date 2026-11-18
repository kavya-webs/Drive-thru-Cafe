'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { ShoppingBag, Sun, Moon, User, LogOut } from 'lucide-react';

interface HeaderProps {
  currentView: 'menu' | 'track';
  onNavigate: (view: 'menu' | 'track') => void;
  onOpenAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenAuth,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { itemCount, toggleDrawer } = useCart();
  const { currentUser, logoutCustomer, activeOrder } = useOrders();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b transition-colors bg-white/95 dark:bg-noir-base/95 border-concrete-300 dark:border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 py-3 flex items-center justify-between gap-3">
        
        {/* Brand Logo & Tagline */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none" 
          onClick={() => onNavigate('menu')}
          title="Grey Dot. Coffee Shop Surat"
        >
          <div className="relative h-9 w-32 sm:w-36">
            <Image
              src="/grey_dot_logo_straight.png"
              alt="grey dot."
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-500/10 text-brand-sky border border-brand-sky/20">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-sky animate-pulse"></span>
            DRIVE-THRU & TO-GO
          </span>
        </div>

        {/* Customer Navigation Tabs (Only Menu & Live Token) */}
        <nav className="flex items-center gap-1 p-1 rounded-xl text-xs font-semibold bg-concrete-100 dark:bg-white/5 border border-concrete-200 dark:border-white/10">
          <button
            onClick={() => onNavigate('menu')}
            className={`px-4 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              currentView === 'menu'
                ? 'bg-brand-sky text-black font-bold shadow-sm'
                : 'text-concrete-700 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <span>☕</span>
            <span>Menu</span>
          </button>

          <button
            onClick={() => onNavigate('track')}
            className={`px-4 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 relative ${
              currentView === 'track'
                ? 'bg-brand-sky text-black font-bold shadow-sm'
                : 'text-concrete-700 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <span>📍</span>
            <span>Live Token</span>
            {activeOrder && (
              <span className="w-2 h-2 rounded-full bg-brand-sky animate-ping absolute -top-0.5 -right-0.5"></span>
            )}
          </button>
        </nav>

        {/* Right Controls: Sign In / Customer Profile, Theme & Cart */}
        <div className="flex items-center gap-2">
          
          {/* Customer Profile or Sign In Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-concrete-300 dark:border-white/10 text-xs bg-white dark:bg-noir-card hover:border-brand-sky transition"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-concrete-900 dark:text-zinc-200 max-w-[100px] truncate">
                  {currentUser.name}
                </span>
              </button>

              {/* Profile Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-card p-2 shadow-xl z-50 text-xs">
                  <div className="p-2 border-b border-concrete-200 dark:border-white/10">
                    <p className="font-bold text-concrete-900 dark:text-white truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-concrete-500 dark:text-zinc-400 truncate">{currentUser.phone}</p>
                  </div>
                  <button
                    onClick={() => {
                      logoutCustomer();
                      setShowUserMenu(false);
                    }}
                    className="w-full mt-1.5 flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition font-medium text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-concrete-300 dark:border-white/10 text-xs font-bold text-concrete-800 dark:text-zinc-200 hover:border-brand-sky hover:text-brand-sky transition bg-white dark:bg-noir-card shadow-sm"
              title="Sign in as Customer or Barista"
            >
              <User className="w-3.5 h-3.5 text-brand-sky" />
              <span>Sign In</span>
            </button>
          )}

          {/* Theme Toggle Button (Light Mode / Dark Mode) */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-card text-concrete-800 dark:text-zinc-200 hover:border-brand-sky transition-all flex items-center justify-center text-xs font-bold shadow-sm"
            title={theme === 'dark' ? 'Switch to Light Mode (Concrete Grey)' : 'Switch to Dark Mode (Noir Urban)'}
          >
            {theme === 'dark' ? (
              <span className="flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Light</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Moon className="w-4 h-4 text-sky-600" />
                <span className="hidden sm:inline">Dark</span>
              </span>
            )}
          </button>

          {/* Cart Trigger Button */}
          <button
            onClick={toggleDrawer}
            className="relative p-2.5 rounded-xl border border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-card text-concrete-900 dark:text-white hover:border-brand-sky transition flex items-center justify-center shadow-sm"
            title="View Drive-Thru Cart"
          >
            <ShoppingBag className="w-5 h-5 text-concrete-900 dark:text-zinc-100" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-sky text-black text-[11px] font-black rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                {itemCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
