# Testing Guide - Marketing Integration & Blog API

## Overview
This guide provides step-by-step instructions for testing all marketing and API integrations:
1. Meta Pixel (Facebook) tracking
2. Google Analytics 4 (GA4) tracking
3. Blog REST API endpoints
4. N8N automation workflows

---

## Prerequisites

### Required Tools
- **Chrome Browser** (latest version)
- **Meta Pixel Helper Extension** - [Install here](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
- **Google Tag Assistant** - [Install here](https://tagassistant.google.com/)
- **Postman** (optional) - [Download here](https://www.postman.com/downloads/)
- **cURL** (built into Windows PowerShell)

### Environment Setup
1. Open `.env` file in your project root
2. Replace placeholder values:
   ```env
   VITE_META_PIXEL_ID=YOUR_ACTUAL_PIXEL_ID
   VITE_GA4_MEASUREMENT_ID=G-YOUR_MEASUREMENT_ID
   API_AUTH_KEY=YOUR_SECURE_RANDOM_KEY
   ```
3. Save the file
4. Restart your development server

---

## Part 1: Testing Meta Pixel Integration

### Step 1: Install Meta Pixel Helper
1. Open Chrome
2. Go to [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc)
3. Click "Add to Chrome"
4. Pin the extension to your toolbar

### Step 2: Start Development Server
```powershell
# Navigate to project directory
cd c:\Users\victo\Documents\escritorio-borges-adv\escritorio_borges_adv

# Start the server
npm run dev
```

Wait for the message: `Server running on http://localhost:3000`

### Step 3: Test Page View Tracking
1. Open Chrome
2. Navigate to `http://localhost:3000`
3. Open **Developer Console** (F12 or Ctrl+Shift+J)
4. Look for these console logs:
   ```
   Meta Pixel initialized: YOUR_PIXEL_ID
   [Meta Pixel] PageView: /
   [GA4] page_view: /
   ```
5. Click the **Meta Pixel Helper** icon in your toolbar
6. Verify you see:
   - ✅ PageView event detected
   - ✅ Pixel ID matches your `.env` file
   - ✅ No warnings or errors

### Step 4: Test Navigation Tracking
1. Click on "Áreas de Atuação" in the menu
2. Check console for:
   ```
   [Meta Pixel] PageView: /areas-de-atuacao
   [GA4] page_view: /areas-de-atuacao
   ```
3. Click Meta Pixel Helper
4. Verify new PageView event for the current route

### Step 5: Test Blog Post Tracking
1. Navigate to "Blog" page
2. Click on any blog post
3. Check console for:
   ```
   [Meta Pixel] ViewContent
   Content: Post Title
   Category: blog
   Value: post-id
   [GA4] view_content
   Content Type: blog
   Item ID: post-id
   ```
4. Verify Meta Pixel Helper shows **ViewContent** event

### Step 6: Test WhatsApp Button Tracking
1. Click the **WhatsApp floating button** (green button, bottom-right)
2. Check console for:
   ```
   [Meta Pixel] Contact
   Content Name: WhatsApp Click
   Content Category: contact
   [GA4] generate_lead
   Event Category: engagement
   Event Label: whatsapp
   ```
3. Verify events in Meta Pixel Helper

### Expected Console Output (Full Test)
```
Meta Pixel initialized: 123456789012345
GA4 initialized: G-XXXXXXXXX
[Meta Pixel] PageView: /
[GA4] page_view: /
[Meta Pixel] PageView: /blog
[GA4] page_view: /blog
[Meta Pixel] ViewContent
  Content: Como Funciona a Previdência Social
  Category: blog
  Value: 1
[GA4] view_content
  Content Type: blog
  Item ID: 1
[Meta Pixel] Contact
  Content Name: WhatsApp Click
  Content Category: contact
[GA4] generate_lead
  Event Category: engagement
  Event Label: whatsapp
```

### Troubleshooting Meta Pixel

**Issue:** "No pixel found on page"
- **Solution:** Check that `VITE_META_PIXEL_ID` is set in `.env`
- **Solution:** Restart dev server after changing `.env`
- **Solution:** Clear browser cache (Ctrl+Shift+Delete)

**Issue:** Pixel ID shows as "undefined" or "__META_PIXEL_ID__"
- **Solution:** Verify Vite plugin is registered in `vite.config.ts`
- **Solution:** Check `client/vite-plugin-tracking.ts` exists
- **Solution:** Rebuild the project: `npm run build`

**Issue:** Events not firing
- **Solution:** Check browser console for JavaScript errors
- **Solution:** Verify `trackPageView()` is called in `usePageTracking` hook
- **Solution:** Ensure `App.tsx` imports and uses the hook

---

## Part 2: Testing Google Analytics 4 (GA4)

### Step 1: Install Google Tag Assistant
1. Open Chrome
2. Go to [Tag Assistant](https://tagassistant.google.com/)
3. Click "Add Tag Assistant to Chrome"
4. Pin the extension to your toolbar

### Step 2: Connect Tag Assistant
1. Click **Tag Assistant** icon in Chrome
2. Click "Connect" at the top
3. Enter URL: `http://localhost:3000`
4. Click "Connect"
5. A new tab will open with Tag Assistant active

### Step 3: Test GA4 Page Views
1. On the connected page, navigate through your site
2. Click Tag Assistant icon
3. Verify you see:
   - ✅ Google Analytics tag detected
   - ✅ Measurement ID matches your `.env` file
   - ✅ `page_view` events for each navigation

### Step 4: Test GA4 Custom Events
1. Navigate to a blog post
2. In Tag Assistant, look for:
   - Event name: `view_content`
   - Parameters: `content_type: "blog"`, `item_id: "post-id"`
3. Click WhatsApp button
4. Verify:
   - Event name: `generate_lead`
   - Parameters: `event_category: "engagement"`, `event_label: "whatsapp"`

### Step 5: Real-Time GA4 Verification (Production Only)
1. Go to [Google Analytics](https://analytics.google.com/)
2. Select your property
3. Navigate to **Reports** → **Realtime**
4. Open your website in another tab
5. Watch real-time events appear:
   - Page views
   - Custom events
   - User location and device

### Expected Tag Assistant Output
```
✅ Google Analytics: GA4
   Measurement ID: G-XXXXXXXXX
   
   Events detected:
   - page_view (5 times)
   - view_content (2 times)
   - generate_lead (1 time)
   
   No errors or warnings
```

### Troubleshooting GA4

**Issue:** No GA4 tag detected
- **Solution:** Verify `VITE_GA4_MEASUREMENT_ID` starts with "G-"
- **Solution:** Check `client/index.html` has gtag script
- **Solution:** Restart dev server

**Issue:** Events firing but not appearing in GA4 dashboard
- **Solution:** Wait 24-48 hours for full processing
- **Solution:** Use Realtime view instead of historical reports
- **Solution:** Verify your GA4 property is set up correctly

**Issue:** Duplicate events
- **Solution:** Check that `usePageTracking` is only called once (in App.tsx)
- **Solution:** Ensure no manual `trackPageView()` calls in page components

---

## Part 3: Testing Blog REST API

### Method A: Using cURL (PowerShell)

#### Test 1: Health Check
```powershell
curl.exe -X GET http://localhost:3000/api/blog/test
```

**Expected Output:**
```json
{"success":true,"message":"Blog API is working!"}
```

#### Test 2: List All Posts
```powershell
$headers = @{ "Authorization" = "Bearer YOUR_API_KEY_HERE" }
Invoke-RestMethod -Uri "http://localhost:3000/api/blog/list" -Headers $headers -Method Get | ConvertTo-Json -Depth 10
```

**Expected Output:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Blog Post Title",
      "slug": "blog-post-slug",
      ...
    }
  ]
}
```

#### Test 3: Create New Post
```powershell
$headers = @{
  "Authorization" = "Bearer YOUR_API_KEY_HERE"
  "Content-Type" = "application/json"
}

$body = @{
  title = "Test Post from API"
  slug = "test-post-api"
  content = "This is test content created via API"
  excerpt = "Test excerpt"
  author = "API Tester"
  tags = @("test", "api")
  published = $false
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/blog/create" -Headers $headers -Method Post -Body $body | ConvertTo-Json -Depth 10
```

**Expected Output:**
```json
{
  "success": true,
  "message": "Blog post created successfully",
  "data": {
    "id": 6,
    "title": "Test Post from API",
    ...
  }
}
```

#### Test 4: Update Post
```powershell
$headers = @{
  "Authorization" = "Bearer YOUR_API_KEY_HERE"
  "Content-Type" = "application/json"
}

$body = @{
  slug = "test-post-api"
  title = "Updated Test Post"
  published = $true
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/blog/update" -Headers $headers -Method Post -Body $body | ConvertTo-Json -Depth 10
```

#### Test 5: Delete Post
```powershell
$headers = @{
  "Authorization" = "Bearer YOUR_API_KEY_HERE"
  "Content-Type" = "application/json"
}

$body = @{
  slug = "test-post-api"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/blog/delete" -Headers $headers -Method Post -Body $body | ConvertTo-Json -Depth 10
```

### Method B: Using Postman

#### Setup Postman Collection
1. Open Postman
2. Click "New" → "Collection"
3. Name it "Blog API Tests"
4. Create environment variables:
   - `base_url`: `http://localhost:3000`
   - `api_key`: Your actual API key from `.env`

#### Create Requests

**Request 1: Health Check**
- Method: GET
- URL: `{{base_url}}/api/blog/test`
- Headers: (none)
- Expected Status: 200 OK

**Request 2: List Posts**
- Method: GET
- URL: `{{base_url}}/api/blog/list`
- Headers:
  - `Authorization`: `Bearer {{api_key}}`
- Expected Status: 200 OK

**Request 3: Create Post**
- Method: POST
- URL: `{{base_url}}/api/blog/create`
- Headers:
  - `Authorization`: `Bearer {{api_key}}`
  - `Content-Type`: `application/json`
- Body (raw JSON):
```json
{
  "title": "Postman Test Post",
  "slug": "postman-test-post",
  "content": "Content created via Postman",
  "excerpt": "Test excerpt",
  "author": "Postman User",
  "tags": ["postman", "test"],
  "published": false
}
```
- Expected Status: 201 Created

**Request 4: Update Post**
- Method: POST
- URL: `{{base_url}}/api/blog/update`
- Headers:
  - `Authorization`: `Bearer {{api_key}}`
  - `Content-Type`: `application/json`
- Body (raw JSON):
```json
{
  "slug": "postman-test-post",
  "published": true
}
```
- Expected Status: 200 OK

**Request 5: Delete Post**
- Method: POST
- URL: `{{base_url}}/api/blog/delete`
- Headers:
  - `Authorization`: `Bearer {{api_key}}`
  - `Content-Type`: `application/json`
- Body (raw JSON):
```json
{
  "slug": "postman-test-post"
}
```
- Expected Status: 200 OK

#### Run Collection Tests
1. Click "Runner" in Postman
2. Select "Blog API Tests" collection
3. Click "Run Blog API Tests"
4. Verify all tests pass (green checkmarks)

### Expected Server Console Output
```
[Blog API] List all posts request
[Blog API] Found 5 blog posts
[Blog API] Create post request: Test Post from API
[Blog API] Blog post created successfully: 6
[Blog API] Update post request - slug: test-post-api
[Blog API] Blog post updated successfully: 6
[Blog API] Delete post request - slug: test-post-api
[Blog API] Blog post deleted successfully: 6
```

### API Error Testing

**Test Invalid API Key:**
```powershell
$headers = @{ "Authorization" = "Bearer INVALID_KEY" }
Invoke-RestMethod -Uri "http://localhost:3000/api/blog/list" -Headers $headers -Method Get
```
**Expected:** 403 Forbidden - "Invalid API key"

**Test Missing Title:**
```powershell
$body = @{ slug = "test"; content = "content" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/blog/create" -Headers $headers -Method Post -Body $body
```
**Expected:** 400 Bad Request - "Missing required field: title"

**Test Duplicate Slug:**
```powershell
# Create post twice with same slug
# Second attempt should return:
```
**Expected:** 409 Conflict - "Blog post with this slug already exists"

---

## Part 4: Testing N8N Integration

### Prerequisites
1. Install N8N: `npm install n8n -g`
2. Start N8N: `n8n start`
3. Open browser: `http://localhost:5678`

### Test Workflow 1: Manual Blog Creation

1. **Create new workflow** in N8N
2. **Add Manual Trigger node**
3. **Add Set node** with this JSON:
```json
{
  "title": "N8N Test Article",
  "slug": "n8n-test-article",
  "content": "This article was created by N8N automation",
  "excerpt": "N8N automation test",
  "author": "N8N Workflow",
  "tags": ["automation", "n8n"],
  "published": false
}
```
4. **Add HTTP Request node:**
   - Method: POST
   - URL: `http://localhost:3000/api/blog/create`
   - Authentication: Header Auth
   - Header Name: `Authorization`
   - Header Value: `Bearer YOUR_API_KEY`
   - Body Content Type: JSON
   - JSON/RAW Parameters: Use Expression `{{ $json }}`
5. **Execute workflow**
6. **Verify response:**
   ```json
   {
     "success": true,
     "message": "Blog post created successfully",
     "data": { ... }
   }
   ```
7. **Check your website** - new post should appear in blog list

### Test Workflow 2: Scheduled Publication

1. **Create new workflow**
2. **Add Schedule Trigger:**
   - Mode: Every 1 hour
3. **Add HTTP Request node** (Get unpublished posts):
   - Method: GET
   - URL: `http://localhost:3000/api/blog/list`
   - Authentication: Header Auth
4. **Add Filter node:**
   - Condition: `{{ $json.published }}` equals `false`
5. **Add HTTP Request node** (Publish):
   - Method: POST
   - URL: `http://localhost:3000/api/blog/update`
   - Body: `{ "id": {{ $json.id }}, "published": true }`
6. **Activate workflow**
7. **Wait for execution**

### Expected N8N Console Output
```
Workflow executed successfully
✅ HTTP Request: 201 Created
📄 Response: {"success":true,"message":"Blog post created successfully"}
```

---

## Part 5: Comprehensive Test Checklist

### Pre-Deployment Tests

#### ✅ Environment Variables
- [ ] `VITE_META_PIXEL_ID` is set and valid
- [ ] `VITE_GA4_MEASUREMENT_ID` starts with "G-"
- [ ] `API_AUTH_KEY` is long and random (min 32 characters)
- [ ] `.env.example` updated with placeholders
- [ ] Production `.env` on Render has all variables

#### ✅ Meta Pixel Tracking
- [ ] Page view events fire on navigation
- [ ] ViewContent fires on blog post view
- [ ] Contact event fires on WhatsApp click
- [ ] Meta Pixel Helper shows no errors
- [ ] Pixel ID matches Facebook Ads Manager

#### ✅ Google Analytics Tracking
- [ ] Page views tracked on all routes
- [ ] Custom events fire correctly
- [ ] Tag Assistant shows no warnings
- [ ] Real-time view shows events (production)

#### ✅ Blog REST API
- [ ] Health check returns 200 OK
- [ ] List endpoint requires authentication
- [ ] Create endpoint validates required fields
- [ ] Update endpoint handles partial updates
- [ ] Delete endpoint removes posts
- [ ] API returns proper error codes (400, 401, 403, 404, 409)
- [ ] Console logs show detailed information

#### ✅ N8N Integration
- [ ] Manual workflow creates posts successfully
- [ ] Scheduled workflow executes on time
- [ ] Authentication works from external systems
- [ ] Error handling works (invalid key, missing fields)

#### ✅ Code Quality
- [ ] No TypeScript errors: `npm run build`
- [ ] No console errors in browser
- [ ] All imports resolve correctly
- [ ] Server starts without errors

### Post-Deployment Tests (Production)

1. **Visit production URL** (e.g., `https://your-app.onrender.com`)
2. **Verify Meta Pixel** fires (use Pixel Helper)
3. **Verify GA4** tracks events (use Tag Assistant + Realtime view)
4. **Test API endpoint** from external tool (Postman with production URL)
5. **Monitor Render logs** for API requests
6. **Check Facebook Events Manager** for pixel data (24-48 hours)
7. **Check GA4 Reports** for page views and events (24-48 hours)

---

## Troubleshooting Guide

### Problem: No tracking events fire
**Diagnosis:**
- Check browser console for errors
- Verify environment variables loaded
- Confirm Vite plugin runs at build time

**Solution:**
```powershell
# Clear cache and rebuild
npm run clean
npm run build
npm run dev
```

### Problem: API returns 500 errors
**Diagnosis:**
- Check server console for stack trace
- Verify database connection
- Confirm Drizzle schema matches database

**Solution:**
```powershell
# Push database schema
npm run db:push

# Check database connection
npm run db:studio
```

### Problem: N8N can't connect to API
**Diagnosis:**
- Verify N8N can reach `localhost:3000` or production URL
- Check firewall settings
- Confirm API_AUTH_KEY matches

**Solution:**
- Use production URL instead of localhost
- Add N8N IP to allowlist (if using firewall)
- Copy API key directly from `.env` (no quotes)

---

## Performance Monitoring

### Expected Load Times
- **Homepage:** < 2 seconds
- **Blog list:** < 1.5 seconds
- **Blog post:** < 1 second
- **API response:** < 200ms

### Monitoring Tools
1. **Chrome DevTools:** Network tab for load times
2. **Lighthouse:** Performance, SEO, Best Practices scores
3. **Meta Pixel Helper:** Pixel load time
4. **Tag Assistant:** Tag load time

### Optimization Checks
- [ ] Images optimized (< 200KB)
- [ ] Lazy loading enabled
- [ ] Code splitting working
- [ ] Tracking scripts load async
- [ ] No blocking resources

---

## Next Steps

1. **Complete all tests** in development
2. **Fix any issues** before deploying
3. **Deploy to production** (Render auto-deploys on push)
4. **Verify production** tracking (repeat tests with production URL)
5. **Monitor for 48 hours** (Meta Pixel and GA4 need time to aggregate data)
6. **Set up alerts** in Facebook Ads Manager and GA4
7. **Create dashboards** in GA4 for key metrics
8. **Document learnings** and update this guide

For N8N workflow templates and examples, see `n8n-integration.md`.

---

## Support Resources

- **Meta Pixel Help:** https://www.facebook.com/business/help/742478679120153
- **GA4 Documentation:** https://developers.google.com/analytics/devguides/collection/ga4
- **N8N Documentation:** https://docs.n8n.io/
- **Postman Learning:** https://learning.postman.com/

For project-specific issues, check server console logs and browser DevTools console.
