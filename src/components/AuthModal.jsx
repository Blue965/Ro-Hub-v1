import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AuthModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleAuth = async (e) => {
    e.preventDefault();
    setMsg('');

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return setMsg(error.message);
      
      if (data.user) {
        await supabase.from('profiles').insert({
          id: data.user.id,
          username,
          display_name: username
        });
        setMsg('Compte créé avec succès !');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
      else onClose();
    }
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#17181c', borderRadius: '16px', padding: '24px', width: '360px', color: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3>{isSignUp ? 'Inscription' : 'Connexion'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>✕</button>
        </div>

        {msg && <p style={{ color: '#3965ff', fontSize: '12px', marginBottom: '8px' }}>{msg}</p>}

        <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {isSignUp && (
            <input type="text" placeholder="Nom d'utilisateur" required value={username} onChange={e => setUsername(e.target.value)} style={{ padding: '8px', background: '#0b0b0c', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
          )}
          <input type="email" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '8px', background: '#0b0b0c', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
          <input type="password" placeholder="Mot de passe" required value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '8px', background: '#0b0b0c', border: '1px solid #333', color: '#fff', borderRadius: '6px' }} />
          
          <button type="submit" style={{ padding: '10px', background: '#3965ff', border: 'none', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            {isSignUp ? "S'inscrire" : 'Se connecter'}
          </button>
        </form>

        <p onClick={() => setIsSignUp(!isSignUp)} style={{ color: '#aaa', fontSize: '12px', marginTop: '12px', cursor: 'pointer', textAlign: 'center' }}>
          {isSignUp ? 'Déjà un compte ? Se connecter' : "Pas de compte ? S'inscrire"}
        </p>
      </div>
    </div>
  );
}