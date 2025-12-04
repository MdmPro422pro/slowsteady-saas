# Authentication Setup

This document describes the authentication system implemented in Slowsteady.

## Features

- ✅ **JWT Authentication**: Access and refresh tokens
- ✅ **User Signup/Login**: Email and password authentication
- ✅ **Two-Factor Authentication (2FA)**: TOTP-based using authenticator apps
- ✅ **OAuth2 Ready**: Prepared for Google and GitHub OAuth (requires configuration)
- ✅ **Secure Password Hashing**: Using bcryptjs
- ✅ **Protected Routes**: Middleware for authenticating API endpoints

## Backend Implementation

### Database Schema (Prisma)

The `User` model includes:
- Email and password fields
- OAuth provider fields (Google, GitHub)
- 2FA fields (secret, enabled status)
- Metadata (email verified, timestamps)

### API Endpoints

#### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Login with email/password
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user info (protected)
- `POST /auth/logout` - Logout (protected)

#### Two-Factor Authentication
- `POST /auth/2fa/setup` - Generate 2FA secret and QR code (protected)
- `POST /auth/2fa/verify` - Verify and enable 2FA (protected)
- `POST /auth/2fa/login-verify` - Verify 2FA code during login
- `POST /auth/2fa/disable` - Disable 2FA (protected)

## Frontend Components

- `Login.tsx` - Login form with 2FA support
- `Signup.tsx` - User registration form
- `TwoFactorVerify.tsx` - 2FA code verification during login
- `TwoFactorSetup.tsx` - 2FA enrollment with QR code
- `api.ts` - API client with token management and auto-refresh

## Setup Instructions

### 1. Database Setup

```bash
# Start Docker services
docker-compose up -d

# Run Prisma migrations
cd packages/backend
pnpm prisma:migrate

# Generate Prisma client
pnpm prisma:generate
```

### 2. Environment Variables

Copy `.env.example` to `.env` in the backend package and update:

```env
JWT_SECRET=your-strong-random-secret-here
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/slowsteady
```

### 3. Run Development Servers

```bash
# From root directory
pnpm dev
```

This starts:
- Backend API on `http://localhost:4000`
- Frontend on `http://localhost:5173`

## Using 2FA

### For Users

1. **Login** to your account
2. Navigate to **Account Settings**
3. Click **Enable 2FA**
4. **Scan QR code** with authenticator app (Google Authenticator, Authy, etc.)
5. **Enter verification code** to confirm
6. Next login will require the 2FA code

### Testing 2FA

1. Create an account via signup
2. Use the API or frontend to call `/auth/2fa/setup`
3. Scan QR code with an authenticator app
4. Verify with the generated code
5. Logout and login again - you'll be prompted for 2FA

## Security Best Practices

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with expiration (7 days access, 30 days refresh)
- ✅ TOTP with 2-window tolerance for clock drift
- ✅ Protected routes require valid JWT
- ✅ Token refresh on 401 responses

## OAuth2 Integration (Future)

The backend is prepared for OAuth2 providers. To enable:

1. Register your app with Google/GitHub
2. Add credentials to `.env`:
   ```env
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback
   ```
3. Implement OAuth routes using passport strategies (example code ready)

## Next Steps

- [ ] Add email verification
- [ ] Implement password reset flow
- [ ] Add OAuth2 routes for Google and GitHub
- [ ] Add rate limiting for auth endpoints
- [ ] Implement session management with Redis
- [ ] Add audit logs for authentication events
