export default function EmptyState({ title, message }) {
  return (
    <div style={{
      padding: '48px 24px',
      textAlign: 'center',
      backgroundColor: '#17181c',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      margin: '24px 0'
    }}>
      <h3 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '8px' }}>{title}</h3>
      <p style={{ color: '#999ba0', fontSize: '14px' }}>{message}</p>
    </div>
  );
}