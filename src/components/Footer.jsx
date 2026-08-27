export default function Footer() {
  return (
    <footer style={{
      padding: '24px 32px',
      backgroundColor: '#17181c',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      marginTop: '60px',
      textAlign: 'center',
      color: '#7f8c8d',
      fontSize: '14px'
    }}>
      <p>© {new Date().getFullYear()} Ro Hub — Plateforme communautaire pour développeurs Roblox.</p>
    </footer>
  );
}