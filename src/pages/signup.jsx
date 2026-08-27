import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Compte créé. Vérifie ton email si la confirmation est activée.');
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#0b0b0c', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 24px' }}>
        <form onSubmit={handleSignup} style={{ backgroundColor: '#17181c', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h1 style={{ fontSize: '28px' }}>Créer un compte</h1>
          <p style={{ color: '#999ba0', fontSize: '14px' }}>Rejoins la communauté Ro Hub.</p>
          {message && <p style={{ color: '#cccccc', fontSize: '13px' }}>{message}</p>}
          <label htmlFor="signup-email" style={{ color: '#cccccc', fontSize: '13px' }}>Adresse email</label>
          <input id="signup-email" type="email" placeholder="toi@exemple.com" value={email} onChange={(event) => setEmail(event.target.value)} required style={{ padding: '10px', background: '#0b0b0c', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
          <label htmlFor="signup-password" style={{ color: '#cccccc', fontSize: '13px' }}>Mot de passe</label>
          <input id="signup-password" type="password" placeholder="Choisis un mot de passe" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required style={{ padding: '10px', background: '#0b0b0c', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
          <button type="submit" disabled={loading} style={{ padding: '10px', background: '#3965ff', border: 'none', color: '#fff', borderRadius: '8px', cursor: loading ? 'wait' : 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
          <p style={{ color: '#999ba0', fontSize: '13px', textAlign: 'center' }}>
            Déjà inscrit ? <Link href="/login" style={{ color: '#5f83ff', fontWeight: 'bold' }}>Se connecter</Link>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
}
