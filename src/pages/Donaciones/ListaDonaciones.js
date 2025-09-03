import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importa Link en lugar de usar <a>
import axios from 'axios';

const ListaDonaciones = () => {
  const [donaciones, setDonaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonaciones = async () => {
      try {
        const res = await axios.get(
          'http://localhost:3001/api/donaciones',
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setDonaciones(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonaciones();
  }, []);

  return (
    <div>
      <h4>📋 Donaciones Registradas</h4>
      <div className="d-flex justify-content-end mb-3">
        {/* Usa Link en lugar de <a> para evitar recarga de página */}
        <Link to="/donaciones/nueva" className="btn btn-success">
          + Nueva Donación
        </Link>
      </div>
      {loading ? (
        <div className="text-center">Cargando...</div>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {donaciones.map((d) => (
              <tr key={d.id_donacion}>
                <td>{d.id_donacion}</td>
                <td>{d.tipo}</td>
                <td>{d.descripcion}</td>
                <td>
                  {d.cantidad} {d.unidad}
                </td>
                <td>{d.fecha_ingreso}</td>
                <td>
                  <span
                    className={`badge ${
                      d.estado === 'Disponible'
                        ? 'bg-success'
                        : d.estado === 'Asignada'
                        ? 'bg-warning'
                        : 'bg-secondary'
                    }`}
                  >
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
};

export default ListaDonaciones;
