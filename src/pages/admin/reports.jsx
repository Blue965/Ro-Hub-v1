import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmptyState from '../../components/EmptyState';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    checkAdminAndFetchReports();
  }, []);

  async function checkAdminAndFetchReports() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    // Vérifier le rôle réel dans la table profiles
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['moderator', 'admin', 'owner'].includes(profile.role)) {
      setUserRole('unauthorized');
      setLoading(false);
      return;
    }

    setUserRole(profile.role);

    // Récupérer tous les signalements réels
    const { data: reportsData } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    setReports(reportsData || []);
    setLoading(false);
  }

  // Action : Marquer un signalement comme résolu/rejeté
  const handleUpdateStatus = async (reportId, newStatus) => {
    const { error } = await supabase
      .from('reports')
      .update({ status: newStatus })
      .eq('id', reportId);

    if (error) {
      setActionMessage(`Erreur : ${error.message}`);
    } else {
      setActionMessage(`Signalement mis à jour : ${newStatus}`);
      setReports(reports.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
    }
  };

  // Action : Suspendre un utilisateur accusé (Anti-Leaking)
  const handleSuspendUser = async (userId) => {
    if (!userId) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        is_suspended: true,
        suspended_at: new Date().toISOString(),
        suspension_reason: 'Suspension par la modération (Leaking/Vol d\'asset)'
      })
      .eq('id', userId);

    if (error) {
      setActionMessage(`Erreur de suspension : ${error.message}`);
    } else {
      setActionMessage(`L'utilisateur a été suspendu de la plateforme.`);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0b0b0c', minHeight: '100vh', color: '#fff', padding: '40px' }}>
        Chargement du panneau de modération...
      </div>
    );
  }

  if (userRole === 'unauthorized' || !userRole) {
    return (
      <div style={{ backgroundColor: '#0b0b0c', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, maxWidth: '800px', margin: '40px auto', padding: '0 24px', width: '100%' }}>
          <EmptyState 
            title="Accès refusé" 
            message="Vous devez être modérateur, admin ou owner pour accéder à cette page." 
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0b0b0c', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1, maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', width: '100%' }}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Panneau de Modération</h1>
        <p style={{ color: '#999ba0', marginBottom: '24px' }}>Gestion des signalements et protection anti-leaking.</p>

        {actionMessage && (
          <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: '#17181c', border: '1px solid #3965ff', marginBottom: '20px' }}>
            {actionMessage}
          </div>
        )}

        {reports.length === 0 ? (
          <EmptyState title="Aucun signalement" message="Aucun contenu n'a été signalé par les membres pour le moment." />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reports.map((report) => (
              <div 
                key={report.id} 
                style={{ 
                  backgroundColor: '#17181c', 
                  padding: '20px', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,255,255,0.05)' 
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ 
                    fontSize: '12px', 
                    padding: '4px 8px', 
                    borderRadius: '6px', 
                    backgroundColor: report.reason === 'stolen_leaking' ? '#ff4d4d' : '#3965ff',
                    fontWeight: 'bold'
                  }}>
                    {report.reason.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '12px', color: '#7f8c8d' }}>Statut : {report.status}</span>
                </div>

                <p style={{ fontSize: '15px', marginBottom: '8px' }}><strong>Description :</strong> {report.description}</p>
                {report.evidence_url && (
                  <p style={{ fontSize: '13px', color: '#999ba0', marginBottom: '12px' }}>
                    <strong>Preuve :</strong> <a href={report.evidence_url} target="_blank" rel="noreferrer" style={{ color: '#3965ff', textDecoration: 'underline' }}>Consulter la preuve</a>
                  </p>
                )}

                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
                  <button 
                    onClick={() => handleUpdateStatus(report.id, 'resolved')}
                    style={{ padding: '8px 16px', backgroundColor: '#2e7d32', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Accepter & Résoudre
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(report.id, 'rejected')}
                    style={{ padding: '8px 16px', backgroundColor: '#c62828', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    Rejeter
                  </button>
                  {report.reported_user_id && (
                    <button 
                      onClick={() => handleSuspendUser(report.reported_user_id)}
                      style={{ padding: '8px 16px', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      🚫 Suspendre l'utilisateur concerné
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}