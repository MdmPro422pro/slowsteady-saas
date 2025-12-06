# Stripe Payment Integration for Community Chat

## Overview
This document explains how to set up the Stripe payment integration for the $5 community chat access fee.

## Frontend Setup (Already Complete ✅)
- Installed `@stripe/stripe-js`
- Payment modal in `CommunityPage.tsx`
- Wallet connection check
- Payment status verification

## Backend Setup (TODO)

### 1. Install Stripe SDK
```bash
cd packages/backend
npm install stripe
# or
pnpm add stripe
```

### 2. Environment Variables
Add to your `.env` file:
```env
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLIC_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

Add to frontend `.env`:
```env
VITE_STRIPE_PUBLIC_KEY=pk_test_YOUR_PUBLIC_KEY
```

### 3. Create Checkout Session Endpoint

**File: `packages/backend/src/routes/stripe.ts`**

```typescript
import express from 'express';
import Stripe from 'stripe';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// Create Stripe Checkout Session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { walletAddress, amount } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'MDMPro Community Chat Access',
              description: 'Lifetime access to premium community chat',
            },
            unit_amount: amount, // $5.00 = 500 cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/community?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/community?payment=cancelled`,
      client_reference_id: walletAddress, // Link payment to wallet
      metadata: {
        walletAddress: walletAddress,
        service: 'community_chat',
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: 'Payment session creation failed' });
  }
});

export default router;
```

### 4. Webhook Handler (to verify payments)

**File: `packages/backend/src/routes/webhook.ts`**

```typescript
import express from 'express';
import Stripe from 'stripe';
import { db } from '../db'; // Your database connection

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// Stripe webhook endpoint (raw body needed)
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      // Handle successful payment
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const walletAddress = session.client_reference_id || session.metadata?.walletAddress;
        
        if (walletAddress) {
          // Store payment in database
          await db.chatPayments.create({
            walletAddress: walletAddress.toLowerCase(),
            stripeSessionId: session.id,
            amount: session.amount_total,
            currency: session.currency,
            paidAt: new Date(),
            status: 'paid',
          });

          console.log(`✅ Chat access granted to wallet: ${walletAddress}`);
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);

export default router;
```

### 5. Payment Status Check Endpoint

**File: `packages/backend/src/routes/stripe.ts` (add this)**

```typescript
// Check if wallet has paid
router.get('/check-payment-status', async (req, res) => {
  try {
    const { wallet } = req.query;

    if (!wallet || typeof wallet !== 'string') {
      return res.status(400).json({ error: 'Wallet address required' });
    }

    // Check database for payment record
    const payment = await db.chatPayments.findOne({
      where: {
        walletAddress: wallet.toLowerCase(),
        status: 'paid',
      },
    });

    res.json({ hasPaid: !!payment });
  } catch (error) {
    console.error('Payment check error:', error);
    res.status(500).json({ error: 'Payment status check failed', hasPaid: false });
  }
});
```

### 6. Database Schema

Add this table to your database:

```sql
CREATE TABLE chat_payments (
  id SERIAL PRIMARY KEY,
  wallet_address VARCHAR(42) NOT NULL UNIQUE,
  stripe_session_id VARCHAR(255) NOT NULL,
  amount INTEGER NOT NULL,
  currency VARCHAR(3) NOT NULL,
  paid_at TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'paid',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wallet_address ON chat_payments(wallet_address);
```

### 7. Register Routes in Main App

**File: `packages/backend/src/index.ts`**

```typescript
import stripeRoutes from './routes/stripe';
import webhookRoutes from './routes/webhook';

// IMPORTANT: Webhook route MUST be before express.json() middleware
app.use('/api', webhookRoutes);

// Then other middleware
app.use(express.json());

// Then other routes
app.use('/api', stripeRoutes);
```

## Stripe Dashboard Setup

1. **Create Stripe Account**: https://dashboard.stripe.com/register
2. **Get API Keys**: Dashboard → Developers → API keys
3. **Set up Webhook**:
   - Dashboard → Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/webhook`
   - Select event: `checkout.session.completed`
   - Copy webhook secret to `.env`

## Testing

### Test Cards (Test Mode)
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires Auth**: 4000 0025 0000 3155

Use any future expiry date and any CVC.

## Security Notes

1. **Never expose secret keys** in frontend
2. **Always verify payments** server-side via webhook
3. **Use HTTPS** in production
4. **Validate wallet addresses** before granting access
5. **Implement rate limiting** on payment endpoints

## Flow Summary

1. User connects wallet ✅
2. User clicks "Unlock Chat for $5" ✅
3. Frontend calls `/api/create-checkout-session` with wallet address
4. Backend creates Stripe session, returns checkout URL
5. User redirected to Stripe Checkout page
6. User completes payment
7. Stripe sends webhook to `/api/webhook`
8. Backend stores payment in database
9. User redirected back to `/community?payment=success`
10. Frontend checks `/api/check-payment-status?wallet=0x...`
11. Chat unlocked! 🎉

## Revenue

All payments go directly to your Stripe account. No intermediaries.

**$5 per user** → Your Stripe account → Your bank account

Stripe fees: ~2.9% + $0.30 per transaction = ~$0.45 per $5 payment
**Your net: ~$4.55 per user**
