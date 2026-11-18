'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CustomerUser, Order, OrderStatus } from '@/types';
import { playChimeSound, playReadyAlert } from '@/lib/audio';

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
  createOrder: (
    vehicleData: { carType?: string; carPlate?: string },
    cartItems?: { id: string; name: string; price: number; quantity: number; image: string }[],
    pricing?: { subtotal: number; tax: number; total: number }
  ) => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  simulateIncomingOrder: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Initial sample queue tickets for Barista KDS demonstration
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
      { id: 'gd-hazelnut-frappe', name: 'Hazelnut Crunch Frappe', price: 219, quantity: 2, image: '/images/hazelnut_frappe.jpg' },
      { id: 'gd-peri-peri-fries', name: 'Peri-Peri Cheese Fries', price: 149, quantity: 1, image: '/images/peri_peri_fries.jpg' },
    ],
    subtotal: 587,
    tax: 29.35,
    total: 616.35,
    status: 'incoming',
    createdAt: 'Just now',
  },
];

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [orders, setOrders] = useState<Order[]>(INITIAL_DEMO_ORDERS);
  const [activeOrder, setActiveOrder] = useState<Order | null>(INITIAL_DEMO_ORDERS[1]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Load saved session if exists
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('greydot-user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      const savedAdmin = localStorage.getItem('greydot-admin');
      if (savedAdmin === 'true') setIsAdminLoggedIn(true);
    } catch (e) {
      console.debug('Error reading local storage', e);
    }
  }, []);

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
