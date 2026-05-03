export enum Screen {
  LANDING = 'LANDING',
  LOCATION_SELECTION = 'LOCATION_SELECTION',
  TABLE_SELECTION = 'TABLE_SELECTION',
  GUEST_SELECTION = 'GUEST_SELECTION',
  MENU = 'MENU',
  CHEF_LOGIN = 'CHEF_LOGIN',
  KITCHEN_DASHBOARD = 'KITCHEN_DASHBOARD',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export enum MenuCategory {
  ALL = 'TODOS',
  STARTERS = 'ENTRANTES',
  MAINS = 'PRIMEROS',
  SECONDS = 'SEGUNDOS',
  DRINKS = 'BEBIDAS',
  DESSERTS = 'POSTRES'
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  outOfStock?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export enum OrderStatus {
  PENDING = 'PENDIENTE',
  IN_PROGRESS = 'COCINANDO',
  READY = 'LISTO',
  COMPLETED = 'COMPLETADO'
}

export interface BillRequest {
  id: string;
  table: string;
  tableNumber: string;
  location: string;
  timestamp: number;
  status: 'PENDING' | 'COMPLETED';
  total: number;
}

export interface Order {
  id: string;
  table: string;        // Display string (e.g. "DENTRO 01")
  tableNumber: string;  // Just the number (e.g. "01")
  location: string;     // Just the location (e.g. "DENTRO")
  guestCount: number;   // Number of guests
  items: CartItem[];
  status: OrderStatus;
  timestamp: number;    // Creation time
  acceptedTimestamp?: number; // Kitchen acceptance time
  completedTimestamp?: number; // Kitchen completion time
  total: number;
  paid?: boolean;
}