 
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GestionarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nombre: '', apellido: '', correo: '', contrasena: '', id_rol: '' });

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const res = await axios.get('https://agile-nature-production.up.railway.app/api/usuarios', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        setUsuarios(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://agile-nature-production.up.railway.app/api/usuarios', form, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Usuario creado con éxito');
      setForm({ nombre: '', apellido: '', correo: '', contrasena: '', id_rol: '' });
    } catch (err) {
      alert('Error al crear usuario');
    }
  };

  return (
    <div>
      <h4>👥 Gestionar Usuarios</h4>
      <form onSubmit={handleSubmit} className="mb-4 p-3 border rounded">
        <h5>Crear Nuevo Usuario</h5>
        <div className="row">
          <div className="col-md-4 mb-3">
            <input type="text" className="form-control" placeholder="Nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
          </div>
          <div className="col-md-4 mb-3">
            <input type="text" className="form-control" placeholder="Apellido" value={form.apellido} onChange={e => setForm({...form, apellido: e.target.value})} required />
          </div>
          <div className="col-md-4 mb-3">
            <input type="email" className="form-control" placeholder="Correo" value={form.correo} onChange={e => setForm({...form, correo: e.target.value})} required />
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 mb-3">
            <input type="password" className="form-control" placeholder="Contraseña" value={form.contrasena} onChange={e => setForm({...form, contrasena: e.target.value})} required />
          </div>
          <div className="col-md-4 mb-3">
            <select className="form-control" value={form.id_rol} onChange={e => setForm({...form, id_rol: e.target.value})} required>
              <option value="">Rol</option>
              <option value="1">Administrador</option>
              <option value="2">Operador</option>
              <option value="3">Voluntario</option>
            </select>
          </div>
          <div className="col-md-4 mb-3 d-flex align-items-end">
            <button type="submit" className="btn btn-primary">Crear Usuario</button>
          </div>
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id_usuario}>
              <td>{u.nombre} {u.apellido}</td>
              <td>{u.correo}</td>
              <td>{['-', 'Admin', 'Operador', 'Voluntario'][u.id_rol]}</td>
              <td>{u.activo ? 'Activo' : 'Inactivo'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GestionarUsuarios;