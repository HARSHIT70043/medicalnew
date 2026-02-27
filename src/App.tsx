// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import FindHospitals from "./pages/FindHospitals";
import HospitalDashboard from "./pages/HospitalDashboard";
import MedicalHistory from "./pages/MedicalHistory";
import Chatbot from "./pages/Chatbot";
import Login from "./pages/Login";
import EmergencySearch from "./pages/EmergencySearch";
import HospitalDetails from "./pages/HospitalDetails";

// Protected Route component - Fixed type
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = () => {
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<FindHospitals />} />
          <Route path="dashboard" element={<HospitalDashboard />} />
          <Route path="history" element={<MedicalHistory />} />
          <Route path="assistant" element={<Chatbot />} />
          <Route path="emergency-search" element={<EmergencySearch />} />
        </Route>

        <Route
          path="/hospital/:id"
          element={
            <ProtectedRoute>
              <HospitalDetails />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to login or home based on auth */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
