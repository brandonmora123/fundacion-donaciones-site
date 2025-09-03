// src/pages/Beneficiarios/PerfilBeneficiario.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function PerfilBeneficiario() {
  const { id } = useParams();
  const [beneficiario, setBeneficiario] = useState(null);
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Solo dos peticiones: beneficiario + entregas
        const [benefRes, entregasRes] = await Promise.all([
          axios.get(`https://agile-nature-production.up.railway.app/api/beneficiarios/${id}`, { headers }),
          axios.get(`https://agile-nature-production.up.railway.app/api/entregas/beneficiario/${id}`, { headers })
        ]);

        setBeneficiario(benefRes.data);
        setEntregas(entregasRes.data);
      } catch (err) {
        console.error('Error al cargar perfil:', err);
        alert('No se pudo cargar el perfil del beneficiario.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>Cargando beneficiario...</div>;
  if (!beneficiario) return <div>Beneficiario no encontrado.</div>;

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>👥 Perfil del Beneficiario</h4>
        <Link to="/beneficiarios" className="btn btn-secondary">← Volver</Link>
      </div>

      <div className="card mb-4 shadow">
        <div className="card-body">
          <h5>{beneficiario.nombre} {beneficiario.apellido}</h5>
          <p><strong>Cédula:</strong> {beneficiario.cedula}</p>
          <p><strong>Teléfono:</strong> {beneficiario.telefono || 'N/A'}</p>
          <p><strong>Correo:</strong> {beneficiario.correo || 'N/A'}</p>
          <p><strong>Distrito:</strong> {beneficiario.nombre_distrito || 'No especificado'}</p>
          <p><strong>Cantón:</strong> {beneficiario.nombre_canton || 'No especificado'}</p>
          <p><strong>Provincia:</strong> {beneficiario.nombre_provincia || 'No especificado'}</p>
          <p><strong>Dirección:</strong> {beneficiario.direccion_exacta || 'N/A'}</p>
          <p><strong>Grupo Familiar:</strong> {beneficiario.grupo_familiar || 'No especificado'}</p>
          <p><strong>Observaciones:</strong> {beneficiario.observaciones || 'Ninguna'}</p>
        </div>
      </div>

      <h5>📦 Historial de Entregas</h5>
      {entregas.length === 0 ? (
        <p>Este beneficiario no ha recibido entregas aún.</p>
      ) : (
        <table className="table table-striped">
          <thead className="table-light">
            <tr>
              <th>Paquete</th>
              <th>Fecha</th>
              <th>Entregado por</th>
              <th>Observaciones</th>
            </tr>
          </thead>
          <tbody>
            {entregas.map(e => (
              <tr key={e.id_entrega}>
                <td>{e.nombre_paquete}</td>
                <td>{e.fecha_entrega}</td>
                <td>{e.responsable}</td>
                <td>{e.observaciones || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PerfilBeneficiario;