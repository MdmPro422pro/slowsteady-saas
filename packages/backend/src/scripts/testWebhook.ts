import Stripe from 'stripe';

/**
 * Script to test Stripe webhook handling locally
 * Simulates a checkout.session.completed event
 * 
 * Usage: ts-node src/scripts/testWebhook.ts
 */

const WEBHOOK_URL = 'http://localhost:4000/api/stripe/webhook';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function testWebhook() {
  console.log('🧪 Testing Stripe Webhook Integration\n');

  // Step 1: Create a test checkout session
  console.log('📝 Step 1: Creating test checkout session...');
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Test Pro Membership',
            description: 'Test webhook integration',
          },
          unit_amount: 29900, // $299.00
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:5173/membership/success?session_id={CHECKOUT_SESSION_ID}',
    cancel_url: 'http://localhost:5173/membership/cancel',
    metadata: {
      tier: 'pro',
      level: '2',
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    },
  });

  console.log('✅ Session created:', session.id);
  console.log('   Amount:', session.amount_total, session.currency);
  console.log('   Metadata:', session.metadata);

  // Step 2: Simulate payment completion
  console.log('\n💳 Step 2: Simulating payment completion...');
  console.log('   In real scenario, customer would pay via Stripe Checkout');
  console.log('   For testing, we\'ll trigger the webhook event manually\n');

  // Step 3: Instructions for webhook testing
  console.log('🔧 Step 3: Test the webhook with Stripe CLI:\n');
  console.log('   Terminal 1: Start your server (if not running)');
  console.log('   $ pnpm run dev\n');
  console.log('   Terminal 2: Listen for webhook events');
  console.log('   $ stripe listen --forward-to localhost:4000/api/stripe/webhook\n');
  console.log('   Terminal 3: Trigger test event');
  console.log('   $ stripe trigger checkout.session.completed\n');

  console.log('📊 Expected webhook response:');
  console.log('   ✅ Webhook signature verified: checkout.session.completed');
  console.log('   💳 Payment successful: { sessionId, tier, walletAddress }');
  console.log('   ✅ Membership saved to database\n');

  console.log('🔍 Verify in database:');
  console.log('   SELECT * FROM "Membership" WHERE "stripeSessionId" = \'<session_id>\';');
  console.log('\n✨ Test complete! Check your server logs for webhook events.');
}

// Run the test
testWebhook().catch((error) => {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
});
