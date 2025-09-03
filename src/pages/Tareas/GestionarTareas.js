import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function GestionarTareas() {
  const [tareas, setTareas] = useState([]);

  useEffect(() => {
    const fetchTareas = async () => {
      try {
        const res = await axios.get('https://agile-nature-production.up.railway.app/api/tareas', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setTareas(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTareas();
  }, []);

  return (
    <div>
      <h4>✅ Asignación de Tareas y Recordatorios</h4>
      <div className="d-flex justify-content-end mb-3">
      <Link to="/tareas/nuevo" className="btn btn-success">
        <button className="btn btn-success">+ Nueva Tarea</button>
      </Link>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Título</th>
            <th>Responsable</th>
            <th>Fecha Límite</th>
            <th>Prioridad</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {tareas.map(t => (
            <tr key={t.id_tarea}>
              <td>{t.titulo}</td>
              <td>{t.nombre_usuario}</td>
              <td>{t.fecha_limite || 'Sin fecha'}</td>
              <td><span className={`badge ${t.prioridad === 'Alta' ? 'bg-danger' : t.prioridad === 'Media' ? 'bg-warning' : 'bg-secondary'}`}>{t.prioridad}</span></td>
              <td><span className={`badge ${t.estado === 'Completada' ? 'bg-success' : t.estado === 'En proceso' ? 'bg-info' : 'bg-secondary'}`}>{t.estado}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GestionarTareas;