import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EmptyState from '../components/EmptyState';

const CATEGORIES = ['Toutes', 'script', 'model', 'ui', 'map', 'system', 'plugin', 'vfx', 'other'];

export default function Marketplace() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Toutes');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchAssets();
  }, [selectedCategory]);

  async function fetchAssets() {
    setLoading(true);
    let query = supabase.from('assets').select('*, profiles(username)').eq('is_active', true);

    if (selectedCategory !== 'Toutes') {
      query = query.eq('category', selectedCategory);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (!error && data) {
      setAssets(data);
    }
    setLoading(false);
  }

  const filteredAssets = assets.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ backgroundColor: '#0b0b0c', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', width: '100%' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '24px' }}>Marketplace</h1>

        {/* Barre de recherche et filtres */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '32px' }}>
          <input 
            type="text" 
            placeholder="Rechercher un asset..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: '240px',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: '#17181c',
              color: '#ffffff'
            }}
          />
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: selectedCategory === cat ? '#3965ff' : '#17181c',
                  color: '#ffffff',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grille d'assets ou état vide */}
        {loading ? (
          <p style={{ color: '#999ba0' }}>Chargement des créations...</p>
        ) : filteredAssets.length === 0 ? (
          <EmptyState 
            title="Aucun asset trouvé" 
            message={searchQuery ? "Aucun résultat ne correspond à votre recherche." : "Aucun asset n'a été publié pour le moment."} 
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {filteredAssets.map(asset => (
              <Link href={`/asset/${asset.slug}`} key={asset.id} style={{ textDecoration: 'none' }}>
                <div style={{
                  backgroundColor: '#17181c',
                  borderRadius: '16px',
                  padding: '16px',
                  border: '1px solid rgba(255,255,255,0.05)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between'
                }}>
                  <div>
                    <div style={{
                      height: '140px',
                      backgroundColor: '#0b0b0c',
                      borderRadius: '10px',
                      marginBottom: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#3965ff',
                      fontWeight: 'bold'
                    }}>
                      {asset.category.toUpperCase()}
                    </div>
                    <h3 style={{ fontSize: '18px', color: '#fff', marginBottom: '6px' }}>{asset.title}</h3>
                    <p style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '12px' }}>
                      Par @{asset.profiles?.username || 'Anonyme'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
                      {asset.price === 0 ? 'Gratuit' : `${asset.price} ${asset.currency}`}
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