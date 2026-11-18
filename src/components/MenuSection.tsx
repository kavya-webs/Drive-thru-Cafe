'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MENU_ITEMS } from '@/lib/menuData';
import { CategoryId, MenuItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { Coffee, Flame, Sparkles, Clock, CheckCircle } from 'lucide-react';

export const MenuSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const { addToCart } = useCart();

  const categories: { id: CategoryId; label: string }[] = [
    { id: 'all', label: '⚡ All Items' },
    { id: 'cold', label: '🧊 Signature Cold Coffees' },
    { id: 'hot', label: '☕ Hot Brews' },
    { id: 'shakes', label: '🥤 Thick Shakes' },
    { id: 'pizza', label: '🍕 Handcrafted Pizzas' },
    { id: 'pasta', label: '🍝 Pasta' },
    { id: 'bites', label: '🍟 Fast Food & Fries' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-28">
      
      {/* Store Status Hero Banner */}
      <div className="p-5 mb-8 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-l-brand-sky bg-white dark:bg-noir-card border-concrete-300 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border bg-brand-sky/10 border-brand-sky/20 text-brand-sky">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-concrete-900 dark:text-white">
                Grey Dot. Coffee Shop Surat
              </h1>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                DRIVE-THRU OPEN (&lt; 3 KM ONLY)
              </span>
            </div>
            <p className="text-xs text-concrete-600 dark:text-zinc-400 mt-0.5">
              ITC Mantra, Ram Chowk, Mota Varachha, Surat · Orders accepted within 3 km only
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="px-3.5 py-2 rounded-xl border border-concrete-200 dark:border-white/10 text-right bg-concrete-50 dark:bg-white/5">
            <span className="text-concrete-500 dark:text-zinc-500 block text-[10px] font-semibold">DRIVE-THRU RADIUS</span>
            <span className="font-bold text-red-500 dark:text-red-400 font-mono text-sm">&lt; 3.0 km</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl border border-concrete-200 dark:border-white/10 text-right bg-concrete-50 dark:bg-white/5">
            <span className="text-concrete-500 dark:text-zinc-500 block text-[10px] font-semibold">EST. PREP</span>
            <span className="font-bold text-brand-sky font-mono text-sm">~5-7 Mins</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl border border-concrete-200 dark:border-white/10 text-right bg-concrete-50 dark:bg-white/5">
            <span className="text-concrete-500 dark:text-zinc-500 block text-[10px] font-semibold">PAYMENT</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">Pay at Window</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-3 mb-6 no-scrollbar text-sm">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? 'bg-brand-sky text-black border-brand-sky font-bold shadow-md'
                : 'bg-white dark:bg-noir-card text-concrete-700 dark:text-zinc-400 border-concrete-300 dark:border-white/10 hover:border-brand-sky'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Menu Grid with Real Food Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="group rounded-2xl border border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-card overflow-hidden flex flex-col justify-between hover:border-brand-sky hover:shadow-xl transition-all duration-300"
          >
            {/* Real Food Photo Container */}
            <div className="relative h-48 w-full overflow-hidden bg-concrete-100 dark:bg-white/5">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Badges */}
              {item.badge && (
                <span className="absolute top-3 left-3 bg-brand-sky text-black text-[10px] font-black px-2.5 py-1 rounded-md shadow-md">
                  {item.badge}
                </span>
              )}

              {item.isVeg && (
                <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-400 bg-black/60 backdrop-blur-md">
                  🌱 100% VEG
                </span>
              )}
            </div>

            {/* Item Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-base leading-snug text-concrete-900 dark:text-white">
                  {item.name}
                </h3>
                <p className="text-xs text-concrete-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Price & Add Action */}
              <div className="mt-4 pt-3 border-t border-concrete-200 dark:border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-concrete-500 dark:text-zinc-500 text-[10px] block font-semibold">PRICE</span>
                  <span className="text-lg font-bold font-mono text-concrete-900 dark:text-white">
                    ₹{item.price}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(item)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-brand-sky hover:bg-brand-skyDark text-black shadow-md hover:shadow-brand-sky/20 transition-all flex items-center gap-1.5"
                >
                  <span>+ Add to Car</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
