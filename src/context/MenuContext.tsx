'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MenuItem } from '@/types';
import { MENU_ITEMS as DEFAULT_MENU_ITEMS } from '@/lib/menuData';
import { 
  saveMenuToFirestore, 
  fetchMenuFromFirestore, 
  subscribeToMenu 
} from '@/lib/firebase';

interface MenuContextType {
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => MenuItem;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  resetMenuToDefault: () => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(DEFAULT_MENU_ITEMS);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // 1. Initial Load from LocalStorage & Setup BroadcastChannel
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedMenu = localStorage.getItem('greydot-menu-items');
      if (savedMenu) {
        const parsed = JSON.parse(savedMenu);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMenuItems(parsed);
        }
      }
    } catch (e) {
      console.debug('Error reading local menu storage', e);
    }

    // Set up BroadcastChannel for instant sub-millisecond tab-to-tab sync
    try {
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel('greydot_menu_sync');
        broadcastChannelRef.current = bc;

        bc.onmessage = (event) => {
          if (!event.data) return;
          if (event.data.type === 'SYNC_MENU' && Array.isArray(event.data.menuItems)) {
            setMenuItems(event.data.menuItems);
            try {
              localStorage.setItem('greydot-menu-items', JSON.stringify(event.data.menuItems));
            } catch (e) {
              console.debug('Error writing local menu storage', e);
            }
          }
        };
      }
    } catch (e) {
      console.debug('BroadcastChannel not supported', e);
    }

    // 2. Cloud Firestore Real-Time Synchronization Listener
    const unsubscribe = subscribeToMenu((cloudItems) => {
      if (cloudItems && Array.isArray(cloudItems) && cloudItems.length > 0) {
        setMenuItems(cloudItems);
        try {
          localStorage.setItem('greydot-menu-items', JSON.stringify(cloudItems));
        } catch (e) {
          console.debug('Error updating local menu cache from cloud', e);
        }
      }
    });

    return () => {
      unsubscribe();
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, []);

  // Helper to persist and broadcast menu updates
  const syncMenu = (newItems: MenuItem[]) => {
    setMenuItems(newItems);

    // 1. LocalStorage for immediate persistence
    try {
      localStorage.setItem('greydot-menu-items', JSON.stringify(newItems));
    } catch (e) {
      console.debug('Error saving menu to local storage', e);
    }

    // 2. BroadcastChannel for instant local cross-tab sync
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({
          type: 'SYNC_MENU',
          menuItems: newItems,
        });
      } catch (e) {
        console.debug('Broadcast message error', e);
      }
    }

    // 3. Cloud Firestore REST for cross-device sync
    saveMenuToFirestore(newItems);
  };

  // Add a new menu item
  const addMenuItem = (itemData: Omit<MenuItem, 'id'>): MenuItem => {
    const newItem: MenuItem = {
      ...itemData,
      id: `gd-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    };

    const updated = [newItem, ...menuItems];
    syncMenu(updated);
    return newItem;
  };

  // Edit existing menu item
  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    const updated = menuItems.map(item => {
      if (item.id === id) {
        return { ...item, ...updates };
      }
      return item;
    });
    syncMenu(updated);
  };

  // Remove menu item
  const deleteMenuItem = (id: string) => {
    const updated = menuItems.filter(item => item.id !== id);
    syncMenu(updated);
  };

  // Reset to signature menu
  const resetMenuToDefault = () => {
    syncMenu(DEFAULT_MENU_ITEMS);
  };

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        resetMenuToDefault,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
