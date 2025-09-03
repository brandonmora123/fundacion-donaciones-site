import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HistorialEntregas() {
  const [entregas, setEntregas] = useState([]);

  useEffect(() => {
    const fetchEntregas = async () => {
      try {
        const res = await axios.get('https://agile-nature-production.up.railway.app/api/entregas', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setEntregas(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEntregas();
  }, []);

  return (
    <div>
      <h4>📦 Historial de Entregas por Beneficiario</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Paquete</th>
            <th>Beneficiario</th>
            <th>Responsable</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {entregas.map(e => (
            <tr key={e.id_entrega}>
              <td>{e.fecha_entrega}</td>
              <td>{e.codigo_paquete}</td>
              <td>{e.nombre_beneficiario}</td>
              <td>{e.nombre_usuario}</td>
              <td>{e.observaciones || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistorialEntregas;