import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
    console.log('Leaderboard API endpoint:', apiUrl);

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard fetched data:', data);
        const leaderboardData = data.results || data;
        setLeaderboard(Array.isArray(leaderboardData) ? leaderboardData : []);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching leaderboard:', error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  const getMedalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return null;
  };

  const getAchievementBadges = (points) => {
    const badges = [];
    if (points >= 1000) badges.push({ icon: '⭐', label: 'Lenda', color: 'gold' });
    if (points >= 500) badges.push({ icon: '💎', label: 'Elite', color: 'silver' });
    if (points >= 250) badges.push({ icon: '🔥', label: 'Em Chamas', color: 'bronze' });
    if (points >= 100) badges.push({ icon: '⚡', label: 'Ativo', color: 'level' });
    return badges;
  };

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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Carregando ranking...</div>
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

  const topThree = leaderboard.slice(0, 3);
  const restOfLeaderboard = leaderboard.slice(3);

  return (
    <div className="leaderboard-container fade-in">
      <div className="leaderboard-header">
        <h1 className="leaderboard-title">
          🏆 RANKING GLOBAL 🏆
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Conquiste a liderança e mostre seu poder!
        </p>
      </div>

      {/* Pódio - Top 3 */}
      {topThree.length > 0 && (
        <div className="leaderboard-podium">
          {/* 2º Lugar */}
          {topThree[1] && (
            <div 
              className="podium-place second slide-in-right"
              onClick={() => navigate('/users')}
              style={{ animationDelay: '0.2s' }}
            >
              <div className="podium-avatar">
                <div className="podium-medal">🥈</div>
                {((topThree[1].user_name || topThree[1].user || '?') + '').charAt(0).toUpperCase()}
              </div>
              <div className="podium-base">
                <div className="podium-name">{topThree[1].user_name || topThree[1].user}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  {topThree[1].team_name || topThree[1].team}
                </div>
                <div className="podium-points">{topThree[1].total_points}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>pontos</div>
                {getAchievementBadges(topThree[1].total_points).slice(0, 1).map((badge, idx) => (
                  <div key={idx} className={`achievement-badge badge-${badge.color}`} style={{ marginTop: '0.5rem' }}>
                    {badge.icon} {badge.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 1º Lugar */}
          {topThree[0] && (
            <div 
              className="podium-place first slide-in-right"
              onClick={() => navigate('/users')}
              style={{ animationDelay: '0.1s' }}
            >
              <div className="podium-avatar">
                <div className="podium-medal">🥇</div>
                {((topThree[0].user_name || topThree[0].user || '?') + '').charAt(0).toUpperCase()}
              </div>
              <div className="podium-base">
                <div className="podium-name">{topThree[0].user_name || topThree[0].user}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  {topThree[0].team_name || topThree[0].team}
                </div>
                <div className="podium-points">{topThree[0].total_points}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>pontos</div>
                {getAchievementBadges(topThree[0].total_points).slice(0, 1).map((badge, idx) => (
                  <div key={idx} className={`achievement-badge badge-${badge.color}`} style={{ marginTop: '0.5rem' }}>
                    {badge.icon} {badge.label}
                  </div>
                ))}
                <div style={{ marginTop: '0.5rem', fontSize: '1.2rem' }}>👑</div>
              </div>
            </div>
          )}

          {/* 3º Lugar */}
          {topThree[2] && (
            <div 
              className="podium-place third slide-in-right"
              onClick={() => navigate('/users')}
              style={{ animationDelay: '0.3s' }}
            >
              <div className="podium-avatar">
                <div className="podium-medal">🥉</div>
                {((topThree[2].user_name || topThree[2].user || '?') + '').charAt(0).toUpperCase()}
              </div>
              <div className="podium-base">
                <div className="podium-name">{topThree[2].user_name || topThree[2].user}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  {topThree[2].team_name || topThree[2].team}
                </div>
                <div className="podium-points">{topThree[2].total_points}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>pontos</div>
                {getAchievementBadges(topThree[2].total_points).slice(0, 1).map((badge, idx) => (
                  <div key={idx} className={`achievement-badge badge-${badge.color}`} style={{ marginTop: '0.5rem' }}>
                    {badge.icon} {badge.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lista do Resto */}
      {restOfLeaderboard.length > 0 && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            marginBottom: '1.5rem',
            color: 'var(--text-primary)',
            textAlign: 'center'
          }}>
            🎯 Classificação Geral
          </h2>
          <ul className="leaderboard-list">
            {restOfLeaderboard.map((entry, index) => {
              const actualRank = index + 4;
              const badges = getAchievementBadges(entry.total_points);
              
              return (
                <li 
                  key={entry.id || index} 
                  className="leaderboard-item fade-in"
                  onClick={() => navigate('/users')}
                  style={{ animationDelay: `${(index + 3) * 0.05}s` }}
                >
                  <div className="leaderboard-rank">
                    #{actualRank}
                  </div>
                  <div 
                    className="leaderboard-avatar"
                    style={{ background: getAvatarColor(index + 3) }}
                  >
                    {((entry.user_name || entry.user || '?') + '').charAt(0).toUpperCase()}
                  </div>
                  <div className="leaderboard-info">
                    <div className="leaderboard-name">{entry.user_name || entry.user}</div>
                    <div className="leaderboard-team">{entry.team_name || entry.team}</div>
                    {badges.length > 0 && (
                      <div className="badge-container" style={{ marginTop: '0.5rem' }}>
                        {badges.slice(0, 2).map((badge, idx) => (
                          <span key={idx} style={{ marginRight: '0.5rem' }}>
                            {badge.icon}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="leaderboard-points">
                    {entry.total_points}
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: '400' }}>
                      pontos
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {leaderboard.length === 0 && (
        <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏃</div>
          <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
            Nenhum atleta no ranking ainda. Seja o primeiro!
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="glass-card" style={{ marginTop: '3rem', maxWidth: '800px', margin: '3rem auto 0' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>🏅 Conquistas</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⭐</span>
            <div>
              <div style={{ fontWeight: '700' }}>Lenda</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>1000+ pontos</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💎</span>
            <div>
              <div style={{ fontWeight: '700' }}>Elite</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>500+ pontos</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🔥</span>
            <div>
              <div style={{ fontWeight: '700' }}>Em Chamas</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>250+ pontos</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>⚡</span>
            <div>
              <div style={{ fontWeight: '700' }}>Ativo</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>100+ pontos</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
