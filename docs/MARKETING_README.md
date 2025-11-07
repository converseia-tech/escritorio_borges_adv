# Marketing & Automation Integration

## Overview
This project includes comprehensive marketing tracking and automation capabilities:
- **Meta Pixel (Facebook)** - Conversion tracking for Facebook Ads
- **Google Analytics 4** - User behavior and engagement analytics
- **Blog REST API** - Programmatic content management
- **N8N Integration** - Workflow automation for blog publishing

## Quick Start

### 1. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
# Meta Pixel ID from Facebook Events Manager
VITE_META_PIXEL_ID=123456789012345

# Google Analytics 4 Measurement ID
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXX

# Generate secure API key (min 32 characters)
API_AUTH_KEY=abcdef123456XXXXXXXXXXXXXXXXXXXXXXXX
```

**Generate API Key (PowerShell):**
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### 2. Get Your Marketing IDs

**Meta Pixel:**
1. Go to [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Select your pixel or create new one
3. Copy the Pixel ID (15-digit number)
4. Paste into `.env` as `VITE_META_PIXEL_ID`

**Google Analytics 4:**
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create new GA4 property (or use existing)
3. Go to Admin → Data Streams → Web
4. Copy Measurement ID (starts with "G-")
5. Paste into `.env` as `VITE_GA4_MEASUREMENT_ID`

### 3. Restart Development Server

```bash
npm run dev
```

The Vite plugin will automatically inject your IDs into the HTML.

## Features

### Automatic Tracking

**Page Views:**
- Tracked automatically on every route change
- Both Meta Pixel and GA4 receive events
- No manual implementation needed

**Blog Post Views:**
- `view_content` event fires when user reads blog post
- Includes post title, ID, and category
- Useful for measuring content engagement

**WhatsApp Clicks:**
- `generate_lead` event when user clicks WhatsApp button
- Tracks conversion intent
- Useful for Facebook Lead Ads optimization

### Manual Tracking

You can track custom events anywhere in your application:

```typescript
import { trackMeta, trackGA } from '@/lib/tracking';

// Track custom Meta Pixel event
trackMeta('AddToCart', {
  content_name: 'Service Consultation',
  value: 100,
  currency: 'BRL'
});

// Track custom GA4 event
trackGA('purchase', {
  transaction_id: 'ORDER-123',
  value: 100,
  currency: 'BRL',
  items: [{ item_name: 'Consultation' }]
});
```

**Available Functions:**
- `trackPageView(path)` - Track page navigation
- `trackViewContent(contentName, category, id)` - Track content views
- `trackLead(leadType)` - Track lead generation
- `trackWhatsAppClick()` - Track WhatsApp button clicks
- `trackFormSubmit(formName)` - Track form submissions

## Blog REST API

### Authentication
All API endpoints (except `/test`) require Bearer token authentication:

```bash
Authorization: Bearer YOUR_API_KEY
```

### Available Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/blog/test` | Health check | No |
| GET | `/api/blog/list` | List all posts | Yes |
| POST | `/api/blog/create` | Create new post | Yes |
| POST | `/api/blog/update` | Update existing post | Yes |
| POST | `/api/blog/delete` | Delete post | Yes |

### Example: Create Blog Post

**cURL:**
```bash
curl -X POST http://localhost:3000/api/blog/create \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Article",
    "slug": "new-article",
    "content": "Article content here...",
    "excerpt": "Short description",
    "author": "John Doe",
    "tags": ["law", "civil"],
    "published": true
  }'
```

**PowerShell:**
```powershell
$headers = @{
  "Authorization" = "Bearer YOUR_API_KEY"
  "Content-Type" = "application/json"
}

$body = @{
  title = "New Article"
  slug = "new-article"
  content = "Article content here..."
  published = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/blog/create" `
  -Headers $headers -Method Post -Body $body
```

## N8N Automation

### Use Cases
1. **RSS to Blog** - Automatically import articles from external feeds
2. **Scheduled Publishing** - Auto-publish draft posts at specific times
3. **Content Moderation** - AI review before publishing
4. **Multi-platform Publishing** - Sync to Medium, LinkedIn, etc.

### Quick Setup

1. **Install N8N:**
```bash
npm install n8n -g
n8n start
```

2. **Create Workflow:**
- Open http://localhost:5678
- Add "HTTP Request" node
- Configure with your API endpoint and key

3. **Example Workflow (Create Post):**
```json
{
  "nodes": [
    {
      "name": "Create Blog Post",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "http://localhost:3000/api/blog/create",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendBody": true,
        "bodyContentType": "json",
        "jsonBody": "={{ $json }}"
      }
    }
  ]
}
```

For complete N8N examples, see [`docs/n8n-integration.md`](./docs/n8n-integration.md).

## Testing

### Meta Pixel Testing
1. Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
2. Open your website
3. Click extension icon
4. Verify events are firing (PageView, ViewContent, etc.)

### Google Analytics Testing
1. Install [Google Tag Assistant](https://tagassistant.google.com/)
2. Connect to your website
3. Verify GA4 tag is detected
4. Check events in GA4 Realtime view

### API Testing
```bash
# Health check (no auth)
curl http://localhost:3000/api/blog/test

# List posts (with auth)
curl http://localhost:3000/api/blog/list \
  -H "Authorization: Bearer YOUR_API_KEY"
```

For comprehensive testing instructions, see [`docs/testing-guide.md`](./docs/testing-guide.md).

## Architecture

### Tracking Flow
```
User Navigation
    ↓
usePageTracking Hook (App.tsx)
    ↓
trackPageView() (lib/tracking.ts)
    ↓
┌─────────────┬─────────────┐
│             │             │
Meta Pixel    GA4          Console Log
(fbq)         (gtag)       (debug)
```

### API Flow
```
N8N/External Client
    ↓
POST /api/blog/create
    ↓
apiKeyAuth Middleware (server/api-auth.ts)
    ↓ (if valid)
Blog Router (server/api-blog.ts)
    ↓
Drizzle ORM
    ↓
PostgreSQL Database
```

### Build-Time Configuration
```
npm run dev / npm run build
    ↓
Vite starts
    ↓
trackingPlugin() (client/vite-plugin-tracking.ts)
    ↓
Replace __META_PIXEL_ID__ and __GA4_MEASUREMENT_ID__
    ↓
Generated HTML with actual IDs
```

## File Structure

```
client/
  src/
    lib/
      tracking.ts          # Tracking utility functions
    hooks/
      usePageTracking.ts   # Auto page view tracking
  index.html              # Meta Pixel & GA4 scripts
  vite-plugin-tracking.ts # Environment variable injection

server/
  api-auth.ts             # Bearer token middleware
  api-blog.ts             # Blog REST API routes
  _core/
    index.ts              # Express app setup (API registered here)

docs/
  n8n-integration.md      # N8N workflow examples
  testing-guide.md        # Comprehensive testing instructions

.env                      # Your actual credentials (never commit!)
.env.example              # Template with placeholders
```

## Deployment (Render.com)

### 1. Set Environment Variables
In Render dashboard:
- Go to your web service
- Navigate to "Environment" tab
- Add these variables:
  - `VITE_META_PIXEL_ID`
  - `VITE_GA4_MEASUREMENT_ID`
  - `API_AUTH_KEY`

### 2. Deploy
```bash
git add .
git commit -m "feat: Add marketing tracking and blog API"
git push origin main
```

Render will automatically rebuild and redeploy.

### 3. Verify Production
- Test Meta Pixel with Pixel Helper
- Test GA4 with Tag Assistant
- Test API with cURL (use production URL)
- Monitor Render logs for API requests

## Security Best Practices

1. **Never commit `.env` file** - It contains sensitive keys
2. **Use HTTPS in production** - Required for secure token transmission
3. **Rotate API keys regularly** - Update `API_AUTH_KEY` every 90 days
4. **Monitor API usage** - Check server logs for suspicious activity
5. **Rate limit API** - Consider adding express-rate-limit middleware

## Troubleshooting

### Pixel/GA4 Not Firing
- **Check console:** Look for initialization messages
- **Verify .env:** Ensure IDs are correct
- **Restart server:** Environment changes require restart
- **Clear cache:** Browser cache can interfere

### API Returns 401/403
- **Check header:** Must be `Authorization: Bearer YOUR_KEY`
- **Verify key:** Copy directly from `.env` file
- **No quotes:** Don't include quotes in the token itself

### N8N Can't Connect
- **Use full URL:** Include `http://` or `https://`
- **Check firewall:** Ensure port 3000 is accessible
- **Production URL:** Use Render URL instead of localhost

## Performance Impact

- **Meta Pixel script:** ~45KB (loads async, non-blocking)
- **GA4 script:** ~35KB (loads async, non-blocking)
- **Tracking functions:** <1KB (minimal overhead)
- **API response time:** <200ms average

## Compliance

### LGPD (Brazilian Data Protection Law)
- Add cookie consent banner before tracking
- Provide opt-out mechanism
- Update privacy policy

### GDPR (European Data Protection)
- Anonymize IP addresses in GA4
- Implement cookie consent
- Allow data deletion requests

## Support & Resources

- **Meta Pixel Help:** https://www.facebook.com/business/help/742478679120153
- **GA4 Documentation:** https://support.google.com/analytics/answer/9304153
- **N8N Docs:** https://docs.n8n.io/
- **Testing Guide:** [`docs/testing-guide.md`](./docs/testing-guide.md)
- **N8N Examples:** [`docs/n8n-integration.md`](./docs/n8n-integration.md)

## Contributing

When adding new tracking:
1. Add function to `client/src/lib/tracking.ts`
2. Add TypeScript types for parameters
3. Include console.log for debugging
4. Track in both Meta and GA4
5. Update this README with examples
6. Test with Pixel Helper and Tag Assistant

## License

This marketing integration follows the same license as the main project.

---

**Need Help?** Check the comprehensive testing guide in `docs/testing-guide.md` or N8N integration examples in `docs/n8n-integration.md`.
