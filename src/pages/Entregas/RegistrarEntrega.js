import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegistrarEntrega() {
  const navigate = useNavigate();

  const [codigo, setCodigo] = useState('');
  const [paquete, setPaquete] = useState(null);
  const [beneficiario, setBeneficiario] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [foto, setFoto] = useState(null);
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar beneficiarios al inicio
  useEffect(() => {
    const fetchBeneficiarios = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/beneficiarios', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBeneficiarios(res.data);
      } catch (err) {
        console.error('Error al cargar beneficiarios:', err);
      }
    };
    fetchBeneficiarios();
  }, []);

  const buscarPaquete = async () => {
    if (!codigo) {
      setError('Ingrese un código de paquete válido');
      return;
    }

    setLoading(true);
    setError('');
    setPaquete(null);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3001/api/paquetes/codigo/${codigo}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.estado !== 'Disponible') {
        setError('El paquete no está disponible para entrega');
      } else {
        setPaquete(res.data);
      }
    } catch (err) {
      setError('Paquete no encontrado');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paquete || !beneficiario) {
      setError('Seleccione un paquete y un beneficiario antes de registrar la entrega');
      return;
    }

    const formData = new FormData();
    formData.append('id_paquete', paquete.id_paquete);
    formData.append('id_beneficiario', beneficiario);
    formData.append('observaciones', observaciones);
    if (foto) formData.append('evidencia', foto);

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3001/api/entregas', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('✅ Entrega registrada con éxito');
      navigate('/entregas'); // redirige a listado de entregas
    } catch (err) {
      console.error('Error al registrar entrega:', err.response || err);
      setError(err.response?.data?.error || 'Error al registrar entrega');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-4">
      <h4>🚚 Registrar Entrega con Paquete y Evidencia Digital</h4>

      {/* Buscar Paquete */}
      <div className="card mb-4 shadow">
        <div className="card-body">
          <h5>🔍 Buscar Paquete</h5>
          <div className="input-group mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Ingrese código del paquete (ej: PKG-2025-001)"
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
            />
            <button className="btn btn-primary" onClick={buscarPaquete} disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          {paquete && (
            <div className="alert alert-success">
              Paquete encontrado: <strong>{paquete.nombre}</strong> - {paquete.descripcion}
            </div>
          )}
        </div>
      </div>

      {/* Formulario de Entrega */}
      {paquete && (
        <form onSubmit={handleSubmit} className="card shadow p-3">
          <div className="mb-3">
            <label>Beneficiario *</label>
            <select
              className="form-control"
              value={beneficiario}
              onChange={e => setBeneficiario(e.target.value)}
              required
            >
              <option value="">Seleccionar beneficiario...</option>
              {beneficiarios.map(b => (
                <option key={b.id_beneficiario} value={b.id_beneficiario}>
                  {b.nombre} {b.apellido}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label>Observaciones</label>
            <textarea
              className="form-control"
              value={observaciones}
              onChange={e => setObservaciones(e.target.value)}
              placeholder="Notas adicionales sobre la entrega"
            />
          </div>

          <div className="mb-3">
            <label>Evidencia Digital (foto)</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={e => setFoto(e.target.files[0])}
            />
          </div>

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Registrando...' : 'Registrar Entrega'}
          </button>
        </form>
      )}
    </div>
  );
}

export default RegistrarEntrega;
