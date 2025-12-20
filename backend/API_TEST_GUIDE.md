# Yearbook Backend API Testing Guide

## 🚀 Quick Start

1. **Start Backend:** `cd backend && npm run dev`
2. **Start MongoDB:** `"C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"`
3. **Use Postman** or **curl commands** below

## 📋 Test Commands (Copy & Paste)

### 1. Register Admin User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123",
    "fullName": "Admin User",
    "role": "admin"
  }'
```

### 2. Register Regular User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "password123",
    "fullName": "Regular User"
  }'
```

### 3. Login (Copy token from response)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123"
  }'
```

### 4. Get Current User (Replace TOKEN)

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 5. Get All Profiles

```bash
curl -X GET http://localhost:5000/api/profiles
```

### 6. Update Profile (Replace TOKEN)

```bash
curl -X PUT http://localhost:5000/api/profiles/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Updated bio",
    "location": "Test City"
  }'
```

### 7. Create Event (Replace TOKEN)

```bash
curl -X POST http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Reunion",
    "description": "A test event",
    "eventDate": "2025-01-15T10:00:00.000Z",
    "location": "Test Venue",
    "eventType": "reunion"
  }'
```

### 8. Get Events

```bash
curl -X GET http://localhost:5000/api/events
```

### 9. Create Job (Replace TOKEN)

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineer",
    "company": "Test Corp",
    "description": "Test job description",
    "location": "Remote",
    "jobType": "full-time",
    "domain": "Technology",
    "applyUrl": "https://example.com/apply"
  }'
```

### 10. Get Jobs

```bash
curl -X GET http://localhost:5000/api/jobs
```

### 11. Create Story (Replace TOKEN)

```bash
curl -X POST http://localhost:5000/api/stories \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Story",
    "content": "This is a test story with enough content to pass validation requirements.",
    "excerpt": "Test story excerpt",
    "tags": ["test", "api"]
  }'
```

### 12. Get Stories

```bash
curl -X GET http://localhost:5000/api/stories
```

### 13. Get Platform Stats

```bash
curl -X GET http://localhost:5000/api/stats
```

### 14. Admin: Get Dashboard Stats (Replace TOKEN)

```bash
curl -X GET http://localhost:5000/api/admin/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 15. Admin: Approve User (Replace TOKEN & USER_ID)

```bash
curl -X PUT http://localhost:5000/api/profiles/USER_ID_HERE/approve \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🧪 Postman Collection

### Import this JSON into Postman:

```json
{
  "info": {
    "name": "Yearbook Backend API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:5000/api"
    },
    {
      "key": "token",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register Admin",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"admin@test.com\",\"password\":\"password123\",\"fullName\":\"Admin User\",\"role\":\"admin\"}"
            },
            "url": {
              "raw": "{{base_url}}/auth/register",
              "host": ["{{base_url}}"],
              "path": ["auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    const response = pm.response.json();",
                  "    pm.collectionVariables.set('token', response.token);",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"admin@test.com\",\"password\":\"password123\"}"
            },
            "url": {
              "raw": "{{base_url}}/auth/login",
              "host": ["{{base_url}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Profiles",
      "item": [
        {
          "name": "Get Profiles",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/profiles",
              "host": ["{{base_url}}"],
              "path": ["profiles"]
            }
          }
        }
      ]
    },
    {
      "name": "Events",
      "item": [
        {
          "name": "Get Events",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/events",
              "host": ["{{base_url}}"],
              "path": ["events"]
            }
          }
        },
        {
          "name": "Create Event",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\"title\":\"Test Event\",\"description\":\"Test description\",\"eventDate\":\"2025-01-15T10:00:00.000Z\",\"location\":\"Test Venue\",\"eventType\":\"reunion\"}"
            },
            "url": {
              "raw": "{{base_url}}/events",
              "host": ["{{base_url}}"],
              "path": ["events"]
            }
          }
        }
      ]
    },
    {
      "name": "Jobs",
      "item": [
        {
          "name": "Get Jobs",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/jobs",
              "host": ["{{base_url}}"],
              "path": ["jobs"]
            }
          }
        }
      ]
    },
    {
      "name": "Stories",
      "item": [
        {
          "name": "Get Stories",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/stories",
              "host": ["{{base_url}}"],
              "path": ["stories"]
            }
          }
        }
      ]
    },
    {
      "name": "Stats",
      "item": [
        {
          "name": "Get Platform Stats",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/stats",
              "host": ["{{base_url}}"],
              "path": ["stats"]
            }
          }
        }
      ]
    }
  ]
}
```

## 📊 Expected Results

✅ **Successful responses** return JSON data
✅ **Authentication errors** return `401 Unauthorized`
✅ **Validation errors** return `400 Bad Request` with error messages
✅ **Server errors** return `500 Internal Server Error`

## 🔍 Troubleshooting

- **Connection refused:** Check if backend is running on port 5000
- **MongoDB errors:** Ensure MongoDB is running
- **Auth errors:** Make sure you're using a valid JWT token
- **CORS errors:** Backend allows all origins by default

## 🎯 Next Steps

1. ✅ **API Testing Complete**
2. 🔄 **Update Frontend Components**
3. 🔄 **Deploy to Production**
4. 🔄 **Add Advanced Features**
