# Precision Lab Auth Demo

Authentication app implemented with React + TypeScript frontend, Node.js/Express backend, and PostgreSQL.
Authentication app implemented with React + TypeScript frontend and Node.js/Express backend with JSON file storage.

## Features

- Email-based login (no username)
- User registration
- Password policy: minimum 8 chars, at least 1 uppercase, at least 1 number
- Password reset flow via email token (token generation and delivery hook)
- Password hashing with `bcryptjs`
- JWT token responses with unified success/error envelope format
- Rate limiting: 5 failed attempts before 1-hour account lockout
- Bcrypt cost factor 12 for password hashing
- JWT expiry: 24 hours

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express
- Storage: JSON file (data/users.json)

## Setup

1. Copy `.env.example` to `.env`.
2. Set `JWT_SECRET` in `.env`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run frontend and backend in development mode:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173`.

## Environment Variables

```env
PORT=4000
JWT_SECRET=replace-with-a-strong-secret
APP_BASE_URL=http://localhost:5173
```

## API Endpoints

- `POST /api/auth/register`
  - Body: `{ "email": "ada@example.com", "password": "Password1" }`
- `POST /api/auth/login`
  - Body: `{ "email": "ada@example.com", "password": "Password1" }`
- `POST /api/auth/forgot-password`
  - Body: `{ "email": "ada@example.com" }`
- `POST /api/auth/reset-password`
  - Body: `{ "token": "...", "newPassword": "NewPassword1" }`

## Response Format

Success:
```json
{ "success": true, "data": { "token": "...", "expiresIn": 3600 } }
```

Error:
```json
{ "success": false, "error": { "code": "AUTH_FAILED", "message": "..." } }
```
