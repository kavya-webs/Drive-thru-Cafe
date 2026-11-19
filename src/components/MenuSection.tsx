'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CategoryId } from '@/types';
import { useCart } from '@/context/CartContext';
import { useMenu } from '@/context/MenuContext';
import { 
  Coffee, 
  MapPin, 
  Clock, 
  HelpCircle, 
  Phone, 
  ShieldCheck, 
  Car, 
  ChevronDown,
  Sparkles,
  CreditCard
} from 'lucide-react';

export const MenuSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { addToCart } = useCart();
  const { menuItems } = useMenu();

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
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const faqs = [
    {
      q: 'How does the Grey Dot Drive-Thru ordering process work?',
      a: 'Browse our menu on your phone, choose your favorite coffees, shakes, pizzas, or pasta, and proceed to checkout. As long as you are within our 3.0 km drive-thru radius, you will receive an instant digital Live Token (e.g., #GD-101). Drive straight into Lane 1 at ITC Mantra, Ram Chowk, Mota Varachha, show your token number, collect your freshly prepared order, and pay at the counter.',
    },
    {
      q: 'Why does Grey Dot only accept orders within a 3.0 km radius?',
      a: 'We pride ourselves on the highest culinary quality. Coffees and hot pizzas lose their peak temperature and thick shakes melt if kept waiting. By accepting orders exclusively within 3 km of Ram Chowk, our baristas begin preparation as you drive toward the lane, ensuring your order is fresh and hot or icy cold the second your car pulls up to the window.',
    },
    {
      q: 'How does payment work? Can I pay online?',
      a: 'To guarantee speed of service and protect customers against network failures in transit, payment is handled strictly physically at the drive-thru window (Lane 1). We accept all payment methods at the counter including Cash, UPI (Google Pay, PhonePe, Paytm), and Credit/Debit cards.',
    },
    {
      q: 'What are the operating hours and location of Grey Dot in Surat?',
      a: 'Grey Dot. Coffee Shop is located at ITC Mantra, Ram Chowk, Mota Varachha, Surat, Gujarat 394101. We are open 7 days a week from 10:00 AM to 12:00 Midnight.',
    },
    {
      q: 'Is Grey Dot 100% vegetarian?',
      a: 'Yes, Grey Dot Coffee Shop in Surat is 100% vegetarian. All artisan pizzas, pastas, fast food bites, and handcrafted thick shakes are prepared with strictly vegetarian ingredients.',
    },
    {
      q: 'What is the customer care phone number and email for assistance?',
      a: 'You can reach Grey Dot Customer Care at +91 97270 42420 (Phone and WhatsApp support) or via email at care@greydotcoffee.com. Our on-duty lane supervisor will assist you immediately.',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-28">
      
      {/* Store Status Hero Banner - Highly Mobile & iPad Responsive */}
      <div className="p-4 sm:p-5 mb-6 sm:mb-8 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-l-4 border-l-brand-sky bg-white dark:bg-noir-card border-concrete-300 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl sm:text-2xl border bg-brand-sky/10 border-brand-sky/20 text-brand-sky flex-shrink-0">
            <Coffee className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-concrete-900 dark:text-white">
                Grey Dot. Coffee Shop Surat
              </h1>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 whitespace-nowrap flex-shrink-0 inline-flex items-center">
                DRIVE-THRU ACTIVE (&lt; 3 KM)
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-concrete-600 dark:text-zinc-400 mt-0.5">
              ITC Mantra, Ram Chowk, Mota Varachha, Surat · Order ahead from car
            </p>
          </div>
        </div>

        {/* 3 Metric Pills: Balanced 3-column grid on mobile / flex on desktop */}
        <div className="grid grid-cols-3 gap-2 w-full md:w-auto text-xs">
          <div className="p-2 sm:px-3.5 sm:py-2 rounded-xl border border-concrete-200 dark:border-white/10 text-center sm:text-right bg-concrete-50 dark:bg-white/5">
            <span className="text-concrete-500 dark:text-zinc-500 block text-[9px] sm:text-[10px] font-semibold">RADIUS</span>
            <span className="font-bold text-red-500 dark:text-red-400 font-mono text-xs sm:text-sm">&lt; 3.0 km</span>
          </div>
          <div className="p-2 sm:px-3.5 sm:py-2 rounded-xl border border-concrete-200 dark:border-white/10 text-center sm:text-right bg-concrete-50 dark:bg-white/5">
            <span className="text-concrete-500 dark:text-zinc-500 block text-[9px] sm:text-[10px] font-semibold">EST. PREP</span>
            <span className="font-bold text-brand-sky font-mono text-xs sm:text-sm">~5-7 Mins</span>
          </div>
          <div className="p-2 sm:px-3.5 sm:py-2 rounded-xl border border-concrete-200 dark:border-white/10 text-center sm:text-right bg-concrete-50 dark:bg-white/5">
            <span className="text-concrete-500 dark:text-zinc-500 block text-[9px] sm:text-[10px] font-semibold">PAYMENT</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm">At Window</span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills (Touch-scrollable on mobile, wraps on tablet/desktop to eliminate horizontal scrollbar) */}
      <div className="flex items-center gap-2 overflow-x-auto sm:flex-wrap pb-2 mb-6 no-scrollbar text-sm -mx-1 px-1 sm:mx-0 sm:px-0">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all border ${
              selectedCategory === cat.id
                ? 'bg-brand-sky text-black border-brand-sky font-bold shadow-md'
                : 'bg-white dark:bg-noir-card text-concrete-700 dark:text-zinc-400 border-concrete-300 dark:border-white/10 hover:border-brand-sky'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Menu Grid with Real Food Photos (1 col mobile, 2 col tablet/iPad portrait, 3 col iPad landscape, 4 col desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredItems.map(item => (
          <article
            key={item.id}
            className="group rounded-2xl border border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-card overflow-hidden flex flex-col justify-between hover:border-brand-sky hover:shadow-xl transition-all duration-300"
          >
            {/* Real Food Photo Container */}
            <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-concrete-100 dark:bg-white/5">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Badges */}
              {item.badge && (
                <span className="absolute top-2.5 left-2.5 bg-brand-sky text-black text-[10px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md shadow-md whitespace-nowrap flex-shrink-0 inline-flex items-center">
                  {item.badge}
                </span>
              )}

              {item.isVeg && (
                <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30 text-emerald-400 bg-black/70 backdrop-blur-md whitespace-nowrap flex-shrink-0 inline-flex items-center">
                  🌱 100% VEG
                </span>
              )}
            </div>

            {/* Item Details */}
            <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-sm sm:text-base leading-snug text-concrete-900 dark:text-white">
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
                  <span className="text-base sm:text-lg font-bold font-mono text-concrete-900 dark:text-white">
                    ₹{item.price}
                  </span>
                </div>

                <button
                  onClick={() => addToCart(item)}
                  className="px-3.5 sm:px-4 py-2 text-xs font-bold rounded-xl bg-brand-sky hover:bg-brand-skyDark text-black shadow-md hover:shadow-brand-sky/20 transition-all flex items-center gap-1.5 active:scale-95 whitespace-nowrap flex-shrink-0"
                  aria-label={`Add ${item.name} to car`}
                >
                  <span>+ Add to Car</span>
                </button>
              </div>
            </div>

          </article>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* LLM-SEO & GEO / USER GUIDE SECTION: High Structured Context for AI & SEO */}
      {/* ========================================================================= */}
      <section className="mt-16 pt-12 border-t border-concrete-300 dark:border-white/10" aria-label="About Grey Dot Coffee and Drive-Thru FAQs">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-black uppercase tracking-widest text-brand-sky px-3 py-1 rounded-full bg-brand-sky/10 border border-brand-sky/20 inline-block mb-3">
            Surat Drive-Thru Guide &amp; FAQs
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-concrete-900 dark:text-white tracking-tight">
            Everything You Need To Know About Ordering at Grey Dot
          </h2>
          <p className="text-xs sm:text-sm text-concrete-600 dark:text-zinc-400 mt-2">
            Answers to common questions about our &lt; 3 km drive-thru perimeter, physical payment at Lane 1, and specialty brews in Mota Varachha.
          </p>
        </div>

        {/* FAQ Accordion Grid */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-card overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-concrete-900 dark:text-white hover:text-brand-sky transition"
                  aria-expanded={isOpen}
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-brand-sky flex-shrink-0" />
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-concrete-500 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180 text-brand-sky' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs text-concrete-600 dark:text-zinc-400 leading-relaxed border-t border-concrete-100 dark:border-white/5 mt-1">
                    <p className="pt-2">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Customer Care Contact Callout Bar */}
        <div className="max-w-3xl mx-auto mt-8 p-4 sm:p-6 rounded-2xl bg-concrete-100 dark:bg-white/5 border border-concrete-300 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-brand-sky/20 text-brand-sky flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-concrete-900 dark:text-white">
                Have a question or custom request?
              </p>
              <p className="text-[11px] text-concrete-600 dark:text-zinc-400">
                Call our barista counter at <strong>+91 97270 42420</strong> or email <strong>care@greydotcoffee.com</strong>.
              </p>
            </div>
          </div>
          <a
            href="tel:+919727042420"
            className="px-4 py-2 rounded-xl bg-brand-sky hover:bg-brand-skyDark text-black text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Customer Care</span>
          </a>
        </div>

      </section>

    </section>
  );
};
