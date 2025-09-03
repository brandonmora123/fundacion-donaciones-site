// src/pages/Beneficiarios/FormBeneficiario.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function FormBeneficiario() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    correo: '',
    id_distrito: '',
    direccion_exacta: '',
    grupo_familiar: '',
    observaciones: ''
  });
  const [distritos, setDistritos] = useState([]);
  const [error, setError] = useState('');

  // Cargar distritos (ajusta la ruta si es diferente)
  useEffect(() => {
    const cargarDistritos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://agile-nature-production.up.railway.app/api/distritos', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setDistritos(res.data);
      } catch (err) {
        console.error('Error al cargar distritos:', err);
      }
    };
    cargarDistritos();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.nombre || !form.apellido || !form.cedula) {
      setError('Nombre, apellido y cédula son obligatorios.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('https://agile-nature-production.up.railway.app/api/beneficiarios', form, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      alert('✅ Beneficiario registrado con éxito');
      navigate('/beneficiarios');
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Error al registrar beneficiario';
      setError(errorMsg);
      console.error('Error al registrar beneficiario:', err);
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4>👥 Registrar Nuevo Beneficiario</h4>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}

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
              <label className="form-label">Cédula *</label>
              <input
                type="text"
                name="cedula"
                className="form-control"
                value={form.cedula}
                onChange={handleChange}
                required
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  className="form-control"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Correo</label>
                <input
                  type="email"
                  name="correo"
                  className="form-control"
                  value={form.correo}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Distrito *</label>
              <select
                name="id_distrito"
                className="form-control"
                value={form.id_distrito}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar distrito...</option>
                {distritos.map(d => (
                  <option key={d.id_distrito} value={d.id_distrito}>
                    {d.nombre_distrito}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Dirección Exacta</label>
              <textarea
                name="direccion_exacta"
                className="form-control"
                value={form.direccion_exacta}
                onChange={handleChange}
                rows="2"
                placeholder="Calle, casa, barrio, punto de referencia"
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Grupo Familiar</label>
              <input
                type="text"
                name="grupo_familiar"
                className="form-control"
                value={form.grupo_familiar}
                onChange={handleChange}
                placeholder="Ej: 4 personas (padre, madre, 2 hijos)"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Observaciones</label>
              <textarea
                name="observaciones"
                className="form-control"
                value={form.observaciones}
                onChange={handleChange}
                rows="3"
                placeholder="Situación social, necesidades, etc."
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary">
              Registrar Beneficiario
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormBeneficiario;