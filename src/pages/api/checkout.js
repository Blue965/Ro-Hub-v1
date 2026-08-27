import Stripe from 'stripe';
import { supabase } from '../../lib/supabaseClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' });

  const { assetId, userId } = req.body;

  if (!assetId || !userId) {
    return res.status(400).json({ error: 'Paramètres manquants' });
  }

  // Récupérer le prix réel de l'asset directement en BDD
  const { data: asset, error } = await supabase
    .from('assets')
    .select('*')
    .eq('id', assetId)
    .single();

  if (error || !asset) {
    return res.status(404).json({ error: 'Asset introuvable' });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: asset.currency.toLowerCase(),
            product_data: { name: asset.title },
            unit_amount: Math.round(asset.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        asset_id: asset.id,
        buyer_id: userId,
        seller_id: asset.creator_id,
      },
      success_url: `${req.headers.origin}/dashboard?success=true`,
      cancel_url: `${req.headers.origin}/asset/${asset.slug}?canceled=true`,
    });

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}