import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 32px',
      backgroundColor: '#17181c',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
    }}>
      <Link href="/" style={{ color: '#ffffff', fontWeight: '800', fontSize: '20px' }}>
        RO<span style={{ color: '#3965ff' }}>HUB</span>
      </Link>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <Link href="/marketplace" style={{ color: '#cccccc' }}>Marketplace</Link>
        <Link href="/upload" style={{ color: '#cccccc' }}>Publier</Link>
        <Link href="/dashboard" style={{ color: '#cccccc' }}>Tableau de bord</Link>
      </div>
    </nav>
  );
}