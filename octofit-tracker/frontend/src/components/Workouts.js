import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Workouts() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;
    console.log('Workouts API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts fetched data:', data);
        const workoutsData = data.results || data;
        setWorkouts(Array.isArray(workoutsData) ? workoutsData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching workouts:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': '#10b981',
      'Medium': '#f59e0b',
      'Hard': '#ef4444'
    };
    return colors[difficulty] || '#6366f1';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Strength': '💪',
      'Cardio': '❤️‍🔥',
      'Flexibility': '🧘',
      'Endurance': '🏃',
      'HIIT': '⚡',
      'default': '🏋️'
    };
    return icons[category] || icons.default;
  };

  const getCategoryGradient = (category) => {
    const gradients = {
      'Strength': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'Cardio': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'Flexibility': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'Endurance': 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'HIIT': 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'default': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    };
    return gradients[category] || gradients.default;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Carregando treinos...</div>
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
        <h1 className="dashboard-title">💪 Treinos Sugeridos</h1>
        <p className="dashboard-subtitle">
          Encontre o treino perfeito para seus objetivos
        </p>
      </div>

      <div className="activity-grid">
        {workouts.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏋️</div>
            <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
              Nenhum treino disponível
            </div>
          </div>
        ) : (
          workouts.map((workout, index) => (
            <div
              key={workout.id}
              className="glass-card fade-in"
              style={{ 
                cursor: 'pointer',
                animationDelay: `${index * 0.05}s`
              }}
              onClick={() => navigate('/activities')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: getCategoryGradient(workout.category),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    flexShrink: 0,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  {getCategoryIcon(workout.category)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '1.2rem', marginBottom: '0.25rem' }}>
                    {workout.name}
                  </div>
                  <div 
                    style={{ 
                      display: 'inline-block',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      background: getDifficultyColor(workout.difficulty),
                      color: 'white',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {workout.difficulty}
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
                  {workout.description}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                    Categoria
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                    {workout.category}
                  </div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', textTransform: 'uppercase' }}>
                    Duração
                  </div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                    {workout.duration} min
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '0.75rem',
                  background: getCategoryGradient(workout.category),
                  borderRadius: '12px',
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  fontWeight: '700',
                  color: 'white',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              >
                Começar Treino 🚀
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Workouts;
