import express from 'express';
import Stripe from 'stripe';
import prisma from '../lib/prisma';

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Membership tier configuration
const MEMBERSHIP_TIERS = {
  basic: {
    name: 'Basic',
    price: 9900, // $99.00 in cents
    level: 1,
  },
  pro: {
    name: 'Pro',
    price: 29900, // $299.00
    level: 2,
  },
  elite: {
    name: 'Elite',
    price: 99900, // $999.00
    level: 3,
  },
};

// Create Stripe Checkout Session for membership purchase
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { tier, walletAddress } = req.body;

    if (!tier || !MEMBERSHIP_TIERS[tier as keyof typeof MEMBERSHIP_TIERS]) {
      return res.status(400).json({ error: 'Invalid membership tier' });
    }

    const membership = MEMBERSHIP_TIERS[tier as keyof typeof MEMBERSHIP_TIERS];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${membership.name} Membership`,
              description: `MDMPro ${membership.name} tier membership access`,
            },
            unit_amount: membership.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/membership/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/membership/cancel`,
      metadata: {
        tier,
        level: membership.level.toString(),
        walletAddress: walletAddress || 'none',
      },
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Verify payment session and return membership data from database
router.get('/verify-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Check database first
    const membership = await prisma.membership.findUnique({
      where: { stripeSessionId: sessionId },
    });

    if (membership) {
      return res.json({
        success: true,
        tier: membership.tier,
        level: membership.level,
        walletAddress: membership.walletAddress,
        paymentStatus: membership.paymentStatus,
      });
    }

    // If not in DB, check Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      // Create membership in database
      const newMembership = await prisma.membership.create({
        data: {
          walletAddress: session.metadata?.walletAddress || 'unknown',
          tier: session.metadata?.tier || 'basic',
          level: parseInt(session.metadata?.level || '1'),
          stripeSessionId: session.id,
          stripeCustomerId: session.customer as string | null,
          amount: session.amount_total || 0,
          currency: session.currency || 'usd',
          paymentStatus: 'paid',
        },
      });

      res.json({
        success: true,
        tier: newMembership.tier,
        level: newMembership.level,
        walletAddress: newMembership.walletAddress,
        paymentStatus: newMembership.paymentStatus,
      });
    } else {
      res.json({
        success: false,
        status: session.payment_status,
      });
    }
  } catch (error: any) {
    console.error('Session verification error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get membership by wallet address
router.get('/membership/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params;

    const membership = await prisma.membership.findFirst({
      where: {
        walletAddress,
        paymentStatus: 'paid',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (membership) {
      res.json({
        success: true,
        membership: {
          tier: membership.tier,
          level: membership.level,
          createdAt: membership.createdAt,
          expiresAt: membership.expiresAt,
        },
      });
    } else {
      res.json({
        success: false,
        message: 'No active membership found',
      });
    }
  } catch (error: any) {
    console.error('Membership lookup error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Validate webhook secret configuration
  if (!webhookSecret) {
    console.error('⚠️  STRIPE_WEBHOOK_SECRET not configured in environment variables');
    return res.status(500).send('Webhook secret not configured');
  }

  if (!sig) {
    console.error('⚠️  Missing Stripe signature header');
    return res.status(400).send('Missing signature');
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    console.log('✅ Webhook signature verified:', event.type);
  } catch (error: any) {
    console.error('❌ Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('💳 Payment successful:', {
          eventId: event.id,
          sessionId: session.id,
          tier: session.metadata?.tier,
          walletAddress: session.metadata?.walletAddress,
          amount: session.amount_total,
          currency: session.currency,
        });

        // Store membership in database with idempotency
        try {
          const membership = await prisma.membership.upsert({
            where: { stripeSessionId: session.id },
            update: {
              paymentStatus: 'paid',
              stripeCustomerId: session.customer as string | null,
              amount: session.amount_total || 0,
              updatedAt: new Date(),
            },
            create: {
              walletAddress: session.metadata?.walletAddress || 'unknown',
              tier: session.metadata?.tier || 'basic',
              level: parseInt(session.metadata?.level || '1'),
              stripeSessionId: session.id,
              stripeCustomerId: session.customer as string | null,
              amount: session.amount_total || 0,
              currency: session.currency || 'usd',
              paymentStatus: 'paid',
            },
          });
          
          console.log('✅ Membership saved to database:', {
            id: membership.id,
            tier: membership.tier,
            walletAddress: membership.walletAddress,
          });
        } catch (dbError: any) {
          console.error('❌ Database error saving membership:', {
            error: dbError.message,
            sessionId: session.id,
          });
          // Don't fail the webhook - Stripe has already marked payment as successful
          // We can manually reconcile failed database writes later
        }

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('✅ PaymentIntent succeeded:', {
          eventId: event.id,
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
        });
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error('❌ PaymentIntent failed:', {
          eventId: event.id,
          paymentIntentId: paymentIntent.id,
          error: paymentIntent.last_payment_error?.message,
        });
        
        // Update membership status if it exists
        if (paymentIntent.metadata?.sessionId) {
          try {
            await prisma.membership.updateMany({
              where: { stripeSessionId: paymentIntent.metadata.sessionId },
              data: { paymentStatus: 'failed' },
            });
          } catch (dbError) {
            console.error('Database error updating failed payment:', dbError);
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        // Future: Handle subscription-based memberships
        console.log(`📋 Subscription event: ${event.type}`, {
          eventId: event.id,
        });
        break;
      }

      default:
        console.log(`ℹ️  Unhandled event type: ${event.type}`, {
          eventId: event.id,
        });
    }

    // Always return 200 to acknowledge receipt
    res.json({ received: true, eventId: event.id });
  } catch (error: any) {
    console.error('❌ Error processing webhook event:', {
      eventType: event.type,
      eventId: event.id,
      error: error.message,
      stack: error.stack,
    });
    
    // Return 500 so Stripe will retry
    res.status(500).json({ 
      error: 'Internal server error processing webhook',
      eventId: event.id 
    });
  }
});

export default router;
