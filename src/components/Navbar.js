 
import React from 'react';

const Navbar = ({ user, onLogout, toggleSidebar }) => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
    <button className="btn btn-outline-light me-3" onClick={toggleSidebar}>☰</button>
    <span className="navbar-brand">Fundación Unidos por un Corazón</span>
    <div className="ms-auto">
      <span className="text-white me-3">Hola, {user.nombre} ({['-', 'Admin', 'Operador', 'Voluntario'][user.rol]})</span>
      <button className="btn btn-outline-light" onClick={onLogout}>Cerrar sesión</button>
    </div>
  </nav>
);

export default Navbar;