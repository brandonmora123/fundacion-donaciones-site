// src/pages/Donaciones/FormDonacion.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function FormDonacion() {
  // Obtener el usuario desde localStorage
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userId = storedUser?.id_usuario;

  const [form, setForm] = useState({
    tipo: 'En especie',
    descripcion: '',
    cantidad: '',
    unidad: 'Unidades',
    valor_monetario: null,
    fecha_ingreso: new Date().toISOString().split('T')[0],
    id_categoria: '',
    id_donante: '', // Puede ser null
    id_campana: '', // Puede ser null
    fecha_vencimiento: '',
    id_usuario: userId, // Se asigna automáticamente
    estado: 'Disponible' // Estado inicial
  });

  const [donantes, setDonantes] = useState([]);
  const [campanas, setCampanas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cargar donantes y campañas al iniciar
  useEffect(() => {
    const fetchData = async () => {
      // Depuración: Verificar usuario
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        console.log('Iniciando carga de donantes y campañas...');

        const [donantesRes, campanasRes] = await Promise.all([
          axios.get('http://localhost:3001/api/donantes', { headers }),
          axios.get('http://localhost:3001/api/campanas', { headers })
        ]);

        // Depuración: Ver respuestas
        console.log('Respuesta donantes:', donantesRes.data);
        console.log('Respuesta campañas:', campanasRes.data);

        // Validar y establecer datos
        const donantesData = Array.isArray(donantesRes.data) ? donantesRes.data : [];
        const campanasData = Array.isArray(campanasRes.data) ? campanasRes.data : [];

        setDonantes(donantesData);
        setCampanas(campanasData);

        if (donantesData.length === 0) {
          console.warn('No se encontraron donantes registrados.');
        }
        if (campanasData.length === 0) {
          console.warn('No se encontraron campañas activas.');
        }
      } catch (err) {
        console.error('Error al cargar donantes/campañas:', err);

        if (err.response) {
          // El servidor respondió con un estado fuera de 2xx
          if (err.response.status === 401) {
            setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          } else if (err.response.status === 404) {
            setError('No se encontraron las rutas del servidor. Verifica la API.');
          } else {
            setError(`Error ${err.response.status}: ${err.response.data?.error || 'No se pudieron cargar los datos.'}`);
          }
        } else if (err.request) {
          // La petición fue hecha pero no hubo respuesta
          setError('No se pudo conectar con el servidor. Verifica tu conexión o que el backend esté corriendo en el puerto 3001.');
        } else {
          // Algo pasó al configurar la petición
          setError('Error inesperado: ' + err.message);
        }
      }
    };

    fetchData();
  }, [userId]); // Se ejecuta cuando userId cambia

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validar campos obligatorios
    if (!form.descripcion || !form.cantidad || !form.id_categoria) {
      setError('Por favor, completa todos los campos requeridos.');
      setLoading(false);
      return;
    }

    // Preparar el objeto a enviar
    const donacionData = {
      ...form,
      cantidad: form.cantidad ? Number(form.cantidad) : null,
      valor_monetario: form.valor_monetario ? Number(form.valor_monetario) : null,
      id_donante: form.id_donante || null,
      id_campana: form.id_campana || null,
      id_usuario: userId
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token no disponible');
      }

      await axios.post('http://localhost:3001/api/donaciones', donacionData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert('✅ Donación registrada con éxito');
      
      // Reiniciar formulario
      setForm({
        tipo: 'En especie',
        descripcion: '',
        cantidad: '',
        unidad: 'Unidades',
        valor_monetario: null,
        fecha_ingreso: new Date().toISOString().split('T')[0],
        id_categoria: '',
        id_donante: '',
        id_campana: '',
        fecha_vencimiento: '',
        id_usuario: userId,
        estado: 'Disponible'
      });
    } catch (err) {
      const errorMsg = err.response?.data?.error || 
                       err.message || 
                       'Error al registrar donación. Verifica los datos.';
      setError(errorMsg);
      console.error('Error al registrar donación:', err);
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
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Tipo de Donación</label>
                <select 
                  name="tipo" 
                  className="form-control" 
                  value={form.tipo} 
                  onChange={handleChange} 
                  disabled
                >
                  <option value="En especie">En especie</option>
                  <option value="Monetaria">Monetaria</option>
                </select>
                <small className="text-muted">Actualmente solo se gestionan donaciones en especie.</small>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Categoría *</label>
                <select
                  name="id_categoria"
                  className="form-control"
                  value={form.id_categoria}
                  onChange={handleChange}
                  required
                >
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
              <label className="form-label">Descripción del Bien *</label>
              <input
                type="text"
                name="descripcion"
                className="form-control"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Arroz blanco, camisetas nuevas, jabón en barra..."
                required
              />
            </div>

            <div className="row">
              <div className="col-md-3 mb-3">
                <label className="form-label">Cantidad *</label>
                <input
                  type="number"
                  name="cantidad"
                  className="form-control"
                  value={form.cantidad}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Unidad</label>
                <select name="unidad" className="form-control" value={form.unidad} onChange={handleChange}>
                  <option value="Unidades">Unidades</option>
                  <option value="Kg">Kg</option>
                  <option value="Litros">Litros</option>
                  <option value="Paquetes">Paquetes</option>
                </select>
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Fecha de Ingreso *</label>
                <input
                  type="date"
                  name="fecha_ingreso"
                  className="form-control"
                  value={form.fecha_ingreso}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Fecha de Vencimiento</label>
                <input
                  type="date"
                  name="fecha_vencimiento"
                  className="form-control"
                  value={form.fecha_vencimiento}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Donante (opcional)</label>
                <select 
                  name="id_donante" 
                  className="form-control" 
                  value={form.id_donante} 
                  onChange={handleChange}
                >
                  <option value="">Seleccionar donante...</option>
                  {donantes.length === 0 ? (
                    <option disabled>No hay donantes disponibles</option>
                  ) : (
                    donantes.map(d => (
                      <option key={d.id_donante} value={d.id_donante}>
                        {d.nombre} {d.apellido} {d.empresa && `(${d.empresa})`}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Campaña (opcional)</label>
                <select 
                  name="id_campana" 
                  className="form-control" 
                  value={form.id_campana} 
                  onChange={handleChange}
                >
                  <option value="">Seleccionar campaña...</option>
                  {campanas.length === 0 ? (
                    <option disabled>No hay campañas disponibles</option>
                  ) : (
                    campanas.map(c => (
                      <option key={c.id_campana} value={c.id_campana}>
                        {c.nombre} ({c.estado})
                      </option>
                    ))
                  )}
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