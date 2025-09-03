// src/pages/Donaciones/FormDonacion.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FormDonacion() {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.id_usuario;

  const [form, setForm] = useState({
    tipo: 'En especie',
    descripcion: '',
    cantidad: '',
    unidad: 'Unidades',
    valor_monetario: '',
    fecha_ingreso: new Date().toISOString().split('T')[0],
    id_categoria: '',
    id_donante: '',
    id_campana: '',
    fecha_vencimiento: '',
    id_usuario: userId,
    estado: 'Disponible'
  });

  const [donantes, setDonantes] = useState([]);
  const [campanas, setCampanas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar donantes y campañas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const donantesRes = await axios.get('https://agile-nature-production.up.railway.app/api/donantes', { headers });
        const campanasRes = await axios.get('https://agile-nature-production.up.railway.app/api/campanas', { headers });

        setDonantes(Array.isArray(donantesRes.data) ? donantesRes.data : []);
        setCampanas(Array.isArray(campanasRes.data) ? campanasRes.data : []);
      } catch (err) {
        console.error('Error al cargar donantes/campañas:', err.response?.data || err.message);
        setError('No se pudieron cargar los donantes o campañas. Revisa tu sesión.');
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones
    if (!form.descripcion || !form.id_categoria) {
      setError('Por favor, completa todos los campos requeridos.');
      setLoading(false);
      return;
    }

    if (form.tipo === 'En especie' && !form.cantidad) {
      setError('Por favor, indica la cantidad para la donación en especie.');
      setLoading(false);
      return;
    }

    if (form.tipo === 'Monetaria' && !form.valor_monetario) {
      setError('Por favor, indica el valor monetario para la donación.');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await axios.post('https://agile-nature-production.up.railway.app/api/donaciones', {
        ...form,
        cantidad: form.tipo === 'En especie' ? Number(form.cantidad) : null,
        valor_monetario: form.tipo === 'Monetaria' ? Number(form.valor_monetario) : null,
        id_donante: form.id_donante || null,
        id_campana: form.id_campana || null,
        id_usuario: userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('✅ Donación registrada con éxito');

      // Reset formulario
      setForm({
        tipo: 'En especie',
        descripcion: '',
        cantidad: '',
        unidad: 'Unidades',
        valor_monetario: '',
        fecha_ingreso: new Date().toISOString().split('T')[0],
        id_categoria: '',
        id_donante: '',
        id_campana: '',
        fecha_vencimiento: '',
        id_usuario: userId,
        estado: 'Disponible'
      });

    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al registrar donación.';
      setError(errorMsg);
      console.error('Error al registrar donación:', err.response || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4>📦 Registrar Nueva Donación</h4>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Tipo de Donación</label>
                <select name="tipo" className="form-control" value={form.tipo} onChange={handleChange}>
                  <option value="En especie">En especie</option>
                  <option value="Monetaria">Monetaria</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Categoría *</label>
                <select name="id_categoria" className="form-control" value={form.id_categoria} onChange={handleChange} required>
                  <option value="">Seleccionar...</option>
                  <option value="1">Alimentos</option>
                  <option value="2">Ropa</option>
                  <option value="3">Higiene</option>
                  <option value="4">Útiles escolares</option>
                  <option value="5">Medicamentos</option>
                  <option value="6">Otros</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Descripción *</label>
              <input type="text" name="descripcion" className="form-control" value={form.descripcion} onChange={handleChange} required />
            </div>

            <div className="row mb-3">
              {form.tipo === 'En especie' && (
                <>
                  <div className="col-md-3">
                    <label className="form-label">Cantidad *</label>
                    <input type="number" name="cantidad" className="form-control" value={form.cantidad} onChange={handleChange} required min="1" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Unidad</label>
                    <select name="unidad" className="form-control" value={form.unidad} onChange={handleChange}>
                      <option value="Unidades">Unidades</option>
                      <option value="Kg">Kg</option>
                      <option value="Litros">Litros</option>
                      <option value="Paquetes">Paquetes</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Fecha Vencimiento</label>
                    <input type="date" name="fecha_vencimiento" className="form-control" value={form.fecha_vencimiento} onChange={handleChange} />
                  </div>
                </>
              )}
              <div className="col-md-3">
                <label className="form-label">Fecha Ingreso *</label>
                <input type="date" name="fecha_ingreso" className="form-control" value={form.fecha_ingreso} onChange={handleChange} required />
              </div>
              {form.tipo === 'Monetaria' && (
                <div className="col-md-3">
                  <label className="form-label">Valor Monetario *</label>
                  <input type="number" name="valor_monetario" className="form-control" value={form.valor_monetario} onChange={handleChange} required min="1" />
                </div>
              )}
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Donante (opcional)</label>
                <select name="id_donante" className="form-control" value={form.id_donante} onChange={handleChange}>
                  <option value="">Seleccionar donante...</option>
                  {donantes.map(d => (
                    <option key={d.id_donante} value={d.id_donante}>
                      {d.nombre} {d.apellido} {d.empresa && `(${d.empresa})`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label">Campaña (opcional)</label>
                <select name="id_campana" className="form-control" value={form.id_campana} onChange={handleChange}>
                  <option value="">Seleccionar campaña...</option>
                  {campanas.map(c => (
                    <option key={c.id_campana} value={c.id_campana}>
                      {c.nombre} ({c.estado})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Registrando...' : 'Registrar Donación'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormDonacion;
