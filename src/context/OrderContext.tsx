'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CustomerUser, Order, OrderStatus } from '@/types';
import { playChimeSound, playReadyAlert } from '@/lib/audio';
import { isWithinGeofence } from '@/lib/geo';

interface OrderContextType {
  currentUser: CustomerUser | null;
  setCurrentUser: (user: CustomerUser | null) => void;
  logoutCustomer: () => void;
  isAdminLoggedIn: boolean;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
  orders: Order[];
  activeOrder: Order | null;
  setActiveOrder: (order: Order | null) => void;
  showSuccessModal: boolean;
  closeSuccessModal: () => void;
  userDistanceKm: number;
  setUserDistanceKm: (km: number) => void;
  blacklistedPhones: string[];
  isPhoneBlacklisted: (phone: string) => boolean;
  markNoShow: (orderId: string) => void;
  clearAllOrders: () => void;
  createOrder: (
    vehicleData: { carType?: string; carPlate?: string },
    cartItems?: { id: string; name: string; price: number; quantity: number; image: string }[],
    pricing?: { subtotal: number; tax: number; total: number },
    userOverride?: CustomerUser
  ) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  simulateIncomingOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Geolocation simulation (Defaults to 0.6 km from Ram Chowk, Surat)
  const [userDistanceKm, setUserDistanceKm] = useState<number>(0.6);

  // Blacklisted phone numbers for repeat no-shows
  const [blacklistedPhones, setBlacklistedPhones] = useState<string[]>([]);

  // Ref to hold broadcast channel
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Load saved session, active orders, and blacklist from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedUser = localStorage.getItem('greydot-user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const savedAdmin = localStorage.getItem('greydot-admin');
      if (savedAdmin === 'true') setIsAdminLoggedIn(true);

      const savedOrders = localStorage.getItem('greydot-orders');
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedActiveOrder = localStorage.getItem('greydot-active-order');
      if (savedActiveOrder) setActiveOrder(JSON.parse(savedActiveOrder));

      const savedBlacklist = localStorage.getItem('greydot-blacklist');
      if (savedBlacklist) setBlacklistedPhones(JSON.parse(savedBlacklist));
    } catch (e) {
      console.debug('Error reading local storage', e);
    }

    // Set up BroadcastChannel for instant cross-tab / cross-window sync
    try {
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel('greydot_order_sync');
        broadcastChannelRef.current = bc;

        bc.onmessage = (event) => {
          if (!event.data) return;
          if (event.data.type === 'SYNC_ORDERS') {
            setOrders(event.data.orders);
            if (event.data.isNewOrder) {
              playChimeSound();
            }
          } else if (event.data.type === 'SYNC_ACTIVE_ORDER') {
            setActiveOrder(event.data.activeOrder);
          }
        };
      }
    } catch (e) {
      console.debug('BroadcastChannel error', e);
    }

    // Also listen to storage events as fallback
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'greydot-orders' && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      }
      if (e.key === 'greydot-active-order' && e.newValue) {
        setActiveOrder(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, []);

  const broadcastOrders = (updatedOrders: Order[], isNewOrder = false) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('greydot-orders', JSON.stringify(updatedOrders));
      try {
        broadcastChannelRef.current?.postMessage({
          type: 'SYNC_ORDERS',
          orders: updatedOrders,
          isNewOrder,
        });
      } catch (e) {
        // Fallback handled by storage event
      }
    }
  };

  const broadcastActiveOrder = (order: Order | null) => {
    if (typeof window !== 'undefined') {
      if (order) {
        localStorage.setItem('greydot-active-order', JSON.stringify(order));
      } else {
        localStorage.removeItem('greydot-active-order');
      }
      try {
        broadcastChannelRef.current?.postMessage({
          type: 'SYNC_ACTIVE_ORDER',
          activeOrder: order,
        });
      } catch (e) {
        // Fallback
      }
    }
  };

  const isPhoneBlacklisted = (phone: string) => {
    const clean = phone.replace(/\D/g, '');
    return blacklistedPhones.some(p => p.replace(/\D/g, '') === clean);
  };

  const markNoShow = (orderId: string) => {
    const orderToFlag = orders.find(o => o.id === orderId);
    if (orderToFlag) {
      const updatedList = Array.from(new Set([...blacklistedPhones, orderToFlag.customerPhone]));
      setBlacklistedPhones(updatedList);
      if (typeof window !== 'undefined') {
        localStorage.setItem('greydot-blacklist', JSON.stringify(updatedList));
      }

      // Mark order as cancelled
      const updated = orders.map(ord =>
        ord.id === orderId ? { ...ord, status: 'cancelled' as OrderStatus } : ord
      );
      setOrders(updated);
      broadcastOrders(updated);
    }
  };

  const clearAllOrders = () => {
    setOrders([]);
    setActiveOrder(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('greydot-orders');
      localStorage.removeItem('greydot-active-order');
    }
    broadcastOrders([]);
    broadcastActiveOrder(null);
  };

  const loginAdmin = (email: string, pass: string) => {
    if (email.trim().toLowerCase() === 'admin@gmail.com' && pass.trim() === 'admin') {
      setIsAdminLoggedIn(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('greydot-admin', 'true');
      }
      playChimeSound();
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('greydot-admin');
    }
  };

  const logoutCustomer = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('greydot-user');
    }
  };

  const closeSuccessModal = () => setShowSuccessModal(false);

  const createOrder = (
    vehicleData: { carType?: string; carPlate?: string },
    cartItems?: { id: string; name: string; price: number; quantity: number; image: string }[],
    pricing?: { subtotal: number; tax: number; total: number },
    userOverride?: CustomerUser
  ): Order | null => {
    // Robust customer resolution: accepts userOverride, currentUser, or localStorage
    let activeCustomer = userOverride || currentUser;
    if (!activeCustomer && typeof window !== 'undefined') {
      const saved = localStorage.getItem('greydot-user');
      if (saved) activeCustomer = JSON.parse(saved);
    }

    if (!activeCustomer) {
      console.error('Cannot create order: Customer not authenticated.');
      return null;
    }

    // STRICT LOCATION CHECK: Do not accept orders from far (> 3 km)
    const currentDist = userDistanceKm ?? 0.6;
    if (!isWithinGeofence(currentDist)) {
      alert(`Order blocked: You are currently ${currentDist} km away. Grey Dot only accepts drive-thru orders within 3 km of Ram Chowk, Mota Varachha.`);
      return null;
    }

    const itemsToUse = cartItems && cartItems.length > 0 ? cartItems : [];
    if (itemsToUse.length === 0) {
      console.error('Cannot create order: Cart is empty.');
      return null;
    }

    const nextTokenNum = 44 + orders.length;
    const token = `GD-${nextTokenNum}`;

    const subtotal = pricing?.subtotal ?? itemsToUse.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = pricing?.tax ?? Number((subtotal * 0.05).toFixed(2));
    const total = pricing?.total ?? Number((subtotal + tax).toFixed(2));

    const now = new Date();
    const createdAtTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      token,
      customerName: activeCustomer.name,
      customerPhone: activeCustomer.phone,
      customerEmail: activeCustomer.email,
      carType: vehicleData.carType?.trim() || '',
      carPlate: vehicleData.carPlate?.trim() || '',
      items: itemsToUse,
      subtotal,
      tax,
      total,
      status: 'incoming',
      createdAt: createdAtTime,
      paymentMode: 'pay_at_window',
      distanceKm: currentDist,
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    setActiveOrder(newOrder);
    setShowSuccessModal(true);
    playChimeSound();

    // Persist and broadcast to other tabs / barista terminals
    broadcastOrders(updatedOrders, true);
    broadcastActiveOrder(newOrder);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updatedOrders = orders.map(ord =>
      ord.id === orderId ? { ...ord, status } : ord
    );
    setOrders(updatedOrders);
    broadcastOrders(updatedOrders);

    if (activeOrder && activeOrder.id === orderId) {
      const updatedActive = { ...activeOrder, status };
      setActiveOrder(updatedActive);
      broadcastActiveOrder(updatedActive);
    }

    if (status === 'ready') {
      playReadyAlert();
    } else {
      playChimeSound();
    }
  };

  const simulateIncomingOrder = () => {
    const token = `GD-${Math.floor(10 + Math.random() * 89)}`;
    const randomOrder: Order = {
      id: `ord-${Date.now()}`,
      token,
      customerName: 'Anand Dave',
      customerPhone: '+91 98980 54321',
      customerEmail: 'anand@gmail.com',
      carType: 'Grey Swift',
      carPlate: 'GJ-05-MM-3344',
      items: [
        { id: 'gd-hazelnut-frappe', name: 'Hazelnut Crunch Frappe', price: 219, quantity: 1, image: '/images/hazelnut_frappe.jpg' },
        { id: 'gd-alfredo-pasta', name: 'Creamy Alfredo Penne Pasta', price: 229, quantity: 1, image: '/images/alfredo_pasta.jpg' },
      ],
      subtotal: 448,
      tax: 22.40,
      total: 470.40,
      status: 'incoming',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentMode: 'pay_at_window',
      distanceKm: 0.9,
    };

    const updatedOrders = [randomOrder, ...orders];
    setOrders(updatedOrders);
    broadcastOrders(updatedOrders, true);
    playChimeSound();
  };

  return (
    <OrderContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        logoutCustomer,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        orders,
        activeOrder,
        setActiveOrder,
        showSuccessModal,
        closeSuccessModal,
        userDistanceKm,
        setUserDistanceKm,
        blacklistedPhones,
        isPhoneBlacklisted,
        markNoShow,
        clearAllOrders,
        createOrder,
        updateOrderStatus,
        simulateIncomingOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
}
