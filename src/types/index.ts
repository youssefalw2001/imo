export interface DiamondPackage {
  id: string;
  app: AppType;
  diamonds: number;
  price: number;
  originalPrice: number;
  discount: number;
  popular?: boolean;
  bestValue?: boolean;
}
export type AppType = 'imo' | 'bigo' | 'likee' | 'tiktok' | 'yalla';
export interface AppInfo {
  id: AppType;
  name: string;
  nameAr: string;
  icon: string;
  color: string;
  packages: DiamondPackage[];
}
export interface Order {
  id: string;
  app: AppType;
  package: DiamondPackage;
  userId: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: Date;
  customerEmail?: string;
  customerPhone?: string;
}
export type PaymentMethod = 'usdt_trc20' | 'usdt_erc20' | 'paypal' | 'card' | 'stc_pay' | 'vodafone_cash';
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'delivered' | 'failed';
export interface PaymentInfo {
  method: PaymentMethod;
  label: string;
  labelAr: string;
  icon: string;
  address?: string;
  instructionsAr?: string;
}
