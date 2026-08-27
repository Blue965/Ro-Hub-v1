import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div style={{ backgroundColor: '#0b0b0c', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', padding: '60px 24px', width: '100%' }}>
        {/* Section Hero */}
        <section style={{ textAlign: 'center', padding: '60px 0' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '800', marginBottom: '16px' }}>
            La marketplace ultime pour les développeurs <span style={{ color: '#3965ff' }}>Roblox</span>
          </h1>
          <p style={{ color: '#999ba0', fontSize: '18px', maxWidth: '600px', margin: '0 auto 32px auto' }}>
            Achetez et vendez des scripts, models, UI et systèmes en toute sécurité. Protégé contre le leaking.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link href="/marketplace" style={{ backgroundColor: '#3965ff', padding: '14px 28px', borderRadius: '12px', fontWeight: 'bold' }}>
              Explorer la Marketplace
            </Link>
            <Link href="/upload" style={{ backgroundColor: '#17181c', padding: '14px 28px', borderRadius: '12px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.1)' }}>
              Publier un Asset
            </Link>
          </div>
        </section>

        {/* Section Avantages */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '40px' }}>
          <div style={{ backgroundColor: '#17181c', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ marginBottom: '8px' }}>🛡️ Protection Anti-Leaking</h3>
            <p style={{ color: '#999ba0', fontSize: '14px' }}>Système d'avertissements et de bannissement strict pour protéger la propriété intellectuelle des créateurs.</p>
          </div>
          <div style={{ backgroundColor: '#17181c', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ marginBottom: '8px' }}>⚡ Paiements Sécurisés</h3>
            <p style={{ color: '#999ba0', fontSize: '14px' }}>Transactions sécurisées directement intégrées via l'infrastructure Stripe.</p>
          </div>
          <div style={{ backgroundColor: '#17181c', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ marginBottom: '8px' }}>📦 Assets Vérifiés</h3>
            <p style={{ color: '#999ba0', fontSize: '14px' }}>Signalements et modération active pour garantir des fichiers exempts de malwares ou voleurs.</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}