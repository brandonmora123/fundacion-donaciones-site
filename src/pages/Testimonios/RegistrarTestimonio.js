import React, { useState } from 'react';
import axios from 'axios';

function RegistrarTestimonio() {
  const [id_entrega, setIdEntrega] = useState('');
  const [comentario, setComentario] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [anonimo, setAnonimo] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://agile-nature-production.up.railway.app/api/testimonios', {
        id_entrega, comentario, calificacion, anonimo
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Testimonio registrado con éxito');
    } catch (err) {
      alert('Error al registrar testimonio');
    }
  };

  return (
    <div>
      <h4>💬 Registrar Testimonio</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>ID de Entrega</label>
          <input type="number" className="form-control" value={id_entrega} onChange={e => setIdEntrega(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Comentario</label>
          <textarea className="form-control" rows="4" value={comentario} onChange={e => setComentario(e.target.value)}></textarea>
        </div>
        <div className="mb-3">
          <label>Calificación</label>
          <select className="form-control" value={calificacion} onChange={e => setCalificacion(e.target.value)}>
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Estrellas</option>)}
          </select>
        </div>
        <div className="form-check mb-3">
          <input type="checkbox" className="form-check-input" checked={anonimo} onChange={e => setAnonimo(e.target.checked)} />
          <label className="form-check-label">Deseo permanecer anónimo</label>
        </div>
        <button type="submit" className="btn btn-primary">Registrar Testimonio</button>
      </form>
    </div>
  );
}

export default RegistrarTestimonio;