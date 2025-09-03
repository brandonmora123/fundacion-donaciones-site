// src/pages/Tareas/ListaTareas.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ListaTareas() {
  const [tareas, setTareas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarTareas = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3001/api/tareas', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setTareas(res.data);
      } catch (err) {
        console.error('Error al cargar tareas:', err);
      } finally {
        setLoading(false);
      }
    };
    cargarTareas();
  }, []);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta tarea?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/tareas/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setTareas(tareas.filter(t => t.id_tarea !== id));
    } catch (err) {
      alert('Error al eliminar');
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>📋 Gestión de Tareas</h4>
        <Link to="/tareas/nueva" className="btn btn-warning">+ Nueva Tarea</Link>
      </div>

      {loading ? (
        <div>Cargando tareas...</div>
      ) : (
        <table className="table table-striped">
          <thead className="table-dark">
            <tr>
              <th>Título</th>
              <th>Asignado a</th>
              <th>Campaña</th>
              <th>Fecha Límite</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tareas.map(t => (
              <tr key={t.id_tarea}>
                <td>{t.titulo}</td>
                <td>{t.asignado_a}</td>
                <td>{t.nombre_campana || 'N/A'}</td>
                <td>{t.fecha_limite || 'Sin fecha'}</td>
                <td>
                  <span className={`badge ${
                    t.prioridad === 'Alta' ? 'bg-danger' :
                    t.prioridad === 'Media' ? 'bg-warning text-dark' : 'bg-secondary'
                  }`}>
                    {t.prioridad}
                  </span>
                </td>
                <td>
                  <span className={`badge ${
                    t.estado === 'Completada' ? 'bg-success' :
                    t.estado === 'En progreso' ? 'bg-info' : 'bg-secondary'
                  }`}>
                    {t.estado}
                  </span>
                </td>
                <td>
                  <Link to={`/tareas/${t.id_tarea}/editar`} className="btn btn-sm btn-info me-1">Editar</Link>
                  <button onClick={() => handleEliminar(t.id_tarea)} className="btn btn-sm btn-danger">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ListaTareas;