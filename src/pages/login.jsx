import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErrorMsg(error.message);
    else router.push('/dashboard');
  };

  return (
    <div style={{ backgroundColor: '#0b0b0c', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#17181c', padding: '32px', borderRadius: '16px', width: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2>Connexion</h2>
          {errorMsg && <p style={{ color: '#ff4d4d', fontSize: '12px' }}>{errorMsg}</p>}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={{ padding: '10px', background: '#0b0b0c', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
          <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)} required style={{ padding: '10px', background: '#0b0b0c', border: '1px solid #333', color: '#fff', borderRadius: '8px' }} />
          <button type="submit" style={{ padding: '10px', background: '#3965ff', border: 'none', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Connexion</button>
        </form>
      </main>
      <Footer />
    </div>
  );
}