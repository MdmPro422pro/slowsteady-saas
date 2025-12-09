# Stripe Webhook Quick Setup

## 🚀 Production Deployment Steps

### 1. Go to Stripe Dashboard
```
https://dashboard.stripe.com/webhooks
```

### 2. Add New Endpoint
- **URL**: `https://api.yourdomain.com/api/stripe/webhook`
- **Events**: 
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`

### 3. Copy Signing Secret
It looks like: `whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 4. Add to Production .env
```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. Restart Server
```bash
pm2 restart backend
# or
docker-compose restart backend
# or
systemctl restart your-app
```

### 6. Test with Stripe CLI
```bash
stripe listen --forward-to https://api.yourdomain.com/api/stripe/webhook --live
stripe trigger checkout.session.completed --live
```

## ✅ Verification Checklist

- [ ] Webhook endpoint returns 200 status
- [ ] Signature verification passes
- [ ] Events logged in server console
- [ ] Memberships saved to database
- [ ] Stripe Dashboard shows successful deliveries

## 🔧 Local Development

```bash
# Terminal 1: Start local server
pnpm run dev

# Terminal 2: Listen for webhooks
stripe listen --forward-to localhost:4000/api/stripe/webhook

# Terminal 3: Trigger test events
stripe trigger checkout.session.completed
```

Copy the `whsec_` secret from Terminal 2 into your local `.env`:
```env
STRIPE_WEBHOOK_SECRET=whsec_test_from_stripe_cli
```

## 📋 Test Cards

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Expiry: Any future date | CVC: Any 3 digits | ZIP: Any 5 digits

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| 401/403 Error | Wrong `STRIPE_WEBHOOK_SECRET` |
| 504 Timeout | Handler too slow (should be < 5s) |
| Duplicate events | Normal - use idempotent operations |
| Missing events | Check Stripe Dashboard logs |

## 📊 Monitor Webhooks

**Stripe Dashboard**: Developers > Webhooks > Your Endpoint > View logs

**Server Logs**: Look for emoji indicators:
- ✅ Success
- ❌ Error
- 💳 Payment
- 📋 Event

## 🔐 Security

- ✅ Always verify signatures
- ✅ Use HTTPS in production
- ✅ Keep secrets in environment variables
- ❌ Never commit secrets to git
- ❌ Never log complete webhook secrets
