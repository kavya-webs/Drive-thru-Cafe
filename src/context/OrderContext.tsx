'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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
  createOrder: (
    vehicleData: { carType?: string; carPlate?: string },
    cartItems?: { id: string; name: string; price: number; quantity: number; image: string }[],
    pricing?: { subtotal: number; tax: number; total: number }
  ) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  simulateIncomingOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Initial sample queue tickets for Barista KDS demonstration (All Physical Pay-at-Window)
const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-101',
    token: 'GD-41',
    customerName: 'Hardik S.',
    customerPhone: '+91 99042 11223',
    customerEmail: 'hardik@gmail.com',
    carType: '',
    carPlate: '',
    items: [
      { id: 'gd-spanish-latte', name: 'Spanish Condensed Milk Latte', price: 169, quantity: 1, image: '/images/spanish_latte.jpg' },
      { id: 'gd-blueberry-shake', name: 'Blueberry Cheesecake Thick Shake', price: 199, quantity: 1, image: '/images/blueberry_shake.jpg' },
    ],
    subtotal: 368,
    tax: 18.40,
    total: 386.40,
    status: 'ready',
    createdAt: '12:30 PM',
    paymentMode: 'pay_at_window',
    distanceKm: 0.4,
  },
  {
    id: 'ord-102',
    token: 'GD-42',
    customerName: 'Kavya Patel',
    customerPhone: '+91 97244 08033',
    customerEmail: 'kavya@example.com',
    carType: 'White Creta',
    carPlate: 'GJ-05-AB-1234',
    items: [
      { id: 'gd-cold-brew', name: 'Grey Dot Classic Cold Coffee', price: 179, quantity: 1, image: '/images/cold_coffee.jpg' },
      { id: 'gd-margherita-pizza', name: 'Classic Margherita Pizza (8")', price: 249, quantity: 1, image: '/images/margherita_pizza.jpg' },
    ],
    subtotal: 428,
    tax: 21.40,
    total: 449.40,
    status: 'brewing',
    createdAt: '12:35 PM',
    paymentMode: 'pay_at_window',
    distanceKm: 0.8,
  },
  {
    id: 'ord-103',
    token: 'GD-43',
    customerName: 'Vikram M.',
    customerPhone: '+91 99241 88990',
    customerEmail: 'vikram@gmail.com',
    carType: 'Black Thar',
    carPlate: 'GJ-05-CD-9988',
    items: [
      { id: 'gd-peri-peri-fries', name: 'Peri-Peri Cheese Fries', price: 149, quantity: 1, image: '/images/peri_peri_fries.jpg' },
    ],
    subtotal: 149,
    tax: 7.45,
    total: 156.45,
    status: 'incoming',
    createdAt: 'Just now',
    paymentMode: 'pay_at_window',
    distanceKm: 1.2,
  },
];

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [orders, setOrders] = useState<Order[]>(INITIAL_DEMO_ORDERS);
  const [activeOrder, setActiveOrder] = useState<Order | null>(INITIAL_DEMO_ORDERS[1]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Geolocation simulation (Defaults to 0.6 km from Ram Chowk, Surat)
  const [userDistanceKm, setUserDistanceKm] = useState<number>(0.6);

  // Blacklisted phone numbers for repeat no-shows
  const [blacklistedPhones, setBlacklistedPhones] = useState<string[]>([]);

  // Load saved session and blacklist if exists
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('greydot-user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      const savedAdmin = localStorage.getItem('greydot-admin');
      if (savedAdmin === 'true') setIsAdminLoggedIn(true);
      const savedBlacklist = localStorage.getItem('greydot-blacklist');
      if (savedBlacklist) setBlacklistedPhones(JSON.parse(savedBlacklist));
    } catch (e) {
      console.debug('Error reading local storage', e);
    }
  }, []);

  const isPhoneBlacklisted = (phone: string) => {
    const clean = phone.replace(/\D/g, '');
    return blacklistedPhones.some(p => p.replace(/\D/g, '') === clean);
  };

  const markNoShow = (orderId: string) => {
    const orderToFlag = orders.find(o => o.id === orderId);
    if (orderToFlag) {
      const updatedList = Array.from(new Set([...blacklistedPhones, orderToFlag.customerPhone]));
      setBlacklistedPhones(updatedList);
      localStorage.setItem('greydot-blacklist', JSON.stringify(updatedList));

      // Mark order as cancelled
      setOrders(prev =>
        prev.map(ord => (ord.id === orderId ? { ...ord, status: 'cancelled' as OrderStatus } : ord))
      );
    }
  };

  const loginAdmin = (email: string, pass: string) => {
    if (email.trim().toLowerCase() === 'admin@gmail.com' && pass.trim() === 'admin') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('greydot-admin', 'true');
      playChimeSound();
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('greydot-admin');
  };

  const logoutCustomer = () => {
    setCurrentUser(null);
    localStorage.removeItem('greydot-user');
  };

  const closeSuccessModal = () => setShowSuccessModal(false);

  const createOrder = (
    vehicleData: { carType?: string; carPlate?: string },
    cartItems?: { id: string; name: string; price: number; quantity: number; image: string }[],
    pricing?: { subtotal: number; tax: number; total: number }
  ): Order | null => {
    if (!currentUser) return null;

    // STRICT LOCATION CHECK: Do not accept orders from far (> 3 km)
    if (!isWithinGeofence(userDistanceKm)) {
      alert(`Order blocked: You are currently ${userDistanceKm} km away. Grey Dot only accepts drive-thru orders within 3 km of Ram Chowk, Mota Varachha.`);
      return null;
    }

    const nextTokenNum = 44 + orders.length;
    const token = `GD-${nextTokenNum}`;

    const itemsToUse = cartItems && cartItems.length > 0
      ? cartItems
      : [
          { id: 'gd-cold-brew', name: 'Grey Dot Classic Cold Coffee', price: 179, quantity: 1, image: '/images/cold_coffee.jpg' },
          { id: 'gd-margherita-pizza', name: 'Classic Margherita Pizza (8")', price: 249, quantity: 1, image: '/images/margherita_pizza.jpg' },
        ];

    const subtotal = pricing?.subtotal ?? itemsToUse.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = pricing?.tax ?? Number((subtotal * 0.05).toFixed(2));
    const total = pricing?.total ?? Number((subtotal + tax).toFixed(2));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      token,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      customerEmail: currentUser.email,
      carType: vehicleData.carType?.trim() || '',
      carPlate: vehicleData.carPlate?.trim() || '',
      items: itemsToUse,
      subtotal,
      tax,
      total,
      status: 'incoming',
      createdAt: 'Just now',
      paymentMode: 'pay_at_window',
      distanceKm: userDistanceKm,
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setShowSuccessModal(true);
    playChimeSound();

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status } : ord))
    );

    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder(prev => (prev ? { ...prev, status } : null));
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
      createdAt: 'Just now',
      paymentMode: 'pay_at_window',
      distanceKm: 0.9,
    };

    setOrders(prev => [randomOrder, ...prev]);
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
