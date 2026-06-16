/**
 * Diamond Auto-Fulfillment Engine
 * 
 * Automates diamond purchases from Bangladesh Codashop at regional pricing.
 * Uses Puppeteer to navigate the purchase flow programmatically.
 * 
 * Flow:
 * 1. Receive order (app, userId, diamond amount)
 * 2. Navigate to Codashop BD for that app
 * 3. Enter customer's user ID
 * 4. Select matching diamond package
 * 5. Process payment via pre-loaded bKash/BD method
 * 6. Confirm delivery
 * 
 * Requirements:
 * - Chrome/Chromium installed on server
 * - BD payment method configured (bKash merchant account or pre-loaded balance)
 * - Environment variables set (see .env.example)
 */

import type { Browser, Page } from 'puppeteer-core';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface FulfillmentOrder {
  orderId: string;
  app: 'imo' | 'bigo' | 'likee' | 'tiktok' | 'yalla';
  userId: string;
  diamonds: number;
  customerEmail?: string;
}

export interface FulfillmentResult {
  success: boolean;
  orderId: string;
  transactionId?: string;
  error?: string;
  screenshotPath?: string;
  timestamp: Date;
}

interface AppConfig {
  codashopUrl: string;
  userIdSelector: string;
  packageSelector: (diamonds: number) => string;
  confirmSelector: string;
  successIndicator: string;
}

// ─── App Configuration ───────────────────────────────────────────────────────

const APP_CONFIGS: Record<string, AppConfig> = {
  imo: {
    codashopUrl: 'https://www.codashop.com/en-bd/imo',
    userIdSelector: 'input[name="userId"], input[placeholder*="ID"], #userId',
    packageSelector: (diamonds: number) => `[data-value="${diamonds}"], [data-denomination="${diamonds}"]`,
    confirmSelector: 'button[type="submit"], .buy-button, #confirm-purchase',
    successIndicator: '.success-message, .order-complete, [class*="success"]',
  },
  bigo: {
    codashopUrl: 'https://www.codashop.com/en-bd/bigo-live',
    userIdSelector: 'input[name="userId"], input[placeholder*="ID"], #userId',
    packageSelector: (diamonds: number) => `[data-value="${diamonds}"], [data-denomination="${diamonds}"]`,
    confirmSelector: 'button[type="submit"], .buy-button, #confirm-purchase',
    successIndicator: '.success-message, .order-complete, [class*="success"]',
  },
  likee: {
    codashopUrl: 'https://www.codashop.com/en-bd/likee',
    userIdSelector: 'input[name="userId"], input[placeholder*="ID"], #userId',
    packageSelector: (diamonds: number) => `[data-value="${diamonds}"], [data-denomination="${diamonds}"]`,
    confirmSelector: 'button[type="submit"], .buy-button, #confirm-purchase',
    successIndicator: '.success-message, .order-complete, [class*="success"]',
  },
  tiktok: {
    codashopUrl: 'https://www.codashop.com/en-bd/tiktok',
    userIdSelector: 'input[name="userId"], input[placeholder*="ID"], #userId',
    packageSelector: (diamonds: number) => `[data-value="${diamonds}"], [data-denomination="${diamonds}"]`,
    confirmSelector: 'button[type="submit"], .buy-button, #confirm-purchase',
    successIndicator: '.success-message, .order-complete, [class*="success"]',
  },
  yalla: {
    codashopUrl: 'https://www.codashop.com/en-bd/yalla-live',
    userIdSelector: 'input[name="userId"], input[placeholder*="ID"], #userId',
    packageSelector: (diamonds: number) => `[data-value="${diamonds}"], [data-denomination="${diamonds}"]`,
    confirmSelector: 'button[type="submit"], .buy-button, #confirm-purchase',
    successIndicator: '.success-message, .order-complete, [class*="success"]',
  },
};

// ─── Browser Manager ─────────────────────────────────────────────────────────

let browserInstance: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (browserInstance) return browserInstance;

  const puppeteer = await import('puppeteer-core');
  
  browserInstance = await puppeteer.default.launch({
    executablePath: process.env['CHROME_PATH'] || '/usr/bin/chromium-browser',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080',
    ],
  });

  return browserInstance;
}

async function getNewPage(): Promise<Page> {
  const browser = await getBrowser();
  const page = await browser.newPage();
  
  // Set Bangladesh locale and timezone
  await page.setExtraHTTPHeaders({
    'Accept-Language': 'bn-BD,bn;q=0.9,en;q=0.8',
  });
  
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Emulate Bangladeshi user
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'language', { get: () => 'bn-BD' });
    Object.defineProperty(navigator, 'languages', { get: () => ['bn-BD', 'bn', 'en'] });
    Intl.DateTimeFormat.prototype.resolvedOptions = () => ({
      ...Intl.DateTimeFormat.prototype.resolvedOptions(),
      timeZone: 'Asia/Dhaka',
    } as Intl.ResolvedDateTimeFormatOptions);
  });

  return page;
}

// ─── Core Fulfillment Logic ──────────────────────────────────────────────────

export async function fulfillOrder(order: FulfillmentOrder): Promise<FulfillmentResult> {
  const config = APP_CONFIGS[order.app];
  if (!config) {
    return {
      success: false,
      orderId: order.orderId,
      error: `Unsupported app: ${order.app}`,
      timestamp: new Date(),
    };
  }

  let page: Page | null = null;

  try {
    page = await getNewPage();

    // Step 1: Navigate to Codashop BD for the app
    console.log(`[${order.orderId}] Navigating to ${config.codashopUrl}`);
    await page.goto(config.codashopUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(2000);

    // Step 2: Enter customer's User ID
    console.log(`[${order.orderId}] Entering user ID: ${order.userId}`);
    const userIdInput = await page.waitForSelector(config.userIdSelector, { timeout: 10000 });
    if (!userIdInput) throw new Error('User ID input not found');
    await userIdInput.click({ clickCount: 3 });
    await userIdInput.type(order.userId, { delay: 50 });
    await delay(1000);

    // Step 3: Select diamond package
    console.log(`[${order.orderId}] Selecting ${order.diamonds} diamonds package`);
    const packageSelector = config.packageSelector(order.diamonds);
    
    // Try direct selector first, then scan visible packages
    let packageElement = await page.$(packageSelector);
    if (!packageElement) {
      // Fallback: find package by visible text content
      packageElement = await page.evaluateHandle((diamonds) => {
        const elements = document.querySelectorAll('[class*="package"], [class*="product"], [class*="denomination"]');
        for (const el of elements) {
          if (el.textContent?.includes(String(diamonds))) return el;
        }
        return null;
      }, order.diamonds) as unknown as ReturnType<Page['$']>;
    }
    
    if (!packageElement) throw new Error(`Package for ${order.diamonds} diamonds not found`);
    await (packageElement as unknown as { click: () => Promise<void> }).click();
    await delay(1500);

    // Step 4: Select payment method (bKash)
    console.log(`[${order.orderId}] Selecting bKash payment`);
    const bkashSelector = '[data-payment="bkash"], [class*="bkash"], img[alt*="bKash"], [data-channel="bkash"]';
    const bkashOption = await page.$(bkashSelector);
    if (bkashOption) {
      await bkashOption.click();
      await delay(1000);
    }

    // Step 5: Confirm purchase
    console.log(`[${order.orderId}] Confirming purchase`);
    const confirmBtn = await page.$(config.confirmSelector);
    if (!confirmBtn) throw new Error('Confirm button not found');
    await confirmBtn.click();
    await delay(5000);

    // Step 6: Handle bKash payment flow (PIN entry etc.)
    // This depends on whether using bKash tokenized checkout or manual
    const bkashPinInput = await page.$('input[type="password"], input[placeholder*="PIN"], #pin');
    if (bkashPinInput) {
      const bkashPin = process.env['BKASH_PIN'] || '';
      if (!bkashPin) throw new Error('BKASH_PIN not configured');
      await bkashPinInput.type(bkashPin, { delay: 100 });
      
      const bkashConfirm = await page.$('button[type="submit"], .confirm-btn');
      if (bkashConfirm) await bkashConfirm.click();
      await delay(5000);
    }

    // Step 7: Wait for success confirmation
    console.log(`[${order.orderId}] Waiting for confirmation`);
    await page.waitForSelector(config.successIndicator, { timeout: 30000 });

    // Extract transaction ID if visible
    const transactionId = await page.evaluate(() => {
      const txEl = document.querySelector('[class*="transaction"], [class*="order-id"], [class*="reference"]');
      return txEl?.textContent?.trim() || undefined;
    });

    // Take success screenshot
    const screenshotPath = `/tmp/orders/${order.orderId}-success.png`;
    await page.screenshot({ path: screenshotPath, fullPage: false });

    console.log(`[${order.orderId}] ✅ Order fulfilled successfully!`);

    return {
      success: true,
      orderId: order.orderId,
      transactionId: transactionId || undefined,
      screenshotPath,
      timestamp: new Date(),
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${order.orderId}] ❌ Fulfillment failed: ${errorMessage}`);

    // Take failure screenshot for debugging
    if (page) {
      try {
        const screenshotPath = `/tmp/orders/${order.orderId}-failed.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        return {
          success: false,
          orderId: order.orderId,
          error: errorMessage,
          screenshotPath,
          timestamp: new Date(),
        };
      } catch { /* ignore screenshot errors */ }
    }

    return {
      success: false,
      orderId: order.orderId,
      error: errorMessage,
      timestamp: new Date(),
    };

  } finally {
    if (page) await page.close();
  }
}

// ─── Batch Processing ────────────────────────────────────────────────────────

export async function processBatch(orders: FulfillmentOrder[]): Promise<FulfillmentResult[]> {
  const results: FulfillmentResult[] = [];
  
  for (const order of orders) {
    const result = await fulfillOrder(order);
    results.push(result);
    
    // Delay between orders to avoid rate limiting
    await delay(3000);
  }

  return results;
}

// ─── Price Checker ───────────────────────────────────────────────────────────

export interface PriceInfo {
  app: string;
  diamonds: number;
  priceBDT: number;
  priceUSD: number;
  source: string;
}

export async function checkBDPrices(app: string): Promise<PriceInfo[]> {
  const config = APP_CONFIGS[app];
  if (!config) return [];

  let page: Page | null = null;
  
  try {
    page = await getNewPage();
    await page.goto(config.codashopUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    await delay(2000);

    // Scrape all visible prices
    const prices = await page.evaluate(() => {
      const packages: Array<{ diamonds: number; price: string }> = [];
      const elements = document.querySelectorAll('[class*="package"], [class*="product"], [class*="denomination"]');
      
      for (const el of elements) {
        const text = el.textContent || '';
        const diamondMatch = text.match(/(\d[\d,]*)\s*(diamond|coin|gem)/i);
        const priceMatch = text.match(/[৳$]?\s*(\d[\d,.]*)/);
        
        if (diamondMatch && priceMatch) {
          packages.push({
            diamonds: parseInt(diamondMatch[1]!.replace(/,/g, ''), 10),
            price: priceMatch[1]!,
          });
        }
      }
      return packages;
    });

    // BDT to USD rate (approximate)
    const BDT_TO_USD = 0.0082;

    return prices.map((p) => ({
      app,
      diamonds: p.diamonds,
      priceBDT: parseFloat(p.price.replace(/,/g, '')),
      priceUSD: parseFloat(p.price.replace(/,/g, '')) * BDT_TO_USD,
      source: 'codashop-bd',
    }));

  } catch (error) {
    console.error(`Price check failed for ${app}:`, error);
    return [];
  } finally {
    if (page) await page.close();
  }
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function closeBrowser(): Promise<void> {
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

// ─── Health Check ────────────────────────────────────────────────────────────

export async function healthCheck(): Promise<{ ok: boolean; message: string }> {
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.goto('https://www.codashop.com/en-bd', { timeout: 15000 });
    const title = await page.title();
    await page.close();
    return { ok: true, message: `Codashop BD accessible. Title: ${title}` };
  } catch (error) {
    return { ok: false, message: `Health check failed: ${error instanceof Error ? error.message : 'Unknown'}` };
  }
}
