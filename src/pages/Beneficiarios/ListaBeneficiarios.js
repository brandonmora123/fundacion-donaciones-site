import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ListaBeneficiarios() {
  const navigate = useNavigate();

  const [beneficiarios, setBeneficiarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBeneficiarios = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get('https://agile-nature-production.up.railway.app/api/beneficiarios', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setBeneficiarios(res.data);
      } catch (err) {
        console.error('Error al cargar beneficiarios:', err);
        setError('No se pudieron cargar los beneficiarios.');
      } finally {
        setLoading(false);
      }
    };
    fetchBeneficiarios();
  }, []);

  return (
    <div className="container-fluid p-4">
      <h4>👥 Gestión de Beneficiarios</h4>

      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-success" onClick={() => navigate('/beneficiarios/nuevo')}>
          + Nuevo Beneficiario
        </button>
      </div>

      {loading && <div className="alert alert-info">Cargando beneficiarios...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Distrito</th>
              <th>Grupo Familiar</th>
            </tr>
          </thead>
          <tbody>
            {beneficiarios.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center">No hay beneficiarios registrados</td>
              </tr>
            ) : (
              beneficiarios.map(b => (
                <tr key={b.id_beneficiario}>
                  <td>{b.nombre} {b.apellido}</td>
                  <td>{b.telefono}</td>
                  <td>{b.distrito}</td>
                  <td>{b.grupo_familiar}</td>
                  <td>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ListaBeneficiarios;
