import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMsg('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` }
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0b0b0c', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 24px' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#17181c', padding: '32px', borderRadius: '16px', width: '100%', maxWidth: '380px', display: 'flex', flexDirection: 'column', gap: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>Bienvenue sur Ro Hub</h1>
          <p style={{ color: '#999ba0', fontSize: '14px', marginBottom: '12px' }}>Connecte-toi pour accéder à ton espace.</p>
          {errorMsg && <p style={{ color: '#ff4d4d', fontSize: '12px' }}>{errorMsg}</p>}
          <button type="button" onClick={handleGoogleLogin} disabled={loading} style={{ padding: '10px', background: '#ffffff', border: 'none', color: '#111111', borderRadius: '8px', cursor: loading ? 'wait' : 'pointer', fontWeight: 'bold' }}>
            Continuer avec Google
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#666', fontSize: '12px', margin: '4px 0' }}>
            <span style={{ height: '1px', backgroundColor: '#333', flex: 1 }} />
            ou
            <span style={{ height: '1px', backgroundColor: '#333', flex: 1 }} />
          </div>
          <label htmlFor="email" style={{ color: '#cccccc', fontSize: '13px' }}>Adresse email</label>
          <input id="email" type="email" placeholder="toi@exemple.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '10px', background: '#0b0b0c', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
          <label htmlFor="password" style={{ color: '#cccccc', fontSize: '13px' }}>Mot de passe</label>
          <input id="password" type="password" placeholder="Ton mot de passe" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '10px', background: '#0b0b0c', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
          <button type="submit" disabled={loading} style={{ padding: '10px', background: '#3965ff', border: 'none', color: '#fff', borderRadius: '8px', cursor: loading ? 'wait' : 'pointer', fontWeight: 'bold' }}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          <p style={{ color: '#999ba0', fontSize: '13px', textAlign: 'center', marginTop: '8px' }}>
            Pas encore de compte ? <Link href="/signup" style={{ color: '#5f83ff', fontWeight: 'bold' }}>Créer un compte</Link>
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
}