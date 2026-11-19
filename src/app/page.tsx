'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { MenuSection } from '@/components/MenuSection';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthModal } from '@/components/AuthModal';
import { SuccessOverlay } from '@/components/SuccessOverlay';
import { LiveTokenView } from '@/components/LiveTokenView';
import { BaristaKDS } from '@/components/BaristaKDS';
import { Footer } from '@/components/Footer';
import { BottomNav } from '@/components/BottomNav';
import { useOrders } from '@/context/OrderContext';

export default function HomePage() {
  const { isAdminLoggedIn, logoutAdmin } = useOrders();
  const [currentView, setCurrentView] = useState<'menu' | 'track'>('menu');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [pendingVehicle, setPendingVehicle] = useState<{ carType?: string; carPlate?: string } | undefined>();

  // =========================================================================
  // REQUIREMENT: If user signs in with admin credentials, they see the
  // Barista screen ONLY. No customer header, no menu, no cart, no other screens.
  // =========================================================================
  if (isAdminLoggedIn) {
    return <BaristaKDS onLogout={logoutAdmin} />;
  }

  // =========================================================================
  // PUBLIC / CUSTOMER VIEW (Menu browsing without login, auth on order place)
  // =========================================================================
  return (
    <div className="min-h-screen flex flex-col bg-concrete-100 dark:bg-noir-base text-concrete-900 dark:text-zinc-100 transition-colors pb-16 sm:pb-20">
      
      {/* Spacious Top Header: Logo on left, User Utilities & Cart on right */}
      <Header
        onOpenAuth={() => setIsAuthOpen(true)}
        onNavigateHome={() => setCurrentView('menu')}
      />

      {/* Customer Main Screen Views */}
      <main className="flex-1">
        {currentView === 'menu' && <MenuSection />}

        {currentView === 'track' && (
          <LiveTokenView onNavigateToMenu={() => setCurrentView('menu')} />
        )}
      </main>

      {/* Drive-thru Cart Drawer with Optional Vehicle Details */}
      <CartDrawer
        onTriggerAuth={(vehicleData) => {
          setPendingVehicle(vehicleData);
          setIsAuthOpen(true);
        }}
      />

      {/* Unified Authentication Modal (Customer Sign In & Staff/Barista Portal) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        pendingVehicleData={pendingVehicle}
      />

      {/* Confetti & Transmitted to Counter Success Overlay */}
      <SuccessOverlay onGoToTrack={() => setCurrentView('track')} />

      {/* Customer Care, Drive-thru Guide & Location Footer */}
      <Footer />

      {/* Dedicated Bottom Navigation Bar: Menu & Live Token Tabs */}
      <BottomNav
        currentView={currentView}
        onNavigate={view => setCurrentView(view)}
      />

    </div>
  );
}
