// src/pages/Donantes/ListaDonantes.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ListaDonantes() {
  const [donantes, setDonantes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonantes = async () => {
      try {
        const res = await axios.get('https://agile-nature-production.up.railway.app/api/donantes', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setDonantes(res.data);
      } catch (err) {
        console.error('Error al cargar donantes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonantes();
  }, []);

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>❤️ Lista de Donantes</h4>
        <Link to="/donantes/nuevo" className="btn btn-success">
          ➕ Nuevo Donante
        </Link>
      </div>

      {loading ? (
        <div>Cargando donantes...</div>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="table-primary">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Empresa</th>
              <th>Teléfono</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {donantes.map(d => (
              <tr key={d.id_donante}>
                <td>{d.id_donante}</td>
                <td>{d.nombre} {d.apellido}</td>
                <td>{d.empresa || 'N/A'}</td>
                <td>{d.telefono}</td>
                <td><span className="badge bg-info">{d.tipo_donante}</span></td>
                <td>
                  <Link to={`/donantes/${d.id_donante}`} className="btn btn-sm btn-info">
                    Ver Perfil
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ListaDonantes;