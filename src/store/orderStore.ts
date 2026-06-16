import { create } from 'zustand';
import type { Order, DiamondPackage, AppType, PaymentMethod } from '@/types';
import { generateOrderId } from './data';

interface OrderState {
  orders: Order[];
  currentOrder: Partial<Order> | null;
  selectedApp: AppType | null;
  selectedPackage: DiamondPackage | null;
  setSelectedApp: (app: AppType) => void;
  setSelectedPackage: (pkg: DiamondPackage) => void;
  createOrder: (userId: string, paymentMethod: PaymentMethod, email?: string, phone?: string) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  selectedApp: null,
  selectedPackage: null,
  setSelectedApp: (app) => set({ selectedApp: app, selectedPackage: null }),
  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
  createOrder: (userId, paymentMethod, email, phone) => {
    const { selectedApp, selectedPackage } = get();
    if (!selectedApp || !selectedPackage) throw new Error('No app or package selected');
    const order: Order = {
      id: generateOrderId(),
      app: selectedApp,
      package: selectedPackage,
      userId,
      paymentMethod,
      status: 'pending',
      createdAt: new Date(),
      customerEmail: email,
      customerPhone: phone,
    };
    set((state) => ({ orders: [...state.orders, order], currentOrder: order }));
    return order;
  },
  updateOrderStatus: (orderId, status) => {
    set((state) => ({ orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)) }));
  },
  getOrderById: (orderId) => get().orders.find((o) => o.id === orderId),
}));
