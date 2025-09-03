import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CrearPaquete = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [donaciones, setDonaciones] = useState([{ id_donacion: '', cantidad: '' }]);
  const [donacionesDisponibles, setDonacionesDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar donaciones disponibles
  useEffect(() => {
    const cargarDonaciones = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://agile-nature-production.up.railway.app/api/donaciones', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        // Filtrar solo las disponibles
        const disponibles = res.data.filter(d => d.estado === 'Disponible');
        setDonacionesDisponibles(disponibles);
      } catch (err) {
        console.error('Error al cargar donaciones:', err);
        setError('No se pudieron cargar las donaciones.');
      } finally {
        setLoading(false);
      }
    };
    cargarDonaciones();
  }, []);

  const agregarDonacion = () => {
    setDonaciones([...donaciones, { id_donacion: '', cantidad: '' }]);
  };

  const handleChange = (index, field, value) => {
    const nuevas = [...donaciones];
    nuevas[index][field] = value;
    setDonaciones(nuevas);
  };

  const eliminarDonacion = (index) => {
    setDonaciones(donaciones.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre) {
      setError('El nombre del paquete es obligatorio');
      return;
    }

    if (donaciones.some(d => !d.id_donacion || !d.cantidad || d.cantidad <= 0)) {
      setError('Todas las donaciones deben tener ID y cantidad mayor a 0');
      return;
    }

    try {
      const paquete = {
        nombre,
        descripcion,
        donaciones: donaciones.map(d => ({
          id_donacion: parseInt(d.id_donacion, 10),
          cantidad_usada: parseInt(d.cantidad, 10)
        }))
      };

      await axios.post('https://agile-nature-production.up.railway.app/api/paquetes', paquete, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      alert('✅ Paquete creado con éxito');
      window.location.href = '/paquetes';
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Error al crear el paquete';
      setError(`❌ ${errorMsg}`);
      console.error('Error al crear paquete:', err);
    }
  };

  return (
    <div className="container-fluid p-4">
      <h4>🎁 Crear Nuevo Paquete</h4>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nombre del Paquete *</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Descripción</label>
          <textarea
            className="form-control"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            rows="2"
          />
        </div>

        <h5>Contenido del Paquete</h5>
        {loading ? (
          <p>Cargando donaciones disponibles...</p>
        ) : (
          donaciones.map((d, index) => (
            <div className="row mb-2" key={index}>
              <div className="col-md-5">
                <select
                  className="form-control"
                  value={d.id_donacion}
                  onChange={e => handleChange(index, 'id_donacion', e.target.value)}
                  required
                >
                  <option value="">Seleccionar donación...</option>
                  {donacionesDisponibles.map(don => (
                    <option key={don.id_donacion} value={don.id_donacion}>
                      {don.descripcion} ({don.cantidad} {don.unidad})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-5">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Cantidad a usar"
                  value={d.cantidad}
                  onChange={e => handleChange(index, 'cantidad', e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div className="col-md-2 d-flex align-items-center">
                <button
                  type="button"
                  className="btn btn-danger btn-sm w-100"
                  onClick={() => eliminarDonacion(index)}
                >
                  ×
                </button>
              </div>
            </div>
          ))
        )}

        <button type="button" className="btn btn-secondary btn-sm mb-3" onClick={agregarDonacion}>
          + Agregar Donación
        </button>

        <button type="submit" className="btn btn-primary">
          Crear Paquete
        </button>
      </form>
    </div>
  );
};

export default CrearPaquete;