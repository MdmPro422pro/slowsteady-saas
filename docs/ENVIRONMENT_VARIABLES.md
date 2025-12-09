# Backend Environment Variables

This file documents all environment variables needed for the backend server.

## Database

```env
# PostgreSQL Connection
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/slowsteady

# Redis (optional, for caching/sessions)
REDIS_URL=redis://localhost:6379
```

## Server Configuration

```env
# Server port
PORT=4000

# Allowed CORS origins (comma-separated)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://yourdomain.com

# Frontend URL for redirects
FRONTEND_URL=http://localhost:5173
```

## Authentication

```env
# JWT secret for token signing (change in production!)
JWT_SECRET=SlowSteadySecureRandomKey2025!ChangeMeInProduction@#$%
```

## OAuth Providers (Optional)

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:4000/auth/github/callback
```

## Stripe Payment Processing

```env
# Stripe API Keys
# Get from: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_test_51xxxxxxxxxxxxxxxxxxxxx  # Test mode
STRIPE_SECRET_KEY=sk_live_51xxxxxxxxxxxxxxxxxxxxx  # Production mode

# Stripe Webhook Secret
# Get from: https://dashboard.stripe.com/webhooks
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxx
```

### Setting up Stripe Webhook Secret

#### For Local Development:
1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run: `stripe listen --forward-to localhost:4000/api/stripe/webhook`
3. Copy the webhook signing secret (starts with `whsec_`)
4. Add to `.env`

#### For Production:
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter: `https://api.yourdomain.com/api/stripe/webhook`
4. Select events: `checkout.session.completed`, `payment_intent.*`
5. Copy the signing secret
6. Add to production environment variables

See `docs/STRIPE_WEBHOOK_SETUP.md` for detailed instructions.

## External APIs

```env
# Pinata IPFS (for NFT/file storage)
PINATA_API_KEY=your-api-key
PINATA_API_SECRET=your-api-secret
PINATA_JWT=your-jwt-token

# CoinMarketCap (for crypto prices)
COINMARKETCAP_API_KEY=your-api-key
```

## Security Best Practices

### ✅ DO:
- Use strong, random values for secrets
- Rotate secrets regularly
- Use different values for development and production
- Store secrets in environment variables, never in code
- Use secret management tools in production (AWS Secrets Manager, etc.)

### ❌ DON'T:
- Commit `.env` files to git (already in `.gitignore`)
- Share secrets via email or chat
- Use the same secrets across environments
- Log secret values

## Environment-Specific Files

```
.env                 # Local development (not committed)
.env.example         # Template with dummy values (committed)
.env.production      # Production values (not committed, deployed separately)
.env.test            # Test environment (not committed)
```

## Verifying Configuration

Run this to check if all required variables are set:

```bash
# From backend directory
npm run check-env
# or
ts-node src/scripts/checkEnv.ts
```

## Production Deployment

### Using Docker:
```bash
docker run -p 4000:4000 \
  -e DATABASE_URL="postgresql://..." \
  -e STRIPE_SECRET_KEY="sk_live_..." \
  -e STRIPE_WEBHOOK_SECRET="whsec_..." \
  your-image
```

### Using PM2:
```bash
# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'backend',
    script: 'dist/index.js',
    env_production: {
      NODE_ENV: 'production',
      PORT: 4000,
      DATABASE_URL: process.env.DATABASE_URL,
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    }
  }]
}
```

### Using Environment Files:
```bash
# Load from file
export $(cat .env.production | xargs)
npm start
```

## Testing Configuration

```bash
# Test database connection
npm run db:test

# Test Stripe integration
npm run stripe:test

# Test webhook locally
npm run webhook:test
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection fails | Check `DATABASE_URL` format and credentials |
| Stripe webhook fails | Verify `STRIPE_WEBHOOK_SECRET` matches dashboard |
| CORS errors | Add frontend URL to `ALLOWED_ORIGINS` |
| OAuth redirect fails | Update callback URLs in provider settings |

## Getting API Keys

- **Stripe**: https://dashboard.stripe.com/apikeys
- **Pinata**: https://app.pinata.cloud/keys
- **CoinMarketCap**: https://pro.coinmarketcap.com/account
- **Google OAuth**: https://console.cloud.google.com/apis/credentials
- **GitHub OAuth**: https://github.com/settings/developers

## Support

For questions about environment setup:
1. Check the documentation in `/docs`
2. Review example configurations in `.env.example`
3. Test with `npm run check-env`
