import type { AppInfo, PaymentInfo } from '@/types';

export const apps: AppInfo[] = [
  {
    id: 'imo', name: 'IMO', nameAr: 'ايمو', icon: '\u{1F4AC}', color: '#00b4d8',
    packages: [
      { id: 'imo-100', app: 'imo', diamonds: 100, price: 1.5, originalPrice: 3.14, discount: 52 },
      { id: 'imo-500', app: 'imo', diamonds: 500, price: 7.0, originalPrice: 15.7, discount: 55, popular: true },
      { id: 'imo-1000', app: 'imo', diamonds: 1000, price: 13.0, originalPrice: 31.4, discount: 59 },
      { id: 'imo-5000', app: 'imo', diamonds: 5000, price: 60.0, originalPrice: 157.0, discount: 62, bestValue: true },
      { id: 'imo-8400', app: 'imo', diamonds: 8400, price: 99.0, originalPrice: 263.76, discount: 62 },
      { id: 'imo-41700', app: 'imo', diamonds: 41700, price: 480.0, originalPrice: 800.0, discount: 40 },
    ],
  },
  {
    id: 'bigo', name: 'Bigo Live', nameAr: '\u0628\u064A\u0642\u0648 \u0644\u0627\u064A\u0641', icon: '\u{1F3AC}', color: '#ff4757',
    packages: [
      { id: 'bigo-100', app: 'bigo', diamonds: 100, price: 1.5, originalPrice: 3.14, discount: 52 },
      { id: 'bigo-500', app: 'bigo', diamonds: 500, price: 7.0, originalPrice: 15.7, discount: 55, popular: true },
      { id: 'bigo-1000', app: 'bigo', diamonds: 1000, price: 13.0, originalPrice: 31.4, discount: 59 },
      { id: 'bigo-5000', app: 'bigo', diamonds: 5000, price: 60.0, originalPrice: 157.0, discount: 62, bestValue: true },
      { id: 'bigo-10000', app: 'bigo', diamonds: 10000, price: 110.0, originalPrice: 314.0, discount: 65 },
    ],
  },
  {
    id: 'likee', name: 'Likee', nameAr: '\u0644\u0627\u064A\u0643\u064A', icon: '\u2764\uFE0F', color: '#e91e63',
    packages: [
      { id: 'likee-100', app: 'likee', diamonds: 100, price: 1.2, originalPrice: 2.5, discount: 52 },
      { id: 'likee-500', app: 'likee', diamonds: 500, price: 5.5, originalPrice: 12.5, discount: 56, popular: true },
      { id: 'likee-1000', app: 'likee', diamonds: 1000, price: 10.0, originalPrice: 25.0, discount: 60, bestValue: true },
      { id: 'likee-5000', app: 'likee', diamonds: 5000, price: 45.0, originalPrice: 125.0, discount: 64 },
    ],
  },
  {
    id: 'tiktok', name: 'TikTok', nameAr: '\u062A\u064A\u0643 \u062A\u0648\u0643', icon: '\u{1F3B5}', color: '#00f2ea',
    packages: [
      { id: 'tiktok-100', app: 'tiktok', diamonds: 100, price: 1.3, originalPrice: 2.8, discount: 54 },
      { id: 'tiktok-500', app: 'tiktok', diamonds: 500, price: 6.0, originalPrice: 14.0, discount: 57, popular: true },
      { id: 'tiktok-1000', app: 'tiktok', diamonds: 1000, price: 11.0, originalPrice: 28.0, discount: 61, bestValue: true },
      { id: 'tiktok-5000', app: 'tiktok', diamonds: 5000, price: 50.0, originalPrice: 140.0, discount: 64 },
    ],
  },
  {
    id: 'yalla', name: 'Yalla Live', nameAr: '\u064A\u0644\u0627 \u0644\u0627\u064A\u0641', icon: '\u{1F3A4}', color: '#ff6b35',
    packages: [
      { id: 'yalla-100', app: 'yalla', diamonds: 100, price: 1.4, originalPrice: 3.0, discount: 53 },
      { id: 'yalla-500', app: 'yalla', diamonds: 500, price: 6.5, originalPrice: 15.0, discount: 57, popular: true },
      { id: 'yalla-1000', app: 'yalla', diamonds: 1000, price: 12.0, originalPrice: 30.0, discount: 60, bestValue: true },
      { id: 'yalla-5000', app: 'yalla', diamonds: 5000, price: 55.0, originalPrice: 150.0, discount: 63 },
    ],
  },
];

export const paymentMethods: PaymentInfo[] = [
  { method: 'usdt_trc20', label: 'USDT (TRC20)', labelAr: 'USDT (TRC20)', icon: '\u{1F4B0}', address: 'TYourTRC20AddressHere', instructionsAr: '\u0623\u0631\u0633\u0644 \u0627\u0644\u0645\u0628\u0644\u063A \u0625\u0644\u0649 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0623\u0639\u0644\u0627\u0647 \u062B\u0645 \u0623\u0631\u0633\u0644 \u0635\u0648\u0631\u0629 \u0627\u0644\u062A\u062D\u0648\u064A\u0644' },
  { method: 'usdt_erc20', label: 'USDT (ERC20)', labelAr: 'USDT (ERC20)', icon: '\u{1F48E}', address: '0xYourERC20AddressHere', instructionsAr: '\u0623\u0631\u0633\u0644 \u0627\u0644\u0645\u0628\u0644\u063A \u0625\u0644\u0649 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0623\u0639\u0644\u0627\u0647 \u062B\u0645 \u0623\u0631\u0633\u0644 \u0635\u0648\u0631\u0629 \u0627\u0644\u062A\u062D\u0648\u064A\u0644' },
  { method: 'paypal', label: 'PayPal', labelAr: '\u0628\u0627\u064A \u0628\u0627\u0644', icon: '\u{1F17F}\uFE0F', address: 'your@paypal.com', instructionsAr: '\u0623\u0631\u0633\u0644 \u0627\u0644\u0645\u0628\u0644\u063A \u0643\u0623\u0635\u062F\u0642\u0627\u0621 \u0648\u0639\u0627\u0626\u0644\u0629' },
  { method: 'stc_pay', label: 'STC Pay', labelAr: '\u0627\u0633 \u062A\u064A \u0633\u064A \u0628\u0627\u064A', icon: '\u{1F4F1}', address: '+966XXXXXXXXX', instructionsAr: '\u062D\u0648\u0651\u0644 \u0627\u0644\u0645\u0628\u0644\u063A \u0639\u0628\u0631 STC Pay' },
  { method: 'vodafone_cash', label: 'Vodafone Cash', labelAr: '\u0641\u0648\u062F\u0627\u0641\u0648\u0646 \u0643\u0627\u0634', icon: '\u{1F4F2}', address: '01XXXXXXXXX', instructionsAr: '\u062D\u0648\u0651\u0644 \u0627\u0644\u0645\u0628\u0644\u063A \u0639\u0628\u0631 \u0641\u0648\u062F\u0627\u0641\u0648\u0646 \u0643\u0627\u0634' },
];

export function generateOrderId(): string {
  return `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}
