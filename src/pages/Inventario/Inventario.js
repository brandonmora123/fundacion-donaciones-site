import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Inventario() {
  const [donaciones, setDonaciones] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const fetchDonaciones = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await axios.get('https://agile-nature-production.up.railway.app/api/donaciones', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setDonaciones(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchDonaciones();
  }, []);

  const vencidas = donaciones.filter(d => d.fecha_vencimiento && new Date(d.fecha_vencimiento) < new Date());
  const proximas = donaciones.filter(d => d.fecha_vencimiento && new Date(d.fecha_vencimiento) >= new Date() && new Date(d.fecha_vencimiento) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));

  const filtradas = donaciones.filter(d =>
    d.descripcion.toLowerCase().includes(filtro.toLowerCase()) ||
    d.categoria.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <h4>📋 Gestión de Inventario</h4>
      <div className="alert alert-warning">
        {vencidas.length} artículos vencidos | {proximas.length} próximos a vencer (7 días)
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar por descripción o categoría..."
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
        />
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Fecha Ingreso</th>
            <th>Fecha Vencimiento</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {filtradas.map(d => (
            <tr key={d.id_donacion} className={d.fecha_vencimiento && new Date(d.fecha_vencimiento) < new Date() ? 'table-danger' : ''}>
              <td>{d.descripcion}</td>
              <td>{d.categoria}</td>
              <td>{d.cantidad} {d.unidad}</td>
              <td>{d.fecha_ingreso}</td>
              <td>{d.fecha_vencimiento || 'N/A'}</td>
              <td>
                <span className={`badge ${d.estado === 'Disponible' ? 'bg-success' : 'bg-secondary'}`}>
                  {d.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventario;