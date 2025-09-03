 
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ open, toggle, user }) => (
  <div className={`sidebar ${open ? 'open' : ''}`}>
    <h5 className="text-center text-white p-3 bg-dark">Menú</h5>
    <ul className="nav flex-column">
      <li className="nav-item"><Link className="nav-link text-white" to="/dashboard">📊 Dashboard</Link></li>
      {(user.rol === 1 || user.rol === 2) && <li className="nav-item"><Link className="nav-link text-white" to="/donaciones">📦 Donaciones</Link></li>}
      <li className="nav-item"><Link className="nav-link text-white" to="/inventario">📋 Inventario</Link></li>
      {(user.rol === 1 || user.rol === 2) && <li className="nav-item"><Link className="nav-link text-white" to="/paquetes">🎁 Crear Paquete</Link></li>}
      {(user.rol === 1 || user.rol === 3) && <li className="nav-item"><Link className="nav-link text-white" to="/entregas/registrar">🚚 Registrar Entrega</Link></li>}
      <li className="nav-item"><Link className="nav-link text-white" to="/entregas">📦 Historial de Entregas</Link></li>
      <li className="nav-item"><Link className="nav-link text-white" to="/beneficiarios">👥 Beneficiarios</Link></li>
      <li className="nav-item"><Link className="nav-link text-white" to="/donantes">❤️ Donantes</Link></li>
      {user.rol === 1 && <li className="nav-item"><Link className="nav-link text-white" to="/usuarios">👥 Gestionar Usuarios</Link></li>}
      <li className="nav-item"><Link className="nav-link text-white" to="/campanas">🎯 Campañas</Link></li>
      <li className="nav-item"><Link className="nav-link text-white" to="/tareas">✅ Tareas</Link></li>
      <li className="nav-item"><Link className="nav-link text-white" to="/testimonios">💬 Testimonios</Link></li>
      <li className="nav-item"><Link className="nav-link text-white" to="/registrar/testimonios">💬 Registrar Testimonios</Link></li>
      <li className="nav-item"><Link className="nav-link text-white" to="/reportes">📈 Reportes</Link></li>
      <li className="nav-item"><Link className="nav-link text-white" to="/perfil">🔐 Mi Perfil</Link></li>
    </ul>
  </div>
);

export default Sidebar;