export default function PurchaseModal({ isOpen, onClose, assetTitle, price, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#17181c',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '24px',
        width: '450px',
        padding: '24px',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2>Acheter un item</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>✕</button>
        </div>
        <p style={{ marginBottom: '16px' }}>Asset : <strong>{assetTitle}</strong></p>
        <p style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Prix : {price} EUR</p>
        
        <button onClick={onConfirm} style={{
          width: '100%',
          backgroundColor: '#3965ff',
          color: '#ffffff',
          border: 'none',
          borderRadius: '12px',
          padding: '12px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Procéder au paiement (Sandbox)
        </button>
      </div>
    </div>
  );
}