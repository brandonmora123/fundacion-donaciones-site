// src/pages/Testimonios/ListaTestimonios.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListaTestimonios() {
  const [testimonios, setTestimonios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonios = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token no encontrado. Inicia sesión.');
          return;
        }

        const res = await axios.get('https://agile-nature-production.up.railway.app/api/testimonios', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Aseguramos que sea un array
        if (Array.isArray(res.data)) {
          setTestimonios(res.data);
        } else {
          console.error('Formato de respuesta inesperado:', res.data);
          setTestimonios([]);
        }
      } catch (err) {
        console.error('Error al cargar testimonios:', err.response?.data || err.message);
        if (err.response?.status === 401) {
          console.error('Token inválido o expirado. Redirigiendo al login...');
          // Opcional: redirigir al login
          // window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonios();
  }, []);

  // Función para mostrar estrellas
  const renderEstrellas = (count) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} style={{ color: i < (count || 0) ? '#ffc107' : '#e4e5e9' }}>
        ★
      </span>
    ));
  };

  if (loading) {
    return <div className="text-center mt-4">Cargando testimonios...</div>;
  }

  return (
    <div className="container-fluid p-4">
      <h4>💬 Testimonios de la Comunidad</h4>
      <p className="text-muted">Lo que dicen quienes confían en nosotros</p>

      {testimonios.length === 0 ? (
        <div className="alert alert-info">No hay testimonios disponibles.</div>
      ) : (
        <div className="row">
          {testimonios.map(t => (
            <div className="col-md-6 col-lg-4 mb-4" key={t.id_testimonio}>
              <div className="card shadow-sm h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-center mb-3">
                    {/* Inicial del nombre o 'T' si no existe */}
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                      {t.nombre?.[0]?.toUpperCase() || 'T'}
                    </div>
                    <div className="ms-2">
                      <h6 className="mb-0">{t.nombre_completo || t.nombre || 'Sin nombre'}</h6>
                      <small className="text-muted">{t.tipo || 'Usuario'}</small>
                    </div>
                  </div>

                  <p className="text-muted flex-grow-1" style={{ fontStyle: 'italic' }}>
                    "{t.mensaje || 'Sin mensaje'}"
                  </p>

                  <div className="d-flex justify-content-between align-items-center mt-auto">
                    <small className="text-muted">{t.fecha || 'Fecha no disponible'}</small>
                    <div>{renderEstrellas(t.estrellas)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaTestimonios;