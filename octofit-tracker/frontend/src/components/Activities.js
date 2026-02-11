import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Activities() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;
    console.log('Activities API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Activities fetched data:', data);
        const activitiesData = data.results || data;
        setActivities(Array.isArray(activitiesData) ? activitiesData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching activities:', error);
        setError(error.message);
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

  const getActivityGradient = (type) => {
    const gradients = {
      'Running': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'Cycling': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'Swimming': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'Walking': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'Gym': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'Yoga': 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
      'default': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
    return gradients[type] || gradients.default;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Carregando atividades...</div>
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
        <h1 className="dashboard-title">⚡ Atividades</h1>
        <p className="dashboard-subtitle">
          Todas as atividades registradas na plataforma
        </p>
      </div>

      <div className="activity-grid">
        {activities.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏃</div>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
              Nenhuma atividade encontrada
            </div>
          </div>
        ) : (
          activities.map((activity, index) => (
            <div
              key={activity.id}
              className="activity-card fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => navigate('/users')}
            >
              <div className="activity-header">
                <div className="activity-icon" style={{ background: getActivityGradient(activity.activity_type) }}>
                  {getActivityIcon(activity.activity_type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="activity-user">{activity.user_name || activity.user}</div>
                  <div className="activity-type">{activity.activity_type}</div>
                </div>
              </div>

              <div className="activity-stats">
                <div className="activity-stat">
                  <div className="activity-stat-value">⏱️ {activity.duration}</div>
                  <div className="activity-stat-label">Minutos</div>
                </div>
                <div className="activity-stat">
                  <div className="activity-stat-value">📍 {activity.distance}</div>
                  <div className="activity-stat-label">Km</div>
                </div>
              </div>

              <div style={{ 
                marginTop: '1rem', 
                paddingTop: '1rem', 
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {new Date(activity.date).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
                <div 
                  onClick={(e) => { e.stopPropagation(); navigate('/workouts'); }}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(99, 102, 241, 0.1)',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: 'var(--accent-primary)',
                    cursor: 'pointer'
                  }}
                >
                  Ver treinos →
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Activities;
