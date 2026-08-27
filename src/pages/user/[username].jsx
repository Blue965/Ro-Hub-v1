import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmptyState from '../../components/EmptyState';
import SEO from '../../components/SEO';

export default function UserPublicProfile() {
  const router = useRouter();
  const { username } = router.query;
  const [profile, setProfile] = useState(null);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) fetchPublicProfile();
  }, [username]);

  async function fetchPublicProfile() {
    setLoading(true);

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (profileData) {
      setProfile(profileData);

      const { data: assetsData } = await supabase
        .from('assets')
        .select('*')
        .eq('creator_id', profileData.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      setAssets(assetsData || []);
    }
    setLoading(false);
  }

  if (loading) {
    return <div style={{ background: '#0b0b0c', color: '#fff', padding: '40px' }}>Chargement...</div>;
  }

  if (!profile) {
    return (
      <div style={{ background: '#0b0b0c', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, maxWidth: '800px', margin: '40px auto', padding: '0 24px', width: '100%' }}>
          <EmptyState title="Utilisateur introuvable" message={`Le profil @${username} n'existe pas.`} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0b0b0c', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <SEO 
        title={`Vitrine de @${profile.username}`} 
        description={profile.bio || `Découvrez les créations Roblox publiées par @${profile.username} sur Ro Hub.`} 
      />
      <Navbar />

      <main style={{ flex: 1, maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', width: '100%', color: '#fff' }}>
        <div style={{ backgroundColor: '#17181c', padding: '32px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>{profile.display_name || profile.username}</h1>
          <p style={{ color: '#3965ff', fontWeight: 'bold', marginBottom: '12px' }}>@{profile.username}</p>
          <p style={{ color: '#999ba0', fontSize: '14px', marginBottom: '16px' }}>{profile.bio || "Aucune biographie rédigée."}</p>
          <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#7f8c8d' }}>
            <span>Rôle : <strong>{profile.role}</strong></span>
            <span>Créations publiées : <strong>{assets.length}</strong></span>
          </div>
        </div>

        <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>Créations en vente ({assets.length})</h2>

        {assets.length === 0 ? (
          <EmptyState title="Aucun asset actif" message="Ce créateur n'a aucun asset en ligne pour le moment." />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {assets.map((asset) => (
              <Link href={`/asset/${asset.slug}`} key={asset.id} style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: '#17181c',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between'
                }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#3965ff', textTransform: 'uppercase', fontWeight: 'bold' }}>{asset.category}</span>
                    <h3 style={{ fontSize: '16px', color: '#fff', margin: '8px 0' }}>{asset.title}</h3>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>
                      {asset.price === 0 ? 'Gratuit' : `${asset.price} EUR`}
                    </span>
                    <span style={{ fontSize: '12px', color: '#3965ff' }}>Voir →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}