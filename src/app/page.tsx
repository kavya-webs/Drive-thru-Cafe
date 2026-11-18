'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { MenuSection } from '@/components/MenuSection';
import { CartDrawer } from '@/components/CartDrawer';
import { AuthModal } from '@/components/AuthModal';
import { SuccessOverlay } from '@/components/SuccessOverlay';
import { LiveTokenView } from '@/components/LiveTokenView';
import { BaristaKDS } from '@/components/BaristaKDS';
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
    <div className="min-h-screen flex flex-col bg-concrete-100 dark:bg-noir-base text-concrete-900 dark:text-zinc-100 transition-colors">
      
      {/* Customer Header Navigation (Only Menu & Live Token + Sign In trigger) */}
      <Header
        currentView={currentView}
        onNavigate={view => setCurrentView(view)}
        onOpenAuth={() => setIsAuthOpen(true)}
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

    </div>
  );
}
