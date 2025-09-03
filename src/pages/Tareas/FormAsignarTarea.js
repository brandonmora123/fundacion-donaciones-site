// src/pages/Tareas/FormAsignarTarea.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function FormAsignarTarea() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [campanas, setCampanas] = useState([]);
  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    id_campana: '',
    id_usuario_asignado: '',
    fecha_asignacion: new Date().toISOString().split('T')[0],
    fecha_limite: '',
    prioridad: 'Media'
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        const [usuariosRes, campanasRes] = await Promise.all([
          axios.get('https://agile-nature-production.up.railway.app/api/usuarios', { headers }),
          axios.get('https://agile-nature-production.up.railway.app/api/campanas', { headers })
        ]);

        setUsuarios(usuariosRes.data);
        setCampanas(campanasRes.data);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };
    cargarDatos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.titulo || !form.id_usuario_asignado || !form.prioridad) {
      setError('Los campos obligatorios son requeridos');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('https://agile-nature-production.up.railway.app/api/tareas', form, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert('✅ Tarea asignada con éxito');
      navigate('/tareas');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al asignar tarea';
      setError(errorMsg);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="card shadow">
        <div className="card-header bg-warning text-white">
          <h4>📋 Asignar Nueva Tarea</h4>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Título *</label>
              <input
                type="text"
                name="titulo"
                className="form-control"
                value={form.titulo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                name="descripcion"
                className="form-control"
                value={form.descripcion}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Campaña (opcional)</label>
                <select
                  name="id_campana"
                  className="form-control"
                  value={form.id_campana}
                  onChange={handleChange}
                >
                  <option value="">Ninguna</option>
                  {campanas.map(c => (
                    <option key={c.id_campana} value={c.id_campana}>
                      {c.nombre} ({c.estado})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Asignar a *</label>
                <select
                  name="id_usuario_asignado"
                  className="form-control"
                  value={form.id_usuario_asignado}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar usuario...</option>
                  {usuarios.map(u => (
                    <option key={u.id_usuario} value={u.id_usuario}>
                      {u.nombre} {u.apellido} ({u.rol})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Fecha de Asignación *</label>
                <input
                  type="date"
                  name="fecha_asignacion"
                  className="form-control"
                  value={form.fecha_asignacion}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Fecha Límite</label>
                <input
                  type="date"
                  name="fecha_limite"
                  className="form-control"
                  value={form.fecha_limite}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Prioridad *</label>
                <select
                  name="prioridad"
                  className="form-control"
                  value={form.prioridad}
                  onChange={handleChange}
                  required
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-warning">Asignar Tarea</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormAsignarTarea;