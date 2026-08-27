import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ReviewSection({ assetId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assetId) fetchReviews();
  }, [assetId]);

  async function fetchReviews() {
    const { data } = await supabase
      .from('reviews')
      .select('*, profiles(username)')
      .eq('asset_id', assetId)
      .order('created_at', { ascending: false });

    setReviews(data || []);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Veuillez vous connecter pour laisser un avis.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('reviews').insert({
      asset_id: assetId,
      user_id: user.id,
      rating: parseInt(rating),
      comment
    });

    if (error) alert(error.message);
    else {
      setComment('');
      fetchReviews();
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
      <h3>Avis ({reviews.length})</h3>

      <form onSubmit={handleSubmit} style={{ margin: '16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px' }}>Note :</label>
          <select value={rating} onChange={(e) => setRating(e.target.value)} style={{ padding: '6px', background: '#17181c', color: '#fff', border: '1px solid #333', borderRadius: '6px' }}>
            {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ⭐</option>)}
          </select>
        </div>
        <textarea placeholder="Votre avis..." value={comment} onChange={(e) => setComment(e.target.value)} required rows="2" style={{ padding: '8px', background: '#17181c', color: '#fff', border: '1px solid #333', borderRadius: '6px' }} />
        <button type="submit" disabled={loading} style={{ alignSelf: 'flex-start', padding: '8px 16px', background: '#3965ff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Publier l'avis
        </button>
      </form>

      {reviews.length === 0 ? (
        <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Pas encore de note.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
          {reviews.map(r => (
            <div key={r.id} style={{ background: '#17181c', padding: '12px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#aaa' }}>
                <span>@{r.profiles?.username || 'Anonyme'}</span>
                <span>{r.rating} ⭐</span>
              </div>
              <p style={{ fontSize: '14px', marginTop: '4px' }}>{r.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}