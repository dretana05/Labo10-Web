import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import API from "./utils/api.js";
import CustomerList from './components/CustomerList';
import SalesForm from './components/SalesForm';

function Dashboard() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const checkToken = async () => {
      try {
        const response = await API.get("/users");
        setMessage("¡Bienvenido!");
      } catch (err) {
        console.error("Token inválido o expirado", err);
        handleLogout();
      }
    };

    checkToken();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <ul>
          <li><Link to="/protected/customers">Clientes</Link></li>
          <li><Link to="/protected/sales">Registrar Venta</Link></li>
        </ul>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </nav>

      <main className="dashboard-content">
        <h1 className="content-center">{message}</h1>
        <hr />
        <Routes>
          <Route path="customers" element={<CustomerList />} />
          <Route path="sales" element={<SalesForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default Dashboard;