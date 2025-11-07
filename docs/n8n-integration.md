# N8N Integration Guide - Blog REST API

## Overview
This document provides complete examples for integrating the Blog REST API with N8N automation workflows. All endpoints require Bearer token authentication except the health check endpoint.

## Authentication
All API requests (except `/test`) require an `Authorization` header with your API key:

```
Authorization: Bearer YOUR_API_KEY_HERE
```

Replace `YOUR_API_KEY_HERE` with the value from your `.env` file (`API_AUTH_KEY` variable).

---

## API Endpoints

### 1. Health Check (No Authentication)
**Endpoint:** `GET /api/blog/test`

**Purpose:** Verify API is running

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/blog/test
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Blog API is working!"
}
```

**N8N HTTP Request Node Configuration:**
```json
{
  "method": "GET",
  "url": "https://your-domain.com/api/blog/test",
  "authentication": "none",
  "responseFormat": "json"
}
```

---

### 2. List All Blog Posts
**Endpoint:** `GET /api/blog/list`

**Purpose:** Retrieve all published and unpublished blog posts

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/blog/list \
  -H "Authorization: Bearer YOUR_API_KEY_HERE"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Como Funciona a Previdência Social no Brasil",
      "slug": "como-funciona-previdencia-social-brasil",
      "excerpt": "Entenda os principais aspectos da previdência social brasileira...",
      "content": "A previdência social é um direito fundamental...",
      "featuredImage": "https://example.com/image.jpg",
      "author": "Dr. João Silva",
      "tags": ["previdência", "direitos"],
      "published": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

**N8N HTTP Request Node Configuration:**
```json
{
  "method": "GET",
  "url": "https://your-domain.com/api/blog/list",
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "httpHeaderAuth": {
    "name": "Authorization",
    "value": "Bearer YOUR_API_KEY_HERE"
  },
  "responseFormat": "json"
}
```

---

### 3. Create New Blog Post
**Endpoint:** `POST /api/blog/create`

**Purpose:** Create a new blog post from N8N workflow

**Required Fields:**
- `title` (string)
- `slug` (string, must be unique)
- `content` (string)

**Optional Fields:**
- `excerpt` (string)
- `featuredImage` (string, URL)
- `author` (string)
- `tags` (array of strings)
- `published` (boolean, default: false)

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/blog/create \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Direitos Trabalhistas em 2024",
    "slug": "direitos-trabalhistas-2024",
    "content": "Neste artigo, vamos explorar as principais mudanças nos direitos trabalhistas para o ano de 2024...",
    "excerpt": "Conheça as principais mudanças nos direitos trabalhistas.",
    "featuredImage": "https://example.com/trabalhista.jpg",
    "author": "Dra. Maria Santos",
    "tags": ["trabalhista", "direitos", "2024"],
    "published": true
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Blog post created successfully",
  "data": {
    "id": 5,
    "title": "Direitos Trabalhistas em 2024",
    "slug": "direitos-trabalhistas-2024",
    "content": "Neste artigo, vamos explorar...",
    "excerpt": "Conheça as principais mudanças...",
    "featuredImage": "https://example.com/trabalhista.jpg",
    "author": "Dra. Maria Santos",
    "tags": ["trabalhista", "direitos", "2024"],
    "published": true,
    "createdAt": "2024-01-20T14:25:00.000Z"
  }
}
```

**N8N HTTP Request Node Configuration:**
```json
{
  "method": "POST",
  "url": "https://your-domain.com/api/blog/create",
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "httpHeaderAuth": {
    "name": "Authorization",
    "value": "Bearer YOUR_API_KEY_HERE"
  },
  "sendBody": true,
  "bodyContentType": "json",
  "jsonBody": "={{ $json }}",
  "responseFormat": "json"
}
```

**N8N Set Node (Prepare Data):**
```json
{
  "title": "{{ $json.title }}",
  "slug": "{{ $json.slug }}",
  "content": "{{ $json.content }}",
  "excerpt": "{{ $json.excerpt }}",
  "featuredImage": "{{ $json.image_url }}",
  "author": "{{ $json.author_name }}",
  "tags": "{{ $json.tags.split(',') }}",
  "published": true
}
```

---

### 4. Update Existing Blog Post
**Endpoint:** `POST /api/blog/update`

**Purpose:** Update an existing blog post by ID or slug

**Required Field:**
- `id` (number) OR `slug` (string)

**Optional Fields:** (at least one must be provided)
- `title` (string)
- `content` (string)
- `excerpt` (string)
- `featuredImage` (string)
- `author` (string)
- `tags` (array of strings)
- `published` (boolean)

**cURL Example (Update by ID):**
```bash
curl -X POST http://localhost:3000/api/blog/update \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 5,
    "title": "Direitos Trabalhistas em 2024 - Atualizado",
    "published": true,
    "tags": ["trabalhista", "direitos", "2024", "atualizado"]
  }'
```

**cURL Example (Update by Slug):**
```bash
curl -X POST http://localhost:3000/api/blog/update \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "direitos-trabalhistas-2024",
    "excerpt": "Nova introdução atualizada para o artigo.",
    "featuredImage": "https://example.com/nova-imagem.jpg"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Blog post updated successfully",
  "data": {
    "id": 5,
    "title": "Direitos Trabalhistas em 2024 - Atualizado",
    "slug": "direitos-trabalhistas-2024",
    "content": "Neste artigo, vamos explorar...",
    "excerpt": "Nova introdução atualizada para o artigo.",
    "featuredImage": "https://example.com/nova-imagem.jpg",
    "author": "Dra. Maria Santos",
    "tags": ["trabalhista", "direitos", "2024", "atualizado"],
    "published": true,
    "createdAt": "2024-01-20T14:25:00.000Z"
  }
}
```

**N8N HTTP Request Node Configuration:**
```json
{
  "method": "POST",
  "url": "https://your-domain.com/api/blog/update",
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "httpHeaderAuth": {
    "name": "Authorization",
    "value": "Bearer YOUR_API_KEY_HERE"
  },
  "sendBody": true,
  "bodyContentType": "json",
  "jsonBody": "={{ $json }}",
  "responseFormat": "json"
}
```

---

### 5. Delete Blog Post
**Endpoint:** `POST /api/blog/delete`

**Purpose:** Permanently delete a blog post by ID or slug

**Required Field:**
- `id` (number) OR `slug` (string)

**cURL Example (Delete by ID):**
```bash
curl -X POST http://localhost:3000/api/blog/delete \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "id": 5
  }'
```

**cURL Example (Delete by Slug):**
```bash
curl -X POST http://localhost:3000/api/blog/delete \
  -H "Authorization: Bearer YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "direitos-trabalhistas-2024"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Blog post deleted successfully"
}
```

**N8N HTTP Request Node Configuration:**
```json
{
  "method": "POST",
  "url": "https://your-domain.com/api/blog/delete",
  "authentication": "genericCredentialType",
  "genericAuthType": "httpHeaderAuth",
  "httpHeaderAuth": {
    "name": "Authorization",
    "value": "Bearer YOUR_API_KEY_HERE"
  },
  "sendBody": true,
  "bodyContentType": "json",
  "jsonBody": "={{ { \"id\": $json.post_id } }}",
  "responseFormat": "json"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Missing required field: title"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Missing authorization token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Invalid API key"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Blog post not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": "Blog post with this slug already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Failed to create blog post: [detailed error message]"
}
```

---

## N8N Workflow Examples

### Example 1: RSS to Blog (Auto-Import Articles)

**Workflow Steps:**
1. **RSS Feed Read** - Fetch articles from external RSS feed
2. **Filter** - Only new articles (not in database)
3. **Set** - Map RSS fields to blog API format
4. **HTTP Request** - POST to `/api/blog/create`
5. **Email** - Notify admin of new posts

**Set Node Mapping:**
```json
{
  "title": "{{ $json.title }}",
  "slug": "{{ $json.link.split('/').pop() }}",
  "content": "{{ $json.content }}",
  "excerpt": "{{ $json.description }}",
  "author": "{{ $json.creator }}",
  "tags": "{{ $json.categories }}",
  "published": false
}
```

### Example 2: Scheduled Content Publication

**Workflow Steps:**
1. **Schedule Trigger** - Daily at 9 AM
2. **HTTP Request** - GET `/api/blog/list`
3. **Filter** - Find posts with `published: false`
4. **Code** - Check if scheduled date has passed
5. **HTTP Request** - POST to `/api/blog/update` with `published: true`

### Example 3: Content Moderation Webhook

**Workflow Steps:**
1. **Webhook** - Trigger on new content submission
2. **OpenAI** - Check content for appropriateness
3. **IF** - Content approved?
   - **Yes:** HTTP Request to `/api/blog/create`
   - **No:** Send rejection email

---

## Testing with Postman

### Import Collection

Create a new Postman collection with these environment variables:
- `base_url`: `http://localhost:3000` (or production URL)
- `api_key`: Your actual API key

### Request Templates

Each endpoint above can be imported as a Postman request:

1. Create new request
2. Set method (GET/POST)
3. Add URL: `{{base_url}}/api/blog/endpoint`
4. Add header: `Authorization: Bearer {{api_key}}`
5. Add JSON body (for POST requests)

---

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use HTTPS** in production (required for Bearer tokens)
3. **Rotate keys regularly** (update `API_AUTH_KEY` in `.env`)
4. **Log API usage** (already implemented with console.log)
5. **Rate limit** if public-facing (consider adding Express rate-limit middleware)

---

## Troubleshooting

### Issue: 401 Unauthorized
**Solution:** Check that your API key matches exactly. No spaces, no quotes in the token itself.

### Issue: 409 Conflict (duplicate slug)
**Solution:** Use a unique slug or update the existing post instead of creating a new one.

### Issue: 400 Bad Request (missing fields)
**Solution:** Verify all required fields are present in your payload. Check console logs for specific missing field.

### Issue: N8N timeout
**Solution:** Increase timeout in HTTP Request node settings to 30 seconds. Large content may take longer to process.

---

## Next Steps

1. **Set up N8N** at https://n8n.io or self-host
2. **Create webhook** in N8N workflow
3. **Test with cURL** examples above
4. **Import workflow** templates from N8N community
5. **Monitor logs** in production for errors

For more information, see `testing-guide.md` for comprehensive testing instructions.
