# Quickstart: User Authentication System

**Purpose**: Get the auth system running locally for development and testing.  
**Target**: Linux/macOS development machine with Node.js 18+ and PostgreSQL 14+ installed.

## Prerequisites

- Node.js 18+ (verify: `node --version`)
- npm 9+ (verify: `npm --version`)
- PostgreSQL 14+ (verify: `psql --version`)
- Git (verify: `git --version`)

## Setup

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/your-org/speckit-lab.git
cd speckit-lab
npm install
```

### 2. Set Up PostgreSQL Database

Create a development database and user:

```bash
psql -U postgres -c "CREATE DATABASE auth_dev;"
psql -U postgres -c "CREATE USER auth_user WITH PASSWORD 'dev_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE auth_dev TO auth_user;"
```

Verify the connection:

```bash
psql -U auth_user -d auth_dev -h localhost
```

### 3. Configure Environment

Copy the example configuration:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your local settings:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=auth_dev
DB_USER=auth_user
DB_PASSWORD=dev_password

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRY_HOURS=24

# Bcrypt
BCRYPT_ROUNDS=10

# Email (optional; defaults to in-memory queue for testing)
EMAIL_PROVIDER=test
# EMAIL_PROVIDER=smtp
# SMTP_HOST=localhost
# SMTP_PORT=1025
# SMTP_USER=test
# SMTP_PASSWORD=test
RESET_EMAIL_FROM=noreply@auth.example.com

# API
API_PORT=3000
NODE_ENV=development
```

### 4. Run Database Migrations

Apply schema migrations:

```bash
npm run migrate:up
```

Verify tables were created:

```bash
psql -U auth_user -d auth_dev -h localhost -c "\dt"
```

You should see: `users`, `sessions`, `reset_requests`, `auth_events`.

### 5. Start the Application

```bash
npm run dev
```

You should see:

```
✓ Server running on http://localhost:3000
✓ Database connected to auth_dev
```

## Test the API

### Register a New User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "MyP@ssw0rd123"
  }'
```

Expected response (201):

```json
{
  "id": 1,
  "email": "testuser@example.com",
  "created_at": "2026-05-09T10:30:00Z"
}
```

### Log In and Get JWT

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "MyP@ssw0rd123"
  }'
```

Expected response (200):

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 86400,
  "user": {
    "id": 1,
    "email": "testuser@example.com"
  }
}
```

### Access a Protected Route (Example)

```bash
curl -X GET http://localhost:3000/api/protected \
  -H "Authorization: Bearer <access_token>"
```

Replace `<access_token>` with the token from the login response.

### Request Password Reset

```bash
curl -X POST http://localhost:3000/auth/request-reset \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com"
  }'
```

Expected response (202):

```json
{
  "message": "If an account exists with this email, a reset link will be sent.",
  "status": "pending"
}
```

In development mode with `EMAIL_PROVIDER=test`, check logs for the reset link (format: `/auth/reset-password?token=...`).

## Run Tests

### Unit Tests

```bash
npm run test:unit
```

### Integration Tests

```bash
npm run test:integration
```

### All Tests with Coverage

```bash
npm run test:coverage
```

Coverage report will be generated in `coverage/` directory. Open `coverage/index.html` in a browser to view the report.

**Target**: ≥80% line coverage for `src/services/`, `src/models/`.

## Development Workflow

1. **Make code changes** in `src/`.
2. **Run tests** before committing:
   ```bash
   npm run test:unit
   npm run test:integration
   ```
3. **Type-check** TypeScript:
   ```bash
   npm run type-check
   ```
4. **Lint** code:
   ```bash
   npm run lint
   ```
5. **Format** code (auto-fix style):
   ```bash
   npm run format
   ```
6. **Commit** changes with meaningful message:
   ```bash
   git add .
   git commit -m "feat: add two-factor authentication"
   ```

## Debugging

### Enable Verbose Logging

Set log level to `debug`:

```bash
LOG_LEVEL=debug npm run dev
```

### Inspect Database

```bash
psql -U auth_user -d auth_dev -h localhost

# List all users
SELECT id, email, status, failed_login_attempts FROM users;

# List all active sessions
SELECT id, user_id, jti, expires_at, revoked_at FROM sessions WHERE revoked_at IS NULL;

# List pending reset requests
SELECT id, user_id, expires_at, used_at FROM reset_requests WHERE used_at IS NULL;
```

### Use a REST Client (VSCode Extension or Postman)

Import the OpenAPI spec from `contracts/auth-api.openapi.yaml` into Postman or use VSCode REST Client extension:

```http
### Register
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "email": "dev@example.com",
  "password": "DevP@ssw0rd123"
}

### Login
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "dev@example.com",
  "password": "DevP@ssw0rd123"
}
```

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution**: Ensure PostgreSQL is running and credentials in `.env.local` are correct.

```bash
# Start PostgreSQL (macOS with Homebrew)
brew services start postgresql

# Start PostgreSQL (Linux with systemd)
sudo systemctl start postgresql
```

### Password Policy Rejection

```json
{
  "error": "invalid_password",
  "message": "Password must contain at least 12 characters, uppercase, lowercase, number, and symbol"
}
```

**Solution**: Use a password like `MyP@ssw0rd123` (12+ chars, mixed case, number, symbol).

### Duplicate Email Error

```json
{
  "error": "duplicate_email",
  "message": "Email already registered"
}
```

**Solution**: Use a unique email or reset the database:

```bash
npm run migrate:down
npm run migrate:up
```

### JWT Expired

```json
{
  "error": "token_expired",
  "message": "Your session has expired. Please log in again."
}
```

**Solution**: Log in again to get a fresh token. In development, sessions expire 24 hours after issuance.

## Next Steps

- **User Acceptance Testing**: Follow the 3 user stories in `spec.md`.
- **Integration Testing**: Test against existing protected features (expects `Authorization: Bearer <JWT>` header).
- **Deployment**: Once PR is approved, deploy to staging environment.

## Getting Help

- **OpenAPI Spec**: See `contracts/auth-api.openapi.yaml` for full endpoint documentation.
- **Data Model**: See `data-model.md` for database schema and entity relationships.
- **Issues**: Report bugs in GitHub Issues with: environment (Node/PG versions), error message, and reproduction steps.

Happy coding!
