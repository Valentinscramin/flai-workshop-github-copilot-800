import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeams: 0,
    totalActivities: 0,
    totalPoints: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const baseUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`;
    
    Promise.all([
      fetch(`${baseUrl}/users/`).then(r => r.json()),
      fetch(`${baseUrl}/teams/`).then(r => r.json()),
      fetch(`${baseUrl}/activities/`).then(r => r.json()),
      fetch(`${baseUrl}/leaderboard/`).then(r => r.json())
    ])
      .then(([usersData, teamsData, activitiesData, leaderboardData]) => {
        const users = usersData.results || usersData;
        const teams = teamsData.results || teamsData;
        const activities = activitiesData.results || activitiesData;
        const leaderboard = leaderboardData.results || leaderboardData;

        const totalPoints = Array.isArray(users) 
          ? users.reduce((sum, user) => sum + (user.points || 0), 0)
          : 0;

        setStats({
          totalUsers: Array.isArray(users) ? users.length : 0,
          totalTeams: Array.isArray(teams) ? teams.length : 0,
          totalActivities: Array.isArray(activities) ? activities.length : 0,
          totalPoints: totalPoints
        });

        // Recent activities (últimas 5)
        if (Array.isArray(activities)) {
          setRecentActivities(activities.slice(0, 5));
        }

        // Top 3 users
        if (Array.isArray(leaderboard)) {
          setTopUsers(leaderboard.slice(0, 3));
        }

        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      });
  }, []);

  const getActivityIcon = (type) => {
    const icons = {
      'Running': '🏃',
      'Cycling': '🚴',
      'Swimming': '🏊',
      'Walking': '🚶',
      'Gym': '💪',
      'Yoga': '🧘',
      'default': '⚡'
    };
    return icons[type] || icons.default;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="dashboard-header">
        <h1 className="dashboard-title">🏋️ OctoFit Dashboard</h1>
        <p className="dashboard-subtitle">
          Acompanhe seu progresso e mantenha-se motivado!
        </p>
      </div>

      {/* Grid de Estatísticas */}
      <div className="stats-grid">
        <div 
          className="stat-card" 
          onClick={() => navigate('/users')}
        >
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            👥
          </div>
          <div className="stat-value">{stats.totalUsers}</div>
          <div className="stat-label">Atletas Ativos</div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: '75%' }}></div>
          </div>
        </div>

        <div 
          className="stat-card"
          onClick={() => navigate('/teams')}
        >
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
            🏆
          </div>
          <div className="stat-value">{stats.totalTeams}</div>
          <div className="stat-label">Times Competindo</div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: '60%' }}></div>
          </div>
        </div>

        <div 
          className="stat-card"
          onClick={() => navigate('/activities')}
        >
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
            ⚡
          </div>
          <div className="stat-value">{stats.totalActivities}</div>
          <div className="stat-label">Atividades Registradas</div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: '85%' }}></div>
          </div>
        </div>

        <div 
          className="stat-card"
          onClick={() => navigate('/leaderboard')}
        >
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' }}>
            ⭐
          </div>
          <div className="stat-value">{stats.totalPoints}</div>
          <div className="stat-label">Pontos Totais</div>
          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: '90%' }}></div>
          </div>
        </div>
      </div>

      {/* Top 3 Performers */}
      <div className="glass-card mb-3">
        <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>
          🌟 Top Performers
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {topUsers.map((user, index) => (
            <div
              key={user.id || index}
              className="glass-card"
              style={{ 
                cursor: 'pointer',
                background: index === 0 
                  ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 237, 78, 0.1) 100%)'
                  : 'rgba(21, 25, 50, 0.4)'
              }}
              onClick={() => navigate('/leaderboard')}
            >
              <div style={{ textAlign: 'center' }}>
                <div 
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: index === 0 
                      ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)'
                      : index === 1
                      ? 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%)'
                      : 'linear-gradient(135deg, #cd7f32 0%, #e8a97c 100%)',
                    margin: '0 auto 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: '700',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
                  }}
                >
                  {((user.user_name || user.user || '?') + '').charAt(0).toUpperCase()}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  {user.user_name || user.user}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                  {user.team_name || user.team}
                </div>
                <div 
                  className="text-gradient"
                  style={{ fontSize: '1.5rem', fontWeight: '800' }}
                >
                  {user.total_points} pts
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
            🔥 Atividades Recentes
          </h2>
          <button
            onClick={() => navigate('/activities')}
            style={{
              background: 'var(--gradient-1)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Ver Todas →
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recentActivities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
              Nenhuma atividade encontrada
            </div>
          ) : (
            recentActivities.map((activity, index) => (
              <div
                key={activity.id || index}
                className="glass-card"
                style={{ 
                  cursor: 'pointer',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
                onClick={() => navigate('/activities')}
              >
                <div 
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'var(--gradient-1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0
                  }}
                >
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>
                    {activity.user_name || activity.user}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {activity.activity_type} • {activity.duration} min • {activity.distance} km
                  </div>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {new Date(activity.date).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div 
          className="stat-card"
          onClick={() => navigate('/workouts')}
          style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)' }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💪</div>
          <div style={{ fontWeight: '700' }}>Treinos Sugeridos</div>
        </div>
        
        <div 
          className="stat-card"
          onClick={() => navigate('/leaderboard')}
          style={{ background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 237, 78, 0.1) 100%)' }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏆</div>
          <div style={{ fontWeight: '700' }}>Ver Ranking</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
