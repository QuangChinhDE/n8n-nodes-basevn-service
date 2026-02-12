# Testing n8n-nodes-basevn-service locally

## Method 1: Use npm link (Recommended)

1. In this package directory:
```bash
npm run build
npm link
```

2. In your n8n installation directory:
```bash
npm link n8n-nodes-basevn-service
```

3. Restart n8n:
```bash
n8n start
```

4. After testing, unlink:
```bash
# In n8n directory
npm unlink n8n-nodes-basevn-service

# In this package directory
npm unlink
```

## Method 2: Install from local path

1. Build the package:
```bash
npm run build
```

2. In your n8n installation:
```bash
npm install /path/to/n8n-nodes-basevn-service
```

3. Restart n8n

## Method 3: Test with n8n in development mode

1. Clone n8n repository
2. Build this package: `npm run build`
3. Copy dist files to n8n's custom nodes directory
4. Run n8n in development mode

## Quick API Testing

Test API endpoints directly with curl before implementing:

```bash
# Test Get all services
curl -X POST 'https://service.base.com.vn/extapi/v1/service/get.all' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'access_token_v2=YOUR_TOKEN'

# Test Create ticket
curl -X POST 'https://service.base.com.vn/extapi/v1/ticket/create' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'access_token_v2=YOUR_TOKEN&username=admin&service_id=123&name=Test'

# Test Get all tickets
curl -X POST 'https://service.base.com.vn/extapi/v1/ticket/list' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'access_token_v2=YOUR_TOKEN&page=0'
```

## Verify Build

After building, check that dist folder contains:
- credentials/ServiceManagementApi.credentials.js
- nodes/ServiceManagement/ServiceManagement.node.js
- All resource files compiled properly
