import React from 'react';
import axios from 'axios';

const GenerarReportes = () => {
  const descargarReporteSemanal = async () => {
    try {
      const token = localStorage.getItem('token'); // si usas autenticación
      const response = await axios.get(
        'http://localhost:3001/api/excel/reporte-semanal',
        {
          responseType: 'blob', // importante para archivos binarios
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Crear enlace para descargar
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'donaciones_7dias.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error al descargar el reporte:', err);
      alert('No se pudo descargar el reporte. Intente más tarde.');
    }
  };

  return (
    <div>
      <h4>📈 Generar Reportes Automáticos</h4>
      <div className="row">
        <div className="col-md-4 mb-3">
          <div
            className="card text-center"
            onClick={descargarReporteSemanal}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-body">
              <h5>Semanal</h5>
              <p>Resumen de donaciones y entregas</p>
            </div>
          </div>
        </div>
        {/* Puedes agregar más tarjetas para otros tipos de reportes */}
      </div>
    </div>
  );
};

export default GenerarReportes;
