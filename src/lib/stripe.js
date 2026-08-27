import { loadStripe } from '@stripe/stripe-js';

// Utilise la clé publique de test (pk_test_...)
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_sandbox_key');