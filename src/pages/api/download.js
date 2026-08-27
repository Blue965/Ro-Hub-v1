import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const { assetId, userId } = req.query;

  if (!assetId || !userId) {
    return res.status(400).json({ error: 'Identifiants manquant' });
  }

  // Vérification de la suspension de l'utilisateur
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('is_suspended')
    .eq('id', userId)
    .single();

  if (profile?.is_suspended) {
    return res.status(403).json({ error: 'Compte suspendu. Téléchargement interdit.' });
  }

  // Vérification de l'asset
  const { data: asset } = await supabaseAdmin
    .from('assets')
    .select('*')
    .eq('id', assetId)
    .single();

  if (!asset) return res.status(404).json({ error: 'Asset introuvable' });

  // Si l'asset est payant, vérifier la présence d'un achat réel
  if (asset.price > 0) {
    const { data: purchase } = await supabaseAdmin
      .from('purchases')
      .select('id')
      .eq('buyer_id', userId)
      .eq('asset_id', assetId)
      .eq('status', 'completed')
      .single();

    if (!purchase) {
      return res.status(403).json({ error: 'Achat non confirmé pour cet asset.' });
    }
  }

  // Génération de l'URL signée temporaire (valide 60 secondes)
  const { data, error } = await supabaseAdmin.storage
    .from('private-assets')
    .createSignedUrl(asset.file_path, 60);

  if (error || !data) {
    return res.status(500).json({ error: 'Erreur lors de la génération du lien.' });
  }

  return res.status(200).json({ signedUrl: data.signedUrl });
}