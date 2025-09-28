import Stripe from 'stripe';
import { checkPremiumStatus, setPremiumStatus } from './database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  duration: number; // in days
  stripePriceId?: string;
}

// Available premium features
export const PREMIUM_FEATURES: Record<string, PremiumFeature> = {
  premium_styles: {
    id: 'premium_styles',
    name: 'Premium Styles Pack',
    description: 'Access to exclusive color palettes and advanced transformations',
    price: 99, // $0.99
    duration: 30, // 30 days
  },
  unlimited_generation: {
    id: 'unlimited_generation',
    name: 'Unlimited Generation',
    description: 'Remove daily generation limits',
    price: 199, // $1.99
    duration: 30,
  },
  advanced_presets: {
    id: 'advanced_presets',
    name: 'Advanced Preset Library',
    description: 'Access to community-created premium presets',
    price: 149, // $1.49
    duration: 30,
  },
};

/**
 * Create a payment intent for a premium feature
 */
export async function createPaymentIntent(
  userId: string,
  featureId: string
): Promise<PaymentIntent> {
  try {
    const feature = PREMIUM_FEATURES[featureId];
    if (!feature) {
      throw new Error('Invalid premium feature');
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: feature.price,
      currency: 'usd',
      metadata: {
        userId,
        featureId,
        duration: feature.duration.toString(),
      },
      description: `LetterCraft: ${feature.name}`,
    });

    return {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret!,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent');
  }
}

/**
 * Handle successful payment webhook
 */
export async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent): Promise<void> {
  try {
    const { userId, featureId, duration } = paymentIntent.metadata;

    if (!userId || !featureId || !duration) {
      throw new Error('Missing payment metadata');
    }

    const feature = PREMIUM_FEATURES[featureId];
    if (!feature) {
      throw new Error('Invalid premium feature');
    }

    // Calculate expiry date
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + parseInt(duration));

    // Update user's premium status
    await setPremiumStatus(userId, expiryDate);

    console.log(`Premium feature ${featureId} activated for user ${userId} until ${expiryDate}`);
  } catch (error) {
    console.error('Error handling payment success:', error);
    throw error;
  }
}

/**
 * Check if user has access to premium features
 */
export async function hasPremiumAccess(userId: string, featureId?: string): Promise<boolean> {
  try {
    const isPremium = await checkPremiumStatus(userId);

    if (!featureId) {
      return isPremium;
    }

    // For specific features, check if user has premium or if it's a basic feature
    const basicFeatures = ['basic_generation']; // Add basic features that don't require premium
    if (basicFeatures.includes(featureId)) {
      return true;
    }

    return isPremium;
  } catch (error) {
    console.error('Error checking premium access:', error);
    return false;
  }
}

/**
 * Get user's premium status details
 */
export async function getPremiumStatus(userId: string): Promise<{
  isPremium: boolean;
  expiryDate?: Date;
  daysRemaining?: number;
}> {
  try {
    const isPremium = await checkPremiumStatus(userId);

    if (!isPremium) {
      return { isPremium: false };
    }

    // Get expiry date from Redis (this would need to be implemented in database.ts)
    // For now, return basic info
    return {
      isPremium: true,
      daysRemaining: 30, // Placeholder - would calculate from actual expiry
    };
  } catch (error) {
    console.error('Error getting premium status:', error);
    return { isPremium: false };
  }
}

/**
 * Create Stripe checkout session for subscription
 */
export async function createCheckoutSession(
  userId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
      },
    });

    return session.url!;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(
  event: Stripe.Event
): Promise<void> {
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'checkout.session.completed':
        // Handle subscription checkout completion
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    throw error;
  }
}

