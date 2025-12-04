# Quick Start Guide - Authentication

## Prerequisites

- Node.js 20+
- pnpm installed
- Docker and Docker Compose

## Setup (5 minutes)

### 1. Clone and Install

```bash
git clone https://github.com/Mdmpro422pro/Slowsteady.git
cd Slowsteady
pnpm -w install
```

### 2. Start Services

```bash
docker-compose up -d
```

This starts Postgres and Redis.

### 3. Configure Backend

```bash
cd packages/backend
cp .env.example .env
```

Edit `.env` and set a strong `JWT_SECRET`:
```env
JWT_SECRET=your-super-secret-random-string-here-change-this
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/slowsteady
```

### 4. Run Database Migrations

```bash
pnpm prisma:migrate
pnpm prisma:generate
cd ../..
```

### 5. Configure Frontend

```bash
cd packages/frontend
cp .env.example .env
cd ../..
```

### 6. Start Development Servers

```bash
pnpm dev
```

## Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

## Test Authentication

### 1. Create an Account

Open http://localhost:5173 and:
1. Click "Sign up"
2. Enter email, password, and name
3. Click "Sign Up"

### 2. Login

1. Enter your credentials
2. Click "Login"

### 3. Enable 2FA (Optional)

1. Navigate to account settings
2. Click "Enable 2FA"
3. Scan QR code with Google Authenticator or Authy
4. Enter the 6-digit code
5. 2FA is now enabled!

### 4. Test 2FA Login

1. Logout
2. Login again
3. Enter your 2FA code when prompted

## API Testing with curl

### Signup
```bash
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "name": "John Doe"
  }'
```

### Login
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

Response includes `accessToken` and `refreshToken`.

### Get Current User
```bash
curl -X GET http://localhost:4000/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Setup 2FA
```bash
curl -X POST http://localhost:4000/auth/2fa/setup \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

Returns QR code data URL and secret.

## Troubleshooting

### Database Connection Error
- Ensure Docker is running: `docker ps`
- Check Postgres is up: `docker-compose logs postgres`
- Verify DATABASE_URL in `.env`

### Prisma Client Not Found
- Run: `cd packages/backend && pnpm prisma:generate`

### Port Already in Use
- Change PORT in backend `.env` (default: 4000)
- Change port in frontend `vite.config.ts` (default: 5173)

### 2FA Not Working
- Ensure phone/computer clock is synchronized
- TOTP is time-based and requires accurate time

## Next Steps

- Read [AUTHENTICATION.md](./AUTHENTICATION.md) for complete documentation
- Check [AUTH_IMPLEMENTATION_SUMMARY.md](./AUTH_IMPLEMENTATION_SUMMARY.md) for technical details
- Explore the API endpoints at http://localhost:4000
- Customize the frontend components in `packages/frontend/src/components`

## Useful Commands

```bash
# Install dependencies
pnpm -w install

# Start dev servers (frontend + backend)
pnpm dev

# Start Docker services
docker-compose up -d

# Stop Docker services
docker-compose down

# View Docker logs
docker-compose logs -f

# Reset database (WARNING: deletes all data)
cd packages/backend
pnpm prisma migrate reset

# Open Prisma Studio (database GUI)
pnpm prisma:studio

# Build for production
pnpm build

# Start production backend
pnpm --filter backend start
```

## Support

- Report issues on GitHub
- Check documentation in `docs/` folder
- Review code comments for implementation details

Happy coding! 🚀
