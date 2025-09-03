 
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ListaDonaciones from './pages/Donaciones/ListaDonaciones';
import FormDonacion from './pages/Donaciones/FormDonacion';
import Inventario from './pages/Inventario/Inventario';
import CrearPaquete from './pages/Paquetes/CrearPaquete';
import ListaPaquetes from './pages/Paquetes/ListaPaquetes';
import DetallePaquete from './pages/Paquetes/DetallePaquete';
import RegistrarEntrega from './pages/Entregas/RegistrarEntrega';
import HistorialEntregas from './pages/Entregas/HistorialEntregas';
import ListaBeneficiarios from './pages/Beneficiarios/ListaBeneficiarios';
import PerfilBeneficiario from './pages/Beneficiarios/PerfilBeneficiario';
import FormBeneficiario from './pages/Beneficiarios/FormBeneficiario';
import ListaDonantes from './pages/Donantes/ListaDonantes';
import PerfilDonante from './pages/Donantes/PerfilDonante';
import GestionarUsuarios from './pages/Usuarios/GestionarUsuarios';
import PerfilUsuario from './pages/Usuarios/PerfilUsuario';
import GestionarCampanas from './pages/Campañas/GestionarCampanas';
import GestionarTareas from './pages/Tareas/GestionarTareas';
import FormTareas from './pages/Tareas/FormAsignarTarea';

import Testimonio from './pages/Testimonios/ListaTestimonios';
import RegistrarTestimonio from './pages/Testimonios/RegistrarTestimonio';
import GenerarReportes from './pages/Reportes/GenerarReportes';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import FormDonante from './pages/Donantes/FormDonante';

function App() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (userData) => {
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData.user));
    setUser(userData.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        {user && <Sidebar open={sidebarOpen} toggle={setSidebarOpen} user={user} />}
        <div className={`main-content ${!user || !sidebarOpen ? '' : 'shifted'}`}>
          {user && <Navbar user={user} onLogout={handleLogout} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />}
          <div className="container mt-4">
            <Routes>
              <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
              <Route element={<ProtectedRoute user={user} />}>
                <Route path="/dashboard" element={<Dashboard user={user} />} />
                <Route path="/donaciones" element={<ListaDonaciones />} />
                <Route path="/donaciones/nueva" element={<FormDonacion />} />
                <Route path="/inventario" element={<Inventario />} />
                <Route path="/paquetes" element={<ListaPaquetes />} />
                <Route path="/paquetes/crear" element={<CrearPaquete />} />
                <Route path="/paquetes/:id" element={<DetallePaquete />} />
                <Route path="/entregas/registrar" element={<RegistrarEntrega />} />
                <Route path="/entregas" element={<HistorialEntregas />} />
                <Route path="/beneficiarios" element={<ListaBeneficiarios />} />
                <Route path="/beneficiarios/:id" element={<PerfilBeneficiario />} />
                <Route path="/beneficiarios/nuevo" element={<FormBeneficiario />} />
                {/* Rutas para donantes */}
                <Route path="/donantes" element={<ListaDonantes />} />
                <Route path="/donantes/nuevo" element={<FormDonante />} />   {/* antes que la de :id */}
                <Route path="/donantes/:id" element={<PerfilDonante />} />
                <Route path="/usuarios" element={<GestionarUsuarios />} />
                <Route path="/perfil" element={<PerfilUsuario />} />
                <Route path="/campanas" element={<GestionarCampanas />} />
                <Route path="/tareas" element={<GestionarTareas />} />
                <Route path="/tareas/nuevo" element={<FormTareas />} />
                <Route path="/testimonios" element={<Testimonio />} />
                <Route path="/registrar/testimonios" element={<RegistrarTestimonio />} />
                <Route path="/reportes" element={<GenerarReportes />} />
              </Route>
              <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;