import { describe, it, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { useOrderStore } from '@/store/orderStore';
import { apps, generateOrderId } from '@/store/data';

describe('Order Store', () => {
  beforeEach(() => { useOrderStore.setState({ orders: [], selectedApp: null, selectedPackage: null, currentOrder: null }); });
  it('should select an app', () => { useOrderStore.getState().setSelectedApp('imo'); expect(useOrderStore.getState().selectedApp).toBe('imo'); });
  it('should select a package', () => { const pkg = apps[0]!.packages[0]!; useOrderStore.getState().setSelectedPackage(pkg); expect(useOrderStore.getState().selectedPackage).toBe(pkg); });
  it('should create an order', () => {
    useOrderStore.getState().setSelectedApp('imo');
    useOrderStore.getState().setSelectedPackage(apps[0]!.packages[0]!);
    const order = useOrderStore.getState().createOrder('123456789', 'usdt_trc20', 'test@email.com');
    expect(order.id).toMatch(/^ORD-/);
    expect(order.app).toBe('imo');
    expect(order.status).toBe('pending');
  });
  it('should throw without selection', () => { expect(() => useOrderStore.getState().createOrder('123', 'usdt_trc20')).toThrow(); });
  it('should update status', () => {
    useOrderStore.getState().setSelectedApp('imo');
    useOrderStore.getState().setSelectedPackage(apps[0]!.packages[0]!);
    const order = useOrderStore.getState().createOrder('123', 'paypal');
    useOrderStore.getState().updateOrderStatus(order.id, 'delivered');
    expect(useOrderStore.getState().getOrderById(order.id)?.status).toBe('delivered');
  });
});

describe('Order ID - Property Tests', () => {
  it('generates unique IDs', () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 500 }), (n) => {
      const ids = new Set<string>();
      for (let i = 0; i < n; i++) ids.add(generateOrderId());
      expect(ids.size).toBeGreaterThanOrEqual(Math.floor(n * 0.99));
    }));
  });
  it('starts with ORD-', () => { fc.assert(fc.property(fc.constant(null), () => { expect(generateOrderId()).toMatch(/^ORD-/); }), { numRuns: 100 }); });
  it('has correct format', () => { fc.assert(fc.property(fc.constant(null), () => { const parts = generateOrderId().split('-'); expect(parts.length).toBe(3); expect(parts[1]).toMatch(/^[A-Z0-9]+$/); expect(parts[2]).toMatch(/^[A-Z0-9]+$/); }), { numRuns: 100 }); });
});

describe('Package Data - Property Tests', () => {
  it('price < originalPrice', () => { for (const app of apps) for (const pkg of app.packages) expect(pkg.price).toBeLessThan(pkg.originalPrice); });
  it('positive diamonds', () => { for (const app of apps) for (const pkg of app.packages) expect(pkg.diamonds).toBeGreaterThan(0); });
  it('discount matches', () => { for (const app of apps) for (const pkg of app.packages) { const calc = Math.round((1 - pkg.price / pkg.originalPrice) * 100); expect(Math.abs(calc - pkg.discount)).toBeLessThanOrEqual(2); } });
});
