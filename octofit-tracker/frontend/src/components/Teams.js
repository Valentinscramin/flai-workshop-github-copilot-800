import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Teams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
    console.log('Teams API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Teams fetched data:', data);
        const teamsData = data.results || data;
        setTeams(Array.isArray(teamsData) ? teamsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching teams:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const getTeamGradient = (index) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ];
    return gradients[index % gradients.length];
  };

  const getTeamEmoji = (index) => {
    const emojis = ['🏆', '⚡', '🔥', '🚀', '💪', '⭐', '🌟', '🎯'];
    return emojis[index % emojis.length];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Carregando times...</div>
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
        <h1 className="dashboard-title">🏆 Times</h1>
        <p className="dashboard-subtitle">
          Equipes competindo na plataforma
        </p>
      </div>

      <div className="activity-grid">
        {teams.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
              Nenhum time encontrado
            </div>
          </div>
        ) : (
          teams.map((team, index) => (
            <div
              key={team.id}
              className="glass-card fade-in"
              style={{ 
                cursor: 'pointer',
                animationDelay: `${index * 0.05}s`
              }}
              onClick={() => navigate('/users')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: getTeamGradient(index),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    flexShrink: 0,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {getTeamEmoji(index)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '1.3rem', marginBottom: '0.25rem' }}>
                    {team.name}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Criado em {new Date(team.created_at).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div style={{ 
                background: 'rgba(99, 102, 241, 0.05)',
                padding: '1rem',
                borderRadius: '12px',
                marginBottom: '1rem'
              }}>
                <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                  {team.description || 'Sem descrição'}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div
                  onClick={(e) => { e.stopPropagation(); navigate('/leaderboard'); }}
                  style={{
                    flex: 1,
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
                  Ver Ranking 🎯
                </div>
                <div
                  onClick={(e) => { e.stopPropagation(); navigate('/activities'); }}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'rgba(67, 233, 123, 0.1)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#43e97b',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Atividades ⚡
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Teams;
