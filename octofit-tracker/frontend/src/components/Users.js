import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;
    console.log('Users API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Users fetched data:', data);
        const usersData = data.results || data;
        setUsers(Array.isArray(usersData) ? usersData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const getAvatarColor = (index) => {
    const colors = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ];
    return colors[index % colors.length];
  };

  const getLevel = (points) => {
    if (points >= 1000) return { level: 10, label: 'Lenda', color: '#ffd700' };
    if (points >= 500) return { level: 7, label: 'Elite', color: '#c0c0c0' };
    if (points >= 250) return { level: 5, label: 'Avançado', color: '#cd7f32' };
    if (points >= 100) return { level: 3, label: 'Intermediário', color: '#6366f1' };
    return { level: 1, label: 'Iniciante', color: '#94a3b8' };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Carregando atletas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
        <div style={{ color: 'var(--accent-danger)' }}>Erro: {error}</div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="dashboard-header">
        <h1 className="dashboard-title">👥 Atletas</h1>
        <p className="dashboard-subtitle">
          Conheça todos os atletas da plataforma
        </p>
      </div>

      <div className="activity-grid">
        {users.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👤</div>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
              Nenhum atleta encontrado
            </div>
          </div>
        ) : (
          users.map((user, index) => {
            const levelInfo = getLevel(user.points || 0);
            const progressToNext = ((user.points || 0) % 100);
            
            return (
              <div
                key={user.id}
                className="glass-card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/activities')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: getAvatarColor(index),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem',
                      fontWeight: '700',
                      flexShrink: 0
                    }}
                  >
                    {((user.username || user.user_name || '?') + '').charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '0.25rem' }}>
                      {user.username}
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {user.email}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nível</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: '700', color: levelInfo.color }}>
                      {levelInfo.label}
                    </span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${progressToNext}%` }}></div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      Time
                    </div>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                      {user.team_name || user.team || 'Sem time'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      Pontos
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '800' }} className="text-gradient">
                      {user.points || 0}
                    </div>
                  </div>
                </div>

                <div 
                  onClick={(e) => { e.stopPropagation(); navigate('/leaderboard'); }}
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: 'var(--accent-primary)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Ver no Ranking 🏆
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default Users;
