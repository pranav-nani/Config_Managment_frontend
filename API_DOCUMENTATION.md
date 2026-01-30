# API Documentation

This document describes the backend API endpoints that the ConfigHub dashboard integrates with.

## Base URL

```
http://localhost:8000/api
```

Configure in `.env` file using `VITE_API_URL` variable.

## Authentication

All endpoints except `/auth/login` require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Login

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "name": "Admin User"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Invalid credentials
- `400` - Validation error

---

## Configurations

### Get All Configs

**Endpoint:** `GET /configs`

**Query Parameters:**
- `environment` (optional) - Filter by environment (dev/test/prod)
- `serviceName` (optional) - Filter by service name

**Response:**
```json
[
  {
    "id": 1,
    "serviceName": "auth-service",
    "environment": "prod",
    "version": 3,
    "data": {
      "port": 8080,
      "database": {
        "host": "db.example.com",
        "port": 5432
      }
    },
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "createdBy": "admin@example.com",
    "description": "Production config with updated DB settings"
  }
]
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized
- `500` - Server error

---

### Get Config by Service and Environment

**Endpoint:** `GET /configs/{serviceName}/{environment}`

**Path Parameters:**
- `serviceName` - Name of the service
- `environment` - Environment (dev/test/prod)

**Response:**
```json
{
  "id": 1,
  "serviceName": "auth-service",
  "environment": "prod",
  "version": 3,
  "data": { ... },
  "isActive": true,
  "createdAt": "2024-01-15T10:30:00Z",
  "createdBy": "admin@example.com"
}
```

**Status Codes:**
- `200` - Success
- `404` - Config not found
- `401` - Unauthorized

---

### Get Config Version History

**Endpoint:** `GET /configs/{serviceName}/{environment}/history`

**Path Parameters:**
- `serviceName` - Name of the service
- `environment` - Environment (dev/test/prod)

**Response:**
```json
[
  {
    "id": 3,
    "version": 3,
    "data": { ... },
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "version": 2,
    "data": { ... },
    "isActive": false,
    "createdAt": "2024-01-10T14:20:00Z"
  }
]
```

**Status Codes:**
- `200` - Success
- `404` - Service/environment not found
- `401` - Unauthorized

---

### Upload New Config

**Endpoint:** `POST /configs/upload`

**Content-Type:** `multipart/form-data`

**Form Fields:**
- `file` - The JSON or YAML configuration file
- `serviceName` - Name of the service
- `environment` - Target environment (dev/test/prod)
- `description` (optional) - Version description

**Example using cURL:**
```bash
curl -X POST http://localhost:8000/api/configs/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@config.json" \
  -F "serviceName=auth-service" \
  -F "environment=prod" \
  -F "description=Updated database settings"
```

**Response:**
```json
{
  "id": 4,
  "serviceName": "auth-service",
  "environment": "prod",
  "version": 4,
  "data": { ... },
  "isActive": false,
  "createdAt": "2024-01-16T09:00:00Z",
  "createdBy": "admin@example.com",
  "description": "Updated database settings"
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Validation error (invalid JSON/YAML)
- `401` - Unauthorized
- `413` - File too large

---

### Activate Config Version

**Endpoint:** `PUT /configs/{id}/activate`

**Path Parameters:**
- `id` - Config ID to activate

**Response:**
```json
{
  "id": 4,
  "serviceName": "auth-service",
  "environment": "prod",
  "version": 4,
  "isActive": true,
  "createdAt": "2024-01-16T09:00:00Z",
  "activatedAt": "2024-01-16T10:30:00Z"
}
```

**Status Codes:**
- `200` - Activated successfully
- `404` - Config not found
- `401` - Unauthorized
- `409` - Already active

**Note:** This endpoint automatically deactivates the previously active version for the same service/environment.

---

### Delete Config Version

**Endpoint:** `DELETE /configs/{id}`

**Path Parameters:**
- `id` - Config ID to delete

**Response:**
```json
{
  "success": true,
  "message": "Configuration deleted successfully"
}
```

**Status Codes:**
- `200` - Deleted successfully
- `404` - Config not found
- `401` - Unauthorized
- `409` - Cannot delete active config

**Note:** Active configurations cannot be deleted. Activate a different version first.

---

### Get Dashboard Stats

**Endpoint:** `GET /configs/stats`

**Response:**
```json
{
  "totalServices": 12,
  "totalConfigs": 45,
  "activeConfigs": 12,
  "configsByEnvironment": {
    "dev": 15,
    "test": 15,
    "prod": 15
  },
  "recentActivity": [
    {
      "action": "uploaded",
      "serviceName": "auth-service",
      "environment": "prod",
      "version": 4,
      "timestamp": "2024-01-16T09:00:00Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": "Additional error details (optional)"
}
```

### Common Error Codes

- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (e.g., duplicate, already active)
- `413` - Payload Too Large
- `422` - Unprocessable Entity (invalid file format)
- `500` - Internal Server Error

---

## Rate Limiting

API requests are limited to:
- **100 requests per minute** per user
- **1000 requests per hour** per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642339200
```

---

## File Upload Constraints

- **Max file size:** 5 MB
- **Supported formats:** JSON, YAML (.json, .yaml, .yml)
- **Validation:** Files are validated before storage
- **Encoding:** UTF-8 only

---

## Security

### Authentication
- JWT tokens expire after 24 hours
- Refresh tokens not implemented (re-login required)
- Tokens are invalidated on logout

### CORS
The API supports CORS for the following origins:
- `http://localhost:3000` (development)
- `https://your-production-domain.com`

### HTTPS
Production API must use HTTPS. HTTP requests are rejected.

---

## Webhooks (Future)

Coming soon: Webhook notifications for config changes.

---

## Support

For API issues:
- GitHub Issues: [repository-url]/issues
- Email: api-support@confighub.io
