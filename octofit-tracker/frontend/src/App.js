import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function Sidebar() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { path: '/', icon: '🏠', label: 'Dashboard' },
    { path: '/users', icon: '👥', label: 'Atletas' },
    { path: '/teams', icon: '🏆', label: 'Times' },
    { path: '/activities', icon: '⚡', label: 'Atividades' },
    { path: '/workouts', icon: '💪', label: 'Treinos' },
    { path: '/leaderboard', icon: '🎯', label: 'Ranking' },
  ];

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🏋️</div>
        <div className="sidebar-logo-text">OctoFit</div>
      </div>

      <nav>
        <ul className="sidebar-nav">
          {menuItems.map((item) => (
            <li key={item.path} className="sidebar-nav-item">
              <Link
                to={item.path}
                className={`sidebar-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ marginTop: 'auto', padding: '1rem' }}>
        <div className="glass-card" style={{ padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔥</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Continue treinando!
          </div>
        </div>
      </div>
    </aside>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <div className="app-background"></div>
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
