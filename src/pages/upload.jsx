import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('script');
  const [price, setPrice] = useState(0);
  const [filePath, setFilePath] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setMessage('Vous devez être connecté pour publier un asset.');
      setLoading(false);
      return;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const { error } = await supabase.from('assets').insert({
      creator_id: user.id,
      title,
      slug,
      description,
      category,
      price: parseFloat(price),
      file_path: filePath || 'uploads/default.rbxm',
      is_active: true
    });

    if (error) {
      setMessage(`Erreur : ${error.message}`);
    } else {
      setMessage('Asset publié avec succès dans la base de données !');
      setTitle('');
      setDescription('');
      setPrice(0);
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#0b0b0c', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: '600px', margin: '0 auto', padding: '40px 24px', width: '100%' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>Publier un Asset</h1>

        {message && (
          <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#17181c', color: '#fff', marginBottom: '20px', border: '1px solid #3965ff' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: '#17181c', padding: '24px', borderRadius: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Titre</label>
            <input 
              type="text" 
              required
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#0b0b0c', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Catégorie</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#0b0b0c', color: '#fff' }}
            >
              <option value="script">Script</option>
              <option value="model">Model</option>
              <option value="ui">UI</option>
              <option value="map">Map</option>
              <option value="system">System</option>
              <option value="plugin">Plugin</option>
              <option value="vfx">VFX</option>
              <option value="other">Autre</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Prix (EUR)</label>
            <input 
              type="number" 
              min="0"
              step="0.01"
              value={price} 
              onChange={(e) => setPrice(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#0b0b0c', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Description</label>
            <textarea 
              rows="4"
              required
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#0b0b0c', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px' }}>Chemin du Fichier (Storage)</label>
            <input 
              type="text" 
              placeholder="ex: assets/v1_my_script.rbxm"
              value={filePath} 
              onChange={(e) => setFilePath(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #333', backgroundColor: '#0b0b0c', color: '#fff' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '12px', backgroundColor: '#3965ff', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' }}
          >
            {loading ? 'Publication...' : 'Publier sur Ro Hub'}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}