# Sample API Responses — Auth Module

Base URL: `http://localhost:4000/api/v1`

## POST /auth/register

**Request**
```json
{
  "fullName": "Asha Rao",
  "email": "asha@drivecore.app",
  "password": "Str0ngPass!",
  "roleId": 2
}
```

**201 Created**
```json
{
  "success": true,
  "message": "Account created successfully",
  "data": {
    "id": 7,
    "email": "asha@drivecore.app",
    "fullName": "Asha Rao",
    "role": "Fleet Manager"
  }
}
```

**409 Conflict** (duplicate email)
```json
{
  "success": false,
  "message": "An account with this email already exists"
}
```

---

## POST /auth/login

**Request**
```json
{ "email": "asha@drivecore.app", "password": "Str0ngPass!" }
```

**200 OK** (refresh token also set as an httpOnly cookie `drivecore_rt`)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 7,
      "email": "asha@drivecore.app",
      "fullName": "Asha Rao",
      "role": "Fleet Manager"
    }
  }
}
```

**401 Unauthorized**
```json
{ "success": false, "message": "Invalid email or password" }
```

---

## POST /auth/refresh

**200 OK**
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": { "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
}
```

**401 Unauthorized**
```json
{ "success": false, "message": "Refresh token is no longer valid" }
```

---

## GET /auth/me

Header: `Authorization: Bearer <accessToken>`

**200 OK**
```json
{
  "success": true,
  "message": "Current user profile",
  "data": {
    "id": 7,
    "email": "asha@drivecore.app",
    "fullName": "Asha Rao",
    "role": "Fleet Manager"
  }
}
```

**401 Unauthorized**
```json
{ "success": false, "message": "Missing or malformed Authorization header" }
```

---

## POST /auth/forgot-password

**Request**
```json
{ "email": "asha@drivecore.app" }
```

**200 OK** (always this shape, regardless of whether the email exists — avoids
email enumeration)
```json
{ "success": true, "message": "If that email is registered, a reset link has been sent", "data": null }
```

---

## POST /auth/reset-password

**Request**
```json
{ "token": "9f1c2e...raw-token...", "newPassword": "NewStr0ng!" }
```

**200 OK**
```json
{ "success": true, "message": "Password reset successfully", "data": null }
```

**400 Bad Request**
```json
{ "success": false, "message": "Reset token is invalid or has expired" }
```

---

## Validation error shape (any endpoint)

**400 Bad Request**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "path": "email", "message": "Invalid email" },
    { "path": "password", "message": "Password must contain an uppercase letter" }
  ]
}
```

## Forbidden (role mismatch, applies once other modules use `authorize()`)

**403 Forbidden**
```json
{ "success": false, "message": "Role 'Driver' is not permitted to perform this action" }
```
