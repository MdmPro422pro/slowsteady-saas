# Stripe Webhook Configuration Guide

This guide walks you through setting up Stripe webhooks for production payment processing.

## Overview

Webhooks allow Stripe to notify your server about payment events in real-time. This is critical for:
- Confirming successful payments
- Handling failed payments
- Processing refunds
- Managing subscriptions

## Prerequisites

- Stripe account with API keys
- Production server with HTTPS (required by Stripe)
- Access to server environment variables

---

## Local Development Setup

### 1. Install Stripe CLI

Download from: https://stripe.com/docs/stripe-cli

```bash
# Windows (with Scoop)
scoop install stripe

# macOS (with Homebrew)
brew install stripe/stripe-cli/stripe

# Linux
# Download from https://github.com/stripe/stripe-cli/releases
```

### 2. Login to Stripe CLI

```bash
stripe login
```

This will open your browser to authorize the CLI.

### 3. Forward Events to Local Server

```bash
stripe listen --forward-to localhost:4000/api/stripe/webhook
```

The CLI will output a webhook signing secret like:
```
whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. Add Secret to .env

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 5. Test the Webhook

```bash
# Trigger a test payment event
stripe trigger checkout.session.completed
```

Check your server logs to confirm the event was received.

---

## Production Setup

### 1. Deploy Your Application

Ensure your backend is deployed and accessible via HTTPS:
- Example: `https://api.yourdomain.com`
- The webhook endpoint will be: `https://api.yourdomain.com/api/stripe/webhook`

### 2. Configure Webhook in Stripe Dashboard

1. **Go to Stripe Dashboard**
   - https://dashboard.stripe.com/webhooks (for production)
   - https://dashboard.stripe.com/test/webhooks (for testing)

2. **Click "Add endpoint"**

3. **Enter Endpoint Details**
   - **Endpoint URL**: `https://api.yourdomain.com/api/stripe/webhook`
   - **Description**: "Production payment webhook"
   - **API Version**: Latest version (default)

4. **Select Events to Listen To**

   Select these critical events:
   - ✅ `checkout.session.completed` - Payment completed
   - ✅ `payment_intent.succeeded` - Payment successful
   - ✅ `payment_intent.payment_failed` - Payment failed
   - ✅ `customer.subscription.created` (if using subscriptions)
   - ✅ `customer.subscription.updated` (if using subscriptions)
   - ✅ `customer.subscription.deleted` (if using subscriptions)

5. **Click "Add endpoint"**

### 3. Copy Webhook Signing Secret

After creating the endpoint, Stripe will show you the signing secret:
- It will look like: `whsec_xxxxxxxxxxxxxxxxxxxxxxxxxx`
- This is different from your API keys!

### 4. Add to Production Environment Variables

Add the secret to your production server's environment variables:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Important Security Notes:**
- Never commit webhook secrets to git
- Use different secrets for test and production
- Rotate secrets if compromised

### 5. Restart Your Server

Restart your backend server to load the new environment variable:

```bash
# Example with PM2
pm2 restart backend

# Example with systemd
sudo systemctl restart your-app-name

# Example with Docker
docker-compose restart backend
```

---

## Testing Production Webhook

### Method 1: Use Stripe CLI (Recommended)

```bash
# Forward production events to your deployed server
stripe listen --forward-to https://api.yourdomain.com/api/stripe/webhook --live

# In another terminal, trigger a test event
stripe trigger checkout.session.completed --live
```

### Method 2: Test with Real Payment

1. Go to your frontend: `https://yourdomain.com`
2. Purchase a membership tier
3. Complete the checkout with a test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

4. Check your server logs for webhook confirmation:
```
✅ Webhook signature verified: checkout.session.completed
💳 Payment successful: { sessionId: 'cs_test_...', tier: 'pro', ... }
✅ Membership saved to database: { id: '...', tier: 'pro', ... }
```

### Method 3: Use Stripe Dashboard

1. Go to Developers > Webhooks in Stripe Dashboard
2. Click on your webhook endpoint
3. Click "Send test webhook"
4. Select `checkout.session.completed`
5. Click "Send test webhook"

---

## Monitoring Webhooks

### Stripe Dashboard

View webhook delivery attempts and responses:
1. Go to Developers > Webhooks
2. Click on your endpoint
3. View recent deliveries with:
   - HTTP status codes
   - Response times
   - Error messages (if any)

### Server Logs

The webhook handler logs detailed information:

```typescript
// Successful events
✅ Webhook signature verified: checkout.session.completed
💳 Payment successful: { sessionId, tier, walletAddress, amount }
✅ Membership saved to database: { id, tier, walletAddress }

// Failed events
❌ Webhook signature verification failed: Invalid signature
❌ Database error saving membership: { error, sessionId }
❌ Error processing webhook event: { eventType, eventId, error }
```

---

## Troubleshooting

### Problem: Webhook signature verification fails

**Cause**: Wrong signing secret or body parser interfering

**Solution**:
1. Verify the `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
2. Ensure raw body parser is used (already configured in our code):
   ```typescript
   app.use('/api/stripe/webhook', express.raw({ type: 'application/json' }));
   ```
3. Don't use `express.json()` before the webhook route

### Problem: Webhook times out (504 Gateway Timeout)

**Cause**: Handler takes too long to respond

**Solution**:
1. Our handler responds quickly (< 1 second)
2. Database writes are non-blocking
3. Failed DB writes don't fail the webhook (logged for manual reconciliation)

### Problem: Events received multiple times

**Cause**: Server didn't respond with 200, so Stripe retried

**Solution**:
1. Ensure webhook returns 200 status code quickly
2. Use idempotency with `upsert()` to handle duplicates
3. Already implemented in our code

### Problem: Missing events

**Cause**: Server was down or webhook not configured

**Solution**:
1. Check Stripe Dashboard > Webhooks > View logs
2. Manually reconcile by calling `/verify-session/:sessionId`
3. Set up monitoring/alerts for failed webhooks

---

## Security Best Practices

### ✅ DO:
- Always verify webhook signatures
- Use HTTPS in production
- Keep signing secrets in environment variables
- Log all webhook events for auditing
- Use idempotent operations
- Return 200 status quickly (< 5 seconds)

### ❌ DON'T:
- Don't trust webhook data without signature verification
- Don't expose webhook secrets in code or logs
- Don't perform long-running operations before responding
- Don't use the same secret for test and production

---

## Webhook Endpoint Details

### URL Structure
```
POST https://api.yourdomain.com/api/stripe/webhook
```

### Headers
```
Content-Type: application/json
Stripe-Signature: t=timestamp,v1=signature
```

### Response Format
```json
{
  "received": true,
  "eventId": "evt_1234567890"
}
```

---

## Environment Variables Reference

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_... # Test mode key
STRIPE_SECRET_KEY=sk_live_... # Production mode key

# Webhook Secrets (different for test and production)
STRIPE_WEBHOOK_SECRET=whsec_test_... # Local/test webhook secret
STRIPE_WEBHOOK_SECRET=whsec_...      # Production webhook secret

# Frontend URL (for redirect URLs)
FRONTEND_URL=http://localhost:5173   # Local
FRONTEND_URL=https://yourdomain.com  # Production
```

---

## Stripe CLI Quick Reference

```bash
# Login
stripe login

# Listen to webhooks locally
stripe listen --forward-to localhost:4000/api/stripe/webhook

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed

# View recent events
stripe events list --limit 10

# Get event details
stripe events retrieve evt_1234567890

# View webhook endpoints
stripe webhook-endpoints list

# Test webhook endpoint
stripe webhook-endpoints test we_1234567890 --event checkout.session.completed
```

---

## Additional Resources

- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Best Practices for Webhook Security](https://stripe.com/docs/webhooks/best-practices)
- [Testing Webhooks](https://stripe.com/docs/webhooks/test)

---

## Support

If you encounter issues:
1. Check server logs for detailed error messages
2. Review Stripe Dashboard > Webhooks > View logs
3. Test locally with Stripe CLI
4. Contact Stripe Support if needed

## Quick Deployment Checklist

- [ ] Backend deployed with HTTPS
- [ ] Webhook endpoint accessible: `https://api.yourdomain.com/api/stripe/webhook`
- [ ] Webhook created in Stripe Dashboard
- [ ] Events selected (checkout.session.completed, payment_intent.*)
- [ ] `STRIPE_WEBHOOK_SECRET` added to production environment
- [ ] Server restarted to load new environment variable
- [ ] Test payment completed successfully
- [ ] Webhook logs show successful event processing
- [ ] Database shows new membership record
- [ ] Monitoring/alerts configured for failed webhooks
