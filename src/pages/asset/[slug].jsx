import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmptyState from '../../components/EmptyState';
import ReportModal from '../../components/ReportModal';
import ReviewSection from '../../components/ReviewSection';

export default function AssetDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  useEffect(() => {
    if (slug) fetchAsset();
  }, [slug]);

  async function fetchAsset() {
    setLoading(true);
    const { data } = await supabase
      .from('assets')
      .select('*, profiles(username)')
      .eq('slug', slug)
      .single();

    setAsset(data);
    setLoading(false);
  }

  const handleDownload = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return alert('Veuillez vous connecter.');

    const res = await fetch(`/api/download?assetId=${asset.id}&userId=${user.id}`);
    const data = await res.json();

    if (data.signedUrl) {
      window.open(data.signedUrl, '_blank');
    } else {
      alert(data.error || 'Téléchargement échoué.');
    }
  };

  if (loading) return <div style={{ background: '#0b0b0c', color: '#fff', padding: '40px' }}>Chargement...</div>;
  if (!asset) return <div style={{ background: '#0b0b0c', minHeight: '100vh' }}><Navbar /><EmptyState title="Asset non trouvé" message="Cet asset n'existe pas." /><Footer /></div>;

  return (
    <div style={{ backgroundColor: '#0b0b0c', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: '900px', margin: '0 auto', padding: '40px 24px', width: '100%', color: '#fff' }}>
        <div style={{ backgroundColor: '#17181c', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1>{asset.title}</h1>
              <p style={{ color: '#7f8c8d', fontSize: '14px' }}>Par @{asset.profiles?.username || 'Anonyme'} | Catégorie : {asset.category}</p>
            </div>
            <button onClick={() => setIsReportOpen(true)} style={{ background: 'none', border: '1px solid #e53935', color: '#e53935', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>
              🚨 Signaler
            </button>
          </div>

          <p style={{ margin: '20px 0', color: '#ccc' }}>{asset.description}</p>
          <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>{asset.price === 0 ? 'Gratuit' : `${asset.price} EUR`}</p>

          <button onClick={handleDownload} style={{ padding: '12px 24px', background: '#3965ff', border: 'none', color: '#fff', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            {asset.price === 0 ? 'Télécharger' : 'Obtenir l\'asset'}
          </button>
        </div>

        <ReviewSection assetId={asset.id} />
        
        <ReportModal 
          isOpen={isReportOpen} 
          onClose={() => setIsReportOpen(false)} 
          assetId={asset.id} 
          reportedUserId={asset.creator_id} 
        />
      </main>
      <Footer />
    </div>
  );
}