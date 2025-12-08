import express from 'express';
import Stripe from 'stripe';

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

// Verify payment session
router.get('/verify-session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      res.json({
        success: true,
        tier: session.metadata?.tier,
        level: session.metadata?.level,
        walletAddress: session.metadata?.walletAddress,
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

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Stripe webhook secret not configured');
    return res.status(500).send('Webhook secret not configured');
  }

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig!, webhookSecret);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Payment successful:', {
          sessionId: session.id,
          tier: session.metadata?.tier,
          walletAddress: session.metadata?.walletAddress,
        });

        // TODO: Store membership in database
        // await prisma.membership.create({
        //   data: {
        //     walletAddress: session.metadata?.walletAddress,
        //     tier: session.metadata?.tier,
        //     level: parseInt(session.metadata?.level || '1'),
        //     stripeSessionId: session.id,
        //     paymentStatus: 'paid',
        //   },
        // });

        break;
      }
      case 'payment_intent.succeeded':
        console.log('PaymentIntent succeeded:', event.data.object.id);
        break;
      case 'payment_intent.payment_failed':
        console.log('PaymentIntent failed:', event.data.object.id);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error.message);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

export default router;
