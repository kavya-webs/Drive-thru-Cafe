export type CategoryId = 'all' | 'cold' | 'hot' | 'shakes' | 'pizza' | 'pasta' | 'bites';

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  description: string;
  image: string;
  badge?: string;
  badgeType?: 'bestseller' | 'signature' | 'spicy' | 'veg';
  isVeg: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export type OrderStatus = 'incoming' | 'brewing' | 'ready' | 'dispatched';

export interface Order {
  id: string;
  token: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  carType?: string;
  carPlate?: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
}

export interface CustomerUser {
  name: string;
  phone: string;
  email: string;
}
