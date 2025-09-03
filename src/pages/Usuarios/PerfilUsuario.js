// src/pages/Usuarios/PerfilUsuario.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PerfilUsuario({ user: propUser }) {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const user = propUser || storedUser;

  const [form, setForm] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    correo: user?.correo || '',
    contrasena: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Sincroniza si el user cambia
  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        correo: user.correo || '',
        contrasena: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validación básica
    if (!form.nombre || !form.apellido || !form.correo) {
      setError('Por favor, completa todos los campos obligatorios.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userId = user.id_usuario;

      await axios.put(`https://agile-nature-production.up.railway.app/api/usuarios/${userId}`, form, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Actualizar localStorage
      const updatedUser = { ...storedUser, ...form };
      delete updatedUser.contrasena; // No guardar contraseña
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setSuccess('✅ Perfil actualizado con éxito');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al actualizar el perfil';
      setError(errorMsg);
      console.error('Error al actualizar perfil:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger">
          No se pudo cargar la información del usuario. Por favor, inicia sesión nuevamente.
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4>🔐 Perfil del Usuario</h4>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Apellido *</label>
                <input
                  type="text"
                  name="apellido"
                  className="form-control"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Correo *</label>
              <input
                type="email"
                name="correo"
                className="form-control"
                value={form.correo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nueva Contraseña</label>
              <input
                type="password"
                name="contrasena"
                className="form-control"
                value={form.contrasena}
                onChange={handleChange}
                placeholder="Deja en blanco si no deseas cambiarla"
              />
              <small className="text-muted">Opcional. Deja vacío para mantener la actual.</small>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Actualizando...' : 'Actualizar Perfil'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PerfilUsuario;