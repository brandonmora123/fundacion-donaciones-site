// src/pages/Donantes/PerfilDonante.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function PerfilDonante() {
  const { id } = useParams();
  const [donante, setDonante] = useState(null);
  const [donaciones, setDonaciones] = useState([]);
  const [mensaje, setMensaje] = useState(''); // Nuevo estado para mensajes

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Llamadas a la API
        const donanteRes = await axios.get(`http://localhost:3001/api/donantes/${id}`, { headers });

        let donacionesRes;
        try {
          donacionesRes = await axios.get(`http://localhost:3001/api/donaciones/donante/${id}`, { headers });
          setDonaciones(donacionesRes.data);
          if (donacionesRes.data.length === 0) {
            setMensaje('Este donante aún no tiene donaciones.');
          }
        } catch (err) {
          if (err.response?.status === 404) {
            // No hay donaciones
            setDonaciones([]);
            setMensaje('Este donante aún no tiene donaciones.');
          } else {
            throw err;
          }
        }

        setDonante(donanteRes.data);
      } catch (err) {
        console.error('Error al cargar perfil:', err);
        setMensaje('Ocurrió un error al cargar los datos del donante.');
      }
    };

    fetchData();
  }, [id]);

  if (!donante) return <div>Cargando...</div>;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>👤 Perfil del Donante</h4>
        <Link to="/donantes" className="btn btn-secondary">← Volver</Link>
      </div>

      <div className="card mb-4 shadow">
        <div className="card-body">
          <h5>{donante.nombre} {donante.apellido}</h5>
          <p><strong>Empresa:</strong> {donante.empresa || 'N/A'}</p>
          <p><strong>Teléfono:</strong> {donante.telefono}</p>
          <p><strong>Correo:</strong> {donante.correo || 'N/A'}</p>
          <p><strong>Tipo:</strong> <span className="badge bg-info">{donante.tipo_donante}</span></p>
        </div>
      </div>

      <h5>📦 Historial de Donaciones</h5>
      {mensaje && <p className="text-muted">{mensaje}</p>}
      {donaciones.length > 0 && (
        <table className="table table-striped">
          <thead className="table-light">
            <tr>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {donaciones.map(d => (
              <tr key={d.id_donacion}>
                <td>{d.descripcion}</td>
                <td>{d.cantidad} {d.unidad}</td>
                <td>{d.fecha_ingreso}</td>
                <td>
                  <span className={`badge ${d.estado === 'Disponible' ? 'bg-success' : 'bg-secondary'}`}>
                    {d.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PerfilDonante;
