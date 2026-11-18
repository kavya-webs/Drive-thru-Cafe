'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem } from '@/types';
import { MENU_ITEMS } from '@/lib/menuData';

interface CartContextType {
  cart: CartItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addToCart: (item: MenuItem, quantity?: number, specialInstructions?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, change: number) => void;
  clearCart: () => void;
  subtotal: number;
  tax: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);

  const addToCart = (item: MenuItem, quantity = 1, specialInstructions?: string) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.item.id === item.id);
      if (existing) {
        return prev.map(ci =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      }
      return [...prev, { item, quantity, specialInstructions }];
    });
    openDrawer();
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(ci => ci.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, change: number) => {
    setCart(prev => {
      return prev
        .map(ci => {
          if (ci.item.id === itemId) {
            const nextQty = ci.quantity + change;
            return nextQty > 0 ? { ...ci, quantity: nextQty } : null;
          }
          return ci;
        })
        .filter((ci): ci is CartItem => ci !== null);
    });
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);
  const tax = Number((subtotal * 0.05).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));
  const itemCount = cart.reduce((acc, ci) => acc + ci.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        tax,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
