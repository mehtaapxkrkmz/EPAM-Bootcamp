# API Reference

## POST /auth/register

Request:
```json
{
  "email": "user@example.com",
  "password": "StrongP@ssw0rd!"
}
```

Response 201:
```json
{
  "id": 1,
  "email": "user@example.com",
  "created_at": "2026-05-09T10:30:00Z"
}
```

Curl:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"StrongP@ssw0rd!"}'
```

## POST /auth/login

Request:
```json
{
  "email": "user@example.com",
  "password": "StrongP@ssw0rd!"
}
```

Response 200:
```json
{
  "access_token": "<jwt>",
  "token_type": "Bearer",
  "expires_in": 86400,
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

Curl:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"StrongP@ssw0rd!"}'
```

## POST /auth/logout

Requires `Authorization: Bearer <jwt>`.

Response 204: no body.

Curl:
```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Authorization: Bearer <jwt>"
```

## POST /auth/request-reset

Request:
```json
{
  "email": "user@example.com"
}
```

Response 202:
```json
{
  "message": "If an account exists with this email, a reset link will be sent.",
  "status": "pending"
}
```

Curl:
```bash
curl -X POST http://localhost:3000/auth/request-reset \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

## POST /auth/reset-password

Request:
```json
{
  "reset_token": "<token>",
  "new_password": "NewStrongP@ssw0rd1!"
}
```

Response 200:
```json
{
  "message": "Password successfully reset. Please log in with your new password.",
  "user_id": 1
}
```

Curl:
```bash
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"reset_token":"<token>","new_password":"NewStrongP@ssw0rd1!"}'
```
