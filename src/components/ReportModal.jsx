import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ReportModal({ isOpen, onClose, assetId, reportedUserId }) {
  const [reason, setReason] = useState('stolen_leaking');
  const [description, setDescription] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg('');

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setStatusMsg('Vous devez être connecté pour signaler.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.from('reports').insert({
      reporter_id: user.id,
      reported_user_id: reportedUserId || null,
      asset_id: assetId || null,
      reason,
      description,
      evidence_url: evidenceUrl || null,
      status: 'pending'
    });

    if (error) {
      setStatusMsg(`Erreur : ${error.message}`);
    } else {
      setStatusMsg('Signalement envoyé à la modération.');
      setTimeout(() => {
        onClose();
        setStatusMsg('');
        setDescription('');
        setEvidenceUrl('');
      }, 1500);
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{ backgroundColor: '#17181c', borderRadius: '16px', padding: '24px', width: '450px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3>🚨 Signaler un contenu</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
        </div>

        {statusMsg && <p style={{ color: '#3965ff', marginBottom: '12px', fontSize: '14px' }}>{statusMsg}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>Raison</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#0b0b0c', color: '#fff', border: '1px solid #333' }}>
              <option value="stolen_leaking">Vol / Leaking</option>
              <option value="copyright">Copyright</option>
              <option value="malware">Malware</option>
              <option value="scam">Scam</option>
              <option value="forbidden_content">Contenu interdit</option>
              <option value="misleading">Fausse description</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>Description détaillée</label>
            <textarea required rows="3" value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#0b0b0c', color: '#fff', border: '1px solid #333' }} />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#aaa' }}>Lien de preuve (Optionnel)</label>
            <input type="url" placeholder="https://..." value={evidenceUrl} onChange={(e) => setEvidenceUrl(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#0b0b0c', color: '#fff', border: '1px solid #333' }} />
          </div>

          <button type="submit" disabled={loading} style={{ padding: '10px', background: '#e53935', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}>
            {loading ? 'Envoi...' : 'Envoyer le signalement'}
          </button>
        </form>
      </div>
    </div>
  );
}