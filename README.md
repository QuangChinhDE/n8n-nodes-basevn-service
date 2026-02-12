# n8n-nodes-basevn-service

n8n community node for [BaseVN - App Service](https://base.vn) integration.

[![NPM Version](https://img.shields.io/npm/v/n8n-nodes-basevn-service)](https://www.npmjs.com/package/n8n-nodes-basevn-service)

## Installation

Install from npm in your n8n root directory:

```bash
npm install n8n-nodes-basevn-service
```

Or install via n8n Community Nodes:
1. Go to **Settings → Community Nodes**
2. Click **Install**
3. Enter `n8n-nodes-basevn-service`

## Prerequisites

- n8n instance (self-hosted or cloud)
- Base.vn account with BaseVN - App Service access
- API access token (`access_token_v2`)

## Configuration

1. Add new credentials: **BaseVN - App Service**
2. Enter your Base.vn domain (e.g., `example.base.vn`)
3. Provide your `access_token_v2`

## Features

### Resources

#### Group
- **Get**: Retrieve group by ID
- **Get Many**: List all groups with pagination

#### Request
- **Get**: Get request details by ID
- **Get Many**: List requests with filters
- **Create Request**: Create a new request
- **Get with Custom Table**: Retrieve requests with custom table data
- **Add Follower**: Add follower to request
- **Get Posts**: Load posts from request with pagination
- **Get Comments**: Load comments from post with pagination

## API Documentation

For complete API reference and detailed documentation, see:
📘 [Base.vn Service API - Postman Documentation](https://documenter.getpostman.com/view/1345096/SzzheyWQ?version=latest)

## Operations Examples

**Create Request:**
```json
{
  "username": "admin",
  "group_id": "123",
  "name": "New Service Request",
  "content": "Request description",
  "direct_managers": "hung admin"
}
```

**Get Posts with Pagination:**
```json
{
  "request_id": "456",
  "last_id": "0"
}
```

## Support

- Issues: [GitHub Issues](https://github.com/your-repo/n8n-nodes-basevn-service/issues)
- Documentation: [Base.vn API Docs](https://documenter.getpostman.com/view/1345096/SzzheyWQ?version=latest)

## License

MIT
