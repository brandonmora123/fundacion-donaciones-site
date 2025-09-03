// src/pages/Campanas/GestionarCampanas.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function GestionarCampanas() {
  const [campanas, setCampanas] = useState([]);
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'Planificada',
    objetivo_donaciones: 0,
    objetivo_beneficiarios: 0
  });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCampanas = async () => {
      try {
        const res = await axios.get('https://agile-nature-production.up.railway.app/api/campanas', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCampanas(res.data);
      } catch (err) {
        console.error('Error al cargar campañas:', err);
      }
    };
    fetchCampanas();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Convertir metas a número
    if (name === 'objetivo_donaciones' || name === 'objetivo_beneficiarios') {
      setForm({ ...form, [name]: Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('https://agile-nature-production.up.railway.app/api/campanas', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('✅ Campaña creada con éxito');

      // Reset del formulario
      setForm({
        nombre: '',
        descripcion: '',
        fecha_inicio: '',
        fecha_fin: '',
        estado: 'Planificada',
        objetivo_donaciones: 0,
        objetivo_beneficiarios: 0
      });

      // Recargar lista
      const res = await axios.get('https://agile-nature-production.up.railway.app/api/campanas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCampanas(res.data);
    } catch (err) {
      alert('❌ Error al crear campaña: ' + (err.response?.data?.error || 'Verifica los datos'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <h4>🎯 Gestión de Campañas</h4>

      {/* Formulario */}
      <div className="card mb-4 shadow">
        <div className="card-header bg-warning text-dark">
          <h5>➕ Nueva Campaña</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Nombre</label>
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
                <label className="form-label">Estado</label>
                <select
                  name="estado"
                  className="form-control"
                  value={form.estado}
                  onChange={handleChange}
                >
                  <option value="Planificada">Planificada</option>
                  <option value="En curso">En curso</option>
                  <option value="Finalizada">Finalizada</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Descripción</label>
              <textarea
                name="descripcion"
                className="form-control"
                value={form.descripcion}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label">Inicio</label>
                <input
                  type="date"
                  name="fecha_inicio"
                  className="form-control"
                  value={form.fecha_inicio}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Fin</label>
                <input
                  type="date"
                  name="fecha_fin"
                  className="form-control"
                  value={form.fecha_fin}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Meta Donaciones</label>
                <input
                  type="number"
                  name="objetivo_donaciones"
                  className="form-control"
                  value={form.objetivo_donaciones}
                  onChange={handleChange}
                  min={0}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Meta Beneficiarios</label>
                <input
                  type="number"
                  name="objetivo_beneficiarios"
                  className="form-control"
                  value={form.objetivo_beneficiarios}
                  onChange={handleChange}
                  min={0}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-warning" disabled={loading}>
              {loading ? 'Guardando...' : 'Crear Campaña'}
            </button>
          </form>
        </div>
      </div>

      {/* Lista de campañas */}
      <h5>📋 Campañas Activas</h5>
      <table className="table table-striped">
        <thead className="table-warning">
          <tr>
            <th>Nombre</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Estado</th>
            <th>Metas</th>
          </tr>
        </thead>
        <tbody>
          {campanas.map(c => (
            <tr key={c.id_campana}>
              <td>{c.nombre}</td>
              <td>{c.fecha_inicio}</td>
              <td>{c.fecha_fin || 'N/A'}</td>
              <td>
                <span
                  className={`badge ${
                    c.estado === 'En curso'
                      ? 'bg-success'
                      : c.estado === 'Planificada'
                      ? 'bg-warning'
                      : 'bg-secondary'
                  }`}
                >
                  {c.estado}
                </span>
              </td>
              <td>
                Donaciones: {c.objetivo_donaciones || '0'} | Beneficiarios: {c.objetivo_beneficiarios || '0'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GestionarCampanas;
