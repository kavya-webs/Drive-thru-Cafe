'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { ShoppingBag, Sun, Moon, User, LogOut, Phone } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors bg-white/95 dark:bg-noir-base/95 border-concrete-300 dark:border-white/10 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-3">
        
        {/* Brand Logo & Tagline */}
        <div 
          className="flex items-center gap-1.5 sm:gap-3 cursor-pointer select-none flex-shrink-0" 
          onClick={() => onNavigate('menu')}
          title="Grey Dot. Coffee Shop Surat"
        >
          <div className="relative h-6 w-20 sm:h-8 sm:w-28 md:w-32">
            <Image
              src="/grey_dot_logo_straight.png"
              alt="Grey Dot. Coffee Shop"
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="hidden xl:inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-brand-sky border border-brand-sky/20">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-sky animate-pulse"></span>
            DRIVE-THRU &amp; TO-GO
          </span>
        </div>

        {/* Customer Navigation Tabs (Menu & Live Token) */}
        <nav className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-xl text-xs font-semibold bg-concrete-100 dark:bg-white/5 border border-concrete-200 dark:border-white/10 flex-shrink-0">
          <button
            onClick={() => onNavigate('menu')}
            className={`px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1 text-[11px] sm:text-xs ${
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
            className={`px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-lg transition whitespace-nowrap flex items-center gap-1 relative text-[11px] sm:text-xs ${
              currentView === 'track'
                ? 'bg-brand-sky text-black font-bold shadow-sm'
                : 'text-concrete-700 dark:text-zinc-400 hover:text-black dark:hover:text-white'
            }`}
          >
            <span>📍</span>
            <span className="hidden sm:inline">Live </span>
            <span>Token</span>
            {activeOrder && (
              <span className="w-2 h-2 rounded-full bg-brand-sky animate-ping absolute -top-0.5 -right-0.5"></span>
            )}
          </button>
        </nav>

        {/* Right Controls: Customer Care, Sign In / Profile, Theme & Cart */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          
          {/* Customer Care Hotline Link (Desktop only to prevent mobile navbar crowding) */}
          <a
            href="tel:+919727042420"
            className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-concrete-300 dark:border-white/10 text-xs font-bold text-concrete-700 dark:text-zinc-300 hover:border-brand-sky hover:text-brand-sky transition bg-white dark:bg-noir-card"
            title="Call Customer Care (+91 97270 42420)"
          >
            <Phone className="w-3.5 h-3.5 text-brand-sky" />
            <span className="hidden xl:inline">+91 97270 42420</span>
            <span className="xl:hidden">Care</span>
          </a>

          {/* Customer Profile or Sign In Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-concrete-300 dark:border-white/10 text-xs bg-white dark:bg-noir-card hover:border-brand-sky transition"
              >
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500"></span>
                <span className="font-semibold text-concrete-900 dark:text-zinc-200 max-w-[60px] sm:max-w-[100px] truncate text-[11px] sm:text-xs">
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
              className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-concrete-300 dark:border-white/10 text-xs font-bold text-concrete-800 dark:text-zinc-200 hover:border-brand-sky hover:text-brand-sky transition bg-white dark:bg-noir-card shadow-sm"
              title="Sign in as Customer or Barista"
              aria-label="Sign In"
            >
              <User className="w-3.5 h-3.5 text-brand-sky" />
              <span className="hidden sm:inline text-xs">Sign In</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl border border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-card text-concrete-800 dark:text-zinc-200 hover:border-brand-sky transition-all flex items-center justify-center shadow-sm"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600" />
            )}
          </button>

          {/* Cart Trigger Button */}
          <button
            onClick={toggleDrawer}
            className="relative p-1.5 sm:p-2 rounded-xl border border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-card text-concrete-900 dark:text-white hover:border-brand-sky transition flex items-center justify-center shadow-sm"
            title="View Drive-Thru Cart"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4 sm:w-4 sm:h-4 text-concrete-900 dark:text-zinc-100" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-4.5 sm:h-4.5 bg-brand-sky text-black text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-in zoom-in">
                {itemCount}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
