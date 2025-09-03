// src/pages/Paquetes/DetallePaquete.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function DetallePaquete() {
  const { id } = useParams(); // este será el código del paquete
  const [paquete, setPaquete] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaquete = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:3001/api/paquetes/codigo/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setPaquete(res.data);
      } catch (err) {
        console.error(err.response || err);
        setError(err.response?.data?.error || 'Error al cargar el paquete');
      } finally {
        setLoading(false);
      }
    };

    fetchPaquete();
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container-fluid p-4">
      <h4>📦 Detalle del Paquete (Composición y Trazabilidad)</h4>
      <div className="card mb-3">
        <div className="card-body">
          <p><strong>Código:</strong> {paquete.codigo_unico}</p>
          <p><strong>Nombre:</strong> {paquete.nombre}</p>
          <p><strong>Descripción:</strong> {paquete.descripcion}</p>
          <p><strong>Fecha de Armado:</strong> {paquete.fecha_armado}</p>
          <p>
            <strong>Estado:</strong>{' '}
            <span className={`badge ${paquete.estado === 'Disponible' ? 'bg-success' : 'bg-primary'}`}>
              {paquete.estado}
            </span>
          </p>
          <p>
            <strong>Preparado por:</strong> {paquete.preparador_nombre} {paquete.preparador_apellido}
          </p>
        </div>
      </div>

      <h5 className="mt-4">Composición del Paquete</h5>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Donación</th>
            <th>Cantidad Usada</th>
            <th>Unidad</th>
          </tr>
        </thead>
        <tbody>
          {paquete.donaciones?.map((d, idx) => (
            <tr key={idx}>
              <td>{d.descripcion}</td>
              <td>{d.cantidad_usada}</td>
              <td>{d.unidad}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DetallePaquete;
