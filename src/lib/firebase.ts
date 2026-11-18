import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc,
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { Order, OrderStatus } from '@/types';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDcBa5e7NetB1_N8SstMIE9yqzQxiuVhmo",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "greydot-cafe-surat.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "greydot-cafe-surat",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "greydot-cafe-surat.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "170925969087",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:170925969087:web:c1b0c6059492cc0aa7400a"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);

// Save or create an order in Firestore
export async function saveOrderToFirestore(order: Order): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', order.id);
    await setDoc(orderRef, {
      ...order,
      updatedAt: Date.now(),
    }, { merge: true });
  } catch (error) {
    console.error('Error saving order to Firestore:', error);
  }
}

// Update order status in Firestore
export async function updateOrderStatusInFirestore(orderId: string, status: OrderStatus): Promise<void> {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Error updating order in Firestore:', error);
  }
}

// Subscribe to all orders in real time
export function subscribeToOrders(
  onOrdersUpdated: (orders: Order[]) => void
): () => void {
  try {
    const ordersCol = collection(db, 'orders');
    // Order by createdAt timestamp descending so newest orders arrive first
    const q = query(ordersCol);

    return onSnapshot(q, (snapshot) => {
      const ordersList: Order[] = [];
      snapshot.forEach((docSnapshot) => {
        ordersList.push(docSnapshot.data() as Order);
      });
      // Sort in-memory by createdAt descending
      ordersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      onOrdersUpdated(ordersList);
    }, (error) => {
      console.error('Firestore onSnapshot orders error:', error);
    });
  } catch (e) {
    console.error('Failed to subscribe to orders:', e);
    return () => {};
  }
}

// Clear all completed/cancelled orders or reset queue
export async function clearAllOrdersFromFirestore(): Promise<void> {
  try {
    const ordersCol = collection(db, 'orders');
    const snapshot = await getDocs(ordersCol);
    const deletePromises = snapshot.docs.map(docSnap => deleteDoc(doc(db, 'orders', docSnap.id)));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Error clearing orders from Firestore:', error);
  }
}
