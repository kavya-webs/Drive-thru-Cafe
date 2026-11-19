import { Order, OrderStatus, MenuItem } from '@/types';

const FIRESTORE_BASE_URL = 'https://firestore.googleapis.com/v1/projects/greydot-cafe-surat/databases/(default)/documents';

// Helper to convert Firestore REST fields format to Order
function parseFirestoreDoc(doc: any): Order {
  const f = doc.fields || {};
  return {
    id: f.id?.stringValue || doc.name.split('/').pop(),
    token: f.token?.stringValue || '',
    customerName: f.customerName?.stringValue || '',
    customerPhone: f.customerPhone?.stringValue || '',
    customerEmail: f.customerEmail?.stringValue || '',
    carType: f.carType?.stringValue || '',
    carPlate: f.carPlate?.stringValue || '',
    items: f.itemsJson?.stringValue ? JSON.parse(f.itemsJson.stringValue) : [],
    subtotal: f.subtotal?.doubleValue ?? Number(f.subtotal?.integerValue || 0),
    tax: f.tax?.doubleValue ?? Number(f.tax?.integerValue || 0),
    total: f.total?.doubleValue ?? Number(f.total?.integerValue || 0),
    status: (f.status?.stringValue || 'incoming') as OrderStatus,
    createdAt: f.createdAt?.stringValue || '',
    paymentMode: (f.paymentMode?.stringValue || 'pay_at_window') as any,
    distanceKm: f.distanceKm?.doubleValue ?? Number(f.distanceKm?.integerValue || 0.6),
  };
}

// Fetch all orders from Cloud Firestore via REST
export async function fetchOrdersFromFirestore(): Promise<Order[]> {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/orders`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (!res.ok) {
      if (res.status === 404) return [];
      console.warn('Firestore fetch failed status:', res.status);
      return [];
    }
    const data = await res.json();
    if (!data.documents || !Array.isArray(data.documents)) {
      return [];
    }
    const orders = data.documents.map(parseFirestoreDoc);
    // Sort newest first
    orders.sort((a: Order, b: Order) => {
      return b.id.localeCompare(a.id);
    });
    return orders;
  } catch (err) {
    console.error('Error fetching orders from Firestore REST:', err);
    return [];
  }
}

// Save order to Cloud Firestore via REST
export async function saveOrderToFirestore(order: Order): Promise<void> {
  try {
    const body = {
      fields: {
        id: { stringValue: order.id },
        token: { stringValue: order.token },
        customerName: { stringValue: order.customerName },
        customerPhone: { stringValue: order.customerPhone },
        customerEmail: { stringValue: order.customerEmail },
        carType: { stringValue: order.carType || '' },
        carPlate: { stringValue: order.carPlate || '' },
        subtotal: { doubleValue: order.subtotal },
        tax: { doubleValue: order.tax },
        total: { doubleValue: order.total },
        status: { stringValue: order.status },
        createdAt: { stringValue: order.createdAt },
        paymentMode: { stringValue: order.paymentMode },
        distanceKm: { doubleValue: order.distanceKm },
        itemsJson: { stringValue: JSON.stringify(order.items) },
        timestamp: { integerValue: String(Date.now()) }
      }
    };

    const res = await fetch(`${FIRESTORE_BASE_URL}/orders?documentId=${encodeURIComponent(order.id)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      console.error('Failed to save order to Firestore REST:', res.status, await res.text());
    }
  } catch (error) {
    console.error('Error saving order to Firestore REST:', error);
  }
}

// Update order status in Cloud Firestore via REST
export async function updateOrderStatusInFirestore(orderId: string, status: OrderStatus): Promise<void> {
  try {
    const body = {
      fields: {
        status: { stringValue: status },
        timestamp: { integerValue: String(Date.now()) }
      }
    };

    await fetch(`${FIRESTORE_BASE_URL}/orders/${encodeURIComponent(orderId)}?updateMask.fieldPaths=status&updateMask.fieldPaths=timestamp`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (error) {
    console.error('Error updating order status in Firestore REST:', error);
  }
}

// Real-time synchronization polling (ultra lightweight, 2.5s interval)
export function subscribeToOrders(
  onOrdersUpdated: (orders: Order[]) => void
): () => void {
  let isMounted = true;

  const poll = async () => {
    if (!isMounted) return;
    const orders = await fetchOrdersFromFirestore();
    if (isMounted) {
      onOrdersUpdated(orders);
    }
  };

  // Immediate initial fetch
  poll();

  // 2.5s heartbeat
  const intervalId = setInterval(poll, 2500);

  return () => {
    isMounted = false;
    clearInterval(intervalId);
  };
}

// Clear all orders from Firestore
export async function clearAllOrdersFromFirestore(): Promise<void> {
  try {
    const orders = await fetchOrdersFromFirestore();
    await Promise.all(
      orders.map(order => 
        fetch(`${FIRESTORE_BASE_URL}/orders/${encodeURIComponent(order.id)}`, {
          method: 'DELETE'
        })
      )
    );
  } catch (error) {
    console.error('Error clearing orders from Firestore REST:', error);
  }
}

// Fetch menu items from Cloud Firestore via REST
export async function fetchMenuFromFirestore(): Promise<MenuItem[] | null> {
  try {
    const res = await fetch(`${FIRESTORE_BASE_URL}/settings/menu`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      cache: 'no-store'
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      return null;
    }
    const data = await res.json();
    const itemsJson = data.fields?.itemsJson?.stringValue;
    if (itemsJson) {
      return JSON.parse(itemsJson) as MenuItem[];
    }
    return null;
  } catch (err) {
    console.error('Error fetching menu from Firestore REST:', err);
    return null;
  }
}

// Save menu items to Cloud Firestore via REST
export async function saveMenuToFirestore(items: MenuItem[]): Promise<void> {
  try {
    const body = {
      fields: {
        itemsJson: { stringValue: JSON.stringify(items) },
        updatedAt: { stringValue: new Date().toISOString() },
        timestamp: { integerValue: String(Date.now()) }
      }
    };

    await fetch(`${FIRESTORE_BASE_URL}/settings/menu`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
  } catch (error) {
    console.error('Error saving menu to Firestore REST:', error);
  }
}

// Subscribe to real-time menu updates
export function subscribeToMenu(onMenuUpdated: (items: MenuItem[]) => void): () => void {
  let isMounted = true;

  const poll = async () => {
    if (!isMounted) return;
    const items = await fetchMenuFromFirestore();
    if (isMounted && items && Array.isArray(items)) {
      onMenuUpdated(items);
    }
  };

  poll();
  const intervalId = setInterval(poll, 3000);

  return () => {
    isMounted = false;
    clearInterval(intervalId);
  };
}
