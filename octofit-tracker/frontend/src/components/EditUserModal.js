import React, { useState, useEffect } from 'react';
import '../styles/Modal.css';

function EditUserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    weight: '',
    height: '',
    age: '',
    gender: '',
    fitness_goal: '',
    bio: '',
    team: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        weight: user.weight || '',
        height: user.height || '',
        age: user.age || '',
        gender: user.gender || '',
        fitness_goal: user.fitness_goal || '',
        bio: user.bio || '',
        team: user.team || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/${user._id}/`;
      
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          height: formData.height ? parseFloat(formData.height) : null,
          age: formData.age ? parseInt(formData.age) : null
        })
      });

      if (!response.ok) {
        throw new Error(`Erro ao salvar: ${response.status}`);
      }

      const updatedUser = await response.json();
      onSave(updatedUser);
      onClose();
    } catch (err) {
      console.error('Error saving user:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>✏️ Editar Atleta</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-section">
            <h3>Informações Básicas</h3>
            
            <div className="form-group">
              <label htmlFor="name">Nome Completo *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Digite o nome completo"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Digite o e-mail"
              />
            </div>

            <div className="form-group">
              <label htmlFor="team">Time</label>
              <input
                type="text"
                id="team"
                name="team"
                value={formData.team}
                onChange={handleChange}
                placeholder="Nome do time"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Informações Físicas</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="weight">Peso (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  placeholder="Ex: 70.5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="height">Altura (cm)</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  step="0.1"
                  min="0"
                  placeholder="Ex: 175"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Idade</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  min="0"
                  placeholder="Ex: 25"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gender">Gênero</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Selecione</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                  <option value="O">Outro</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Objetivos e Biografia</h3>
            
            <div className="form-group">
              <label htmlFor="fitness_goal">Objetivo de Fitness</label>
              <input
                type="text"
                id="fitness_goal"
                name="fitness_goal"
                value={formData.fitness_goal}
                onChange={handleChange}
                placeholder="Ex: Perder peso, Ganhar massa muscular, Melhorar resistência"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Sobre o Atleta</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                placeholder="Conte um pouco sobre você, suas conquistas, hobbies..."
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? '💾 Salvando...' : '💾 Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;
