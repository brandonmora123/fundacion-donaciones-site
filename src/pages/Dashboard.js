// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard({ user, onLogout }) {

  const [stats, setStats] = useState({
    inventario: 0,
    entregas: 0,
    campanas: 0,
    donacionesHoy: 0,
    donacionesSemana: {
      labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
      data: [0, 0, 0, 0, 0, 0, 0],
    },
    alertas: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No autorizado');

        const res = await axios.get('https://agile-nature-production.up.railway.app/api/dashboard/dash', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Mapear alertas correctamente (ya vienen como array de objetos)
        const alertas = res.data.alertas?.map(a => ({
          tipo: a.tipo || 'Alerta desconocida',
          descripcion: a.descripcion || 'Sin descripción',
        })) || [];

        // Validar donacionesSemana
        const donacionesSemana = res.data.donacionesSemana
          ? {
              labels: res.data.donacionesSemana.labels || ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
              data: res.data.donacionesSemana.data || [0, 0, 0, 0, 0, 0, 0],
            }
          : {
              labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
              data: [0, 0, 0, 0, 0, 0, 0],
            };

        setStats({
          inventario: res.data.inventario ?? 0,
          entregas: res.data.entregas ?? 0,
          campanas: res.data.campanas ?? 0,
          donacionesHoy: res.data.donacionesHoy ?? 0,
          donacionesSemana,
          alertas,
        });
      } catch (err) {
        console.error('Error al cargar el dashboard:', err);
        if (err.response?.status === 401) onLogout();
        else setError('No se pudieron cargar las estadísticas. Intente más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [onLogout]);

  // Datos para gráfico
  const chartData = {
    labels: stats.donacionesSemana?.labels || ['Sin datos'],
    datasets: [
      {
        label: 'Donaciones por día',
        data: stats.donacionesSemana?.data || [0],
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Donaciones en los últimos 7 días' },
    },
    scales: {
      y: {
        beginAtZero: true,
        precision: 0,
        ticks: { stepSize: 1 },
      },
    },
  };

  if (loading) {
    return (
      <div className="container-fluid p-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      {/* Encabezado */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="text-primary">📊 Dashboard Principal</h4>
        <button className="btn btn-outline-danger" onClick={onLogout}>
          Cerrar sesión
        </button>
      </div>

      {/* Mensaje de error */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Tarjetas de estadísticas */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card bg-info text-white h-100 shadow-sm">
            <div className="card-body">
              <h6>Donaciones Disponibles</h6>
              <h2>{stats.inventario}</h2>
              <small>Unidades en inventario</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white h-100 shadow-sm">
            <div className="card-body">
              <h6>Entregas Realizadas</h6>
              <h2>{stats.entregas}</h2>
              <small>Total de paquetes entregados</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-dark h-100 shadow-sm">
            <div className="card-body">
              <h6>Campañas Activas</h6>
              <h2>{stats.campanas}</h2>
              <small>En curso</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-primary text-white h-100 shadow-sm">
            <div className="card-body">
              <h6>Donaciones Hoy</h6>
              <h2>{stats.donacionesHoy}</h2>
              <small>Nuevas entradas</small>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico y alertas */}
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">📈 Evolución de Donaciones (Últimos 7 días)</h5>
            </div>
            <div className="card-body">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header bg-warning text-dark">
              <h5 className="mb-0">⚠️ Alertas</h5>
            </div>
            <div className="card-body">
              {stats.alertas.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {stats.alertas.map((alerta, i) => (
                    <li key={i} className="list-group-item list-group-item-warning py-2 small">
                      <strong>{alerta.tipo}:</strong> {alerta.descripcion}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted mb-0">No hay alertas críticas</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Nota informativa */}
      <div className="alert alert-info mt-4 mb-0">
        Bienvenido al sistema de gestión de donaciones. Aquí puedes ver el estado general de la fundación en tiempo real.
      </div>
    </div>
  );
}

export default Dashboard;
