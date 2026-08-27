import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmptyState from '../../components/EmptyState';

export default function Profile() {
  const router = useRouter();
  const { username } = router.query;
  const [profile, setProfile] = useState(null);
  const [userAssets, setUserAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  async function fetchUserProfile() {
    setLoading(true);
    
    // Récupérer le profil réel
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (profileData) {
      setProfile(profileData);

      // Récupérer les assets réels du profil
      const { data: assetsData } = await supabase
        .from('assets')
        .select('*')
        .eq('creator_id', profileData.id)
        .eq('is_active', true);

      setUserAssets(assetsData || []);
    }
    setLoading(false);
  }

  return (
    <div style={{ backgroundColor: '#0b0b0c', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', padding: '40px 24px', width: '100%' }}>
        {loading ? (
          <p style={{ color: '#999ba0' }}>Recherche du profil...</p>
        ) : !profile ? (
          <EmptyState title="Profil introuvable" message={`Aucun créateur ne porte le nom @${username}.`} />
        ) : (
          <div>
            {/* Header du profil */}
            <div style={{ backgroundColor: '#17181c', padding: '32px', borderRadius: '16px', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h1 style={{ fontSize: '28px', marginBottom: '4px' }}>{profile.display_name || profile.username}</h1>
              <p style={{ color: '#3965ff', fontWeight: 'bold', marginBottom: '12px' }}>@{profile.username}</p>
              <p style={{ color: '#999ba0', fontSize: '14px', marginBottom: '16px' }}>{profile.bio || "Aucune biographie."}</p>
              <span style={{ fontSize: '12px', color: '#7f8c8d', background: '#0b0b0c', padding: '4px 8px', borderRadius: '6px' }}>
                Rôle: {profile.role}
              </span>
            </div>

            {/* Creations du profil */}
            <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>Créations de @{profile.username}</h2>
            {userAssets.length === 0 ? (
              <EmptyState title="Aucune création" message="Ce créateur n'a encore rien publié." />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
                {userAssets.map(asset => (
                  <div key={asset.id} style={{ backgroundColor: '#17181c', padding: '16px', borderRadius: '12px' }}>
                    <h4>{asset.title}</h4>
                    <p style={{ color: '#999ba0', fontSize: '13px', margin: '6px 0' }}>{asset.category}</p>
                    <p style={{ fontWeight: 'bold' }}>{asset.price === 0 ? 'Gratuit' : `${asset.price} EUR`}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}