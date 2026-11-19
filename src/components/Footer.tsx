'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Car, 
  ExternalLink,
  MessageCircle,
  Coffee
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-surface text-concrete-800 dark:text-zinc-300 transition-colors">
      
      {/* Customer Care Hotline Banner (Mobile & iPad Highlight) */}
      <div className="bg-brand-sky/10 dark:bg-brand-sky/5 border-b border-brand-sky/20 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-sky text-black flex items-center justify-center font-bold flex-shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wider text-concrete-900 dark:text-white">
                Customer Care & Drive-Thru Inquiries
              </p>
              <p className="text-[11px] text-concrete-600 dark:text-zinc-400">
                Need help with your live token or arriving at Lane 1? Call or WhatsApp our counter team directly.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <a
              href="tel:+919727042420"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-concrete-900 text-white dark:bg-white dark:text-black font-bold text-xs shadow-sm hover:opacity-90 transition active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 text-brand-sky" />
              <span>+91 97270 42420</span>
            </a>

            <a
              href="https://wa.me/919727042420?text=Hi%20Grey%20Dot%20Coffee%2C%20inquiring%20about%20my%20drive-thru%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>

            <a
              href="mailto:care@greydotcoffee.com"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-concrete-300 dark:border-white/10 bg-white dark:bg-noir-card hover:border-brand-sky text-concrete-900 dark:text-white font-bold text-xs transition active:scale-95"
            >
              <Mail className="w-3.5 h-3.5 text-brand-sky" />
              <span>care@greydotcoffee.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <div className="relative h-8 w-32">
              <Image
                src="/grey_dot_logo_straight.png"
                alt="Grey Dot. Coffee Shop Surat"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-xs leading-relaxed text-concrete-600 dark:text-zinc-400">
              Surat&apos;s signature specialty drive-thru &amp; express takeaway coffee shop. High-elevation Arabica beans, thick shakes, artisan pizzas, and hot pasta prepared fresh as you pull into Lane 1.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] font-bold text-brand-sky">
              <span className="w-2 h-2 rounded-full bg-brand-sky animate-ping"></span>
              <span>LANE 1 EXPRESS WINDOW ACTIVE</span>
            </div>
          </div>

          {/* Column 2: Drive-Thru Policy & Guidelines */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-concrete-900 dark:text-white">
              Drive-Thru Rules
            </h4>
            <ul className="space-y-2.5 text-xs text-concrete-600 dark:text-zinc-400">
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span><strong>&lt; 3 km Radius:</strong> Orders are strictly limited to vehicles within 3.0 km of Ram Chowk.</span>
              </li>
              <li className="flex items-start gap-2">
                <Car className="w-4 h-4 text-brand-sky flex-shrink-0 mt-0.5" />
                <span><strong>Lane 1 Collection:</strong> Drive into Lane 1 window upon arrival and display your Live Token.</span>
              </li>
              <li className="flex items-start gap-2">
                <Coffee className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span><strong>Physical Payment:</strong> Cash, Card, or UPI accepted physically at counter upon pickup.</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Location & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-concrete-900 dark:text-white">
              Store Location &amp; Hours
            </h4>
            <div className="space-y-2.5 text-xs text-concrete-600 dark:text-zinc-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-sky flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-concrete-900 dark:text-white">Grey Dot. Coffee Shop</p>
                  <p>ITC Mantra, Ram Chowk, Mota Varachha, Surat, Gujarat 394101</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Open Daily: <strong>10:00 AM – 12:00 Midnight</strong></span>
              </div>
              <a
                href="https://maps.google.com/?q=ITC+Mantra+Ram+Chowk+Mota+Varachha+Surat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-sky hover:underline pt-1"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Column 4: Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-concrete-900 dark:text-white">
              Customer Support
            </h4>
            <div className="space-y-2.5 text-xs text-concrete-600 dark:text-zinc-400">
              <p>For order queries, modifications, or corporate catering inquiries:</p>
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-brand-sky flex-shrink-0" />
                  <a href="tel:+919727042420" className="hover:text-brand-sky font-mono font-semibold transition">
                    +91 97270 42420
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-brand-sky flex-shrink-0" />
                  <a href="mailto:care@greydotcoffee.com" className="hover:text-brand-sky transition">
                    care@greydotcoffee.com
                  </a>
                </div>
              </div>
              <div className="pt-2">
                <span className="text-[10px] uppercase font-bold text-concrete-500 dark:text-zinc-500 block">
                  Payment Notice
                </span>
                <p className="text-[11px] text-concrete-500 dark:text-zinc-400">
                  No online payment collected on website. Pay securely at the drive-thru window.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="mt-12 pt-6 border-t border-concrete-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-concrete-500 dark:text-zinc-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Grey Dot. Coffee Shop Surat. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>100% Pure Veg Cafe</span>
            <span>•</span>
            <span>Specialty Arabica</span>
            <span>•</span>
            <span>Lane 1 Express KDS</span>
          </div>
        </div>

      </div>

    </footer>
  );
};
