# Diamond Auto-Fulfillment Engine

Puppeteer-based automation that purchases diamonds from Codashop Bangladesh at regional pricing and delivers them to customer accounts.

## How It Works

```
Customer Order → Your API → Puppeteer Bot → Codashop BD → Diamonds Delivered
                                  ↓
                         Pays with bKash at BD prices
                         (74% cheaper than US/Gulf in-app)
```

## Setup

### 1. Install Chromium on your server

```bash
# Ubuntu/Debian
apt-get install chromium-browser

# Or use Puppeteer's bundled Chromium
npx puppeteer browsers install chrome
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your bKash credentials and Chrome path
```

### 3. Run the fulfillment server

```bash
npx tsx src/automation/server.ts
```

## API Usage

### Fulfill a single order

```bash
curl -X POST http://localhost:3001/api/fulfill \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "ORD-ABC123",
    "app": "imo",
    "userId": "1234567890",
    "diamonds": 1000
  }'
```

### Check BD prices

```bash
curl http://localhost:3001/api/prices/imo
```

### Health check

```bash
curl http://localhost:3001/api/health
```

## Integration with Frontend

When a customer completes payment on your website, your frontend calls:

```typescript
const response = await fetch('https://your-server.com/api/fulfill', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    orderId: order.id,
    app: order.app,
    userId: order.userId,
    diamonds: order.package.diamonds,
  }),
});
const result = await response.json();
// result.success === true → diamonds delivered!
```

## Important Notes

- **bKash account required**: You need a Bangladeshi bKash account to make payments
- **Selectors may change**: Codashop updates their UI. Monitor and update selectors.
- **Rate limiting**: Don't exceed 1 order per 30 seconds to avoid detection
- **Screenshots**: Every order (success/fail) saves a screenshot for verification
- **Fallback**: If automation fails, you get notified and can fulfill manually

## Deployment

Deploy the fulfillment server on a VPS (DigitalOcean, Hetzner, etc.) with:
- 2GB RAM minimum
- Chromium installed
- Node.js 22+
- Your .env configured

The server runs independently from your frontend (Render static site).
```
