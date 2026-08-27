import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      if (!mounted) return;
      if (!currentUser) {
        router.replace('/login');
        return;
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  if (loading || !user) {
    return (
      <div style={{ backgroundColor: '#0b0b0c', minHeight: '100vh', color: '#ffffff' }}>
        <Navbar />
        <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '56px 24px' }}>
          <p style={{ color: '#999ba0' }}>Chargement de ton espace...</p>
        </main>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0b0b0c', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#ffffff' }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: '1000px', margin: '0 auto', padding: '56px 24px', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <div>
            <p style={{ color: '#5f83ff', fontSize: '13px', fontWeight: 'bold', marginBottom: '8px' }}>ESPACE MEMBRE</p>
            <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Bonjour{user.email ? `, ${user.email.split('@')[0]}` : ''}</h1>
            <p style={{ color: '#999ba0' }}>Gère ton compte et retrouve rapidement tes actions.</p>
          </div>
          <button onClick={handleLogout} style={{ padding: '10px 16px', backgroundColor: '#17181c', border: '1px solid rgba(255,255,255,0.12)', color: '#ffffff', borderRadius: '8px', cursor: 'pointer' }}>
            Se déconnecter
          </button>
        </div>

        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#17181c', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ color: '#999ba0', fontSize: '13px', marginBottom: '10px' }}>Compte</p>
            <strong style={{ color: '#5f83ff' }}>Connecté</strong>
          </div>
          <div style={{ backgroundColor: '#17181c', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ color: '#999ba0', fontSize: '13px', marginBottom: '10px' }}>Email</p>
            <strong style={{ overflowWrap: 'anywhere' }}>{user.email}</strong>
          </div>
        </section>

        <section style={{ backgroundColor: '#17181c', padding: '24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Continuer sur Ro Hub</h2>
          <p style={{ color: '#999ba0', fontSize: '14px', marginBottom: '20px' }}>Explore la marketplace ou publie ton premier asset.</p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/marketplace" style={{ padding: '10px 16px', backgroundColor: '#3965ff', color: '#ffffff', borderRadius: '8px', fontWeight: 'bold' }}>Voir la marketplace</Link>
            <Link href="/upload" style={{ padding: '10px 16px', backgroundColor: '#0b0b0c', color: '#ffffff', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', fontWeight: 'bold' }}>Publier un asset</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
