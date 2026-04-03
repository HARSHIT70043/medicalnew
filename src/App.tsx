/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout';
import FindHospitals from './pages/FindHospitals';
import HospitalDashboard from './pages/HospitalDashboard';
import MedicalHistory from './pages/MedicalHistory';
import Chatbot from './pages/Chatbot';
import Login from './pages/Login';
import BloodBank from './pages/BloodBank';
import EmergencyReport from './pages/EmergencyReport';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Layout onLogout={handleLogout} /> : <Navigate to="/login" replace />}
        >
          <Route index element={<FindHospitals />} />
          <Route path="dashboard" element={<HospitalDashboard />} />
          <Route path="blood-bank" element={<BloodBank />} />
          <Route path="emergency" element={<EmergencyReport />} />
          <Route path="history" element={<MedicalHistory />} />
          <Route path="assistant" element={<Chatbot />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
