/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import FindHospitals from './pages/FindHospitals';
import HospitalDashboard from './pages/HospitalDashboard';
import MedicalHistory from './pages/MedicalHistory';
import Chatbot from './pages/Chatbot';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<FindHospitals />} />
          <Route path="dashboard" element={<HospitalDashboard />} />
          <Route path="history" element={<MedicalHistory />} />
          <Route path="assistant" element={<Chatbot />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
