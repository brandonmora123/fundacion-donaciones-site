import React, { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', { correo, contrasena });
      onLogin(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  // Estilos en línea para el fondo
  const estiloFondo = {
    minHeight: '100vh',
    backgroundImage: 'url("./shared/login.jpeg")', // colocar la imagen en public/imagenes
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const estiloCard = {
    maxWidth: '400px',
    width: '100%',
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // ligera transparencia
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
  };

  return (
    <div style={estiloFondo}>
      <div style={estiloCard}>
        <div className="text-center">
          <h3>Fundación Unidos por un Corazón</h3>
          <p>Gestión de Donaciones</p>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Correo"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Contraseña"
                value={contrasena}
                onChange={e => setContrasena(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
            <div className="mt-3">
              <a href="#recuperar">¿Olvidó su contraseña?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
