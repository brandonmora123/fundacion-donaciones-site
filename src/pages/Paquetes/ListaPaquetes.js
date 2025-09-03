// src/pages/Paquetes/ListaPaquetes.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ListaPaquetes = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPaquetes = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://agile-nature-production.up.railway.app/api/paquetes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPaquetes(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error('Error al cargar paquetes:', err.response?.data || err.message);
        setError('No se pudieron cargar los paquetes. Revisa tu sesión.');
      } finally {
        setLoading(false);
      }
    };
    fetchPaquetes();
  }, []);

  if (loading) return <div>Cargando paquetes...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h4>🎁 Paquetes Disponibles</h4>
      <div className="d-flex justify-content-end mb-3">
        <Link to="/paquetes/crear" className="btn btn-success">+ Crear Paquete</Link>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre</th>
            <th>Fecha Armado</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paquetes.map(p => (
            <tr key={p.id_paquete}>
              <td>{p.codigo_unico}</td>
              <td>{p.nombre}</td>
              <td>{p.fecha_armado}</td>
              <td>
                <span className={`badge ${
                  p.estado === 'Disponible' ? 'bg-success' :
                  p.estado === 'Entregado' ? 'bg-primary' : 'bg-warning'
                }`}>
                  {p.estado}
                </span>
              </td>
              <td>
                <Link to={`/paquetes/${p.codigo_unico}`} className="btn btn-sm btn-info">Ver</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaPaquetes;
