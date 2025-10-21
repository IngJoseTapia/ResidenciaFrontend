// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyResetToken from "./pages/VerifyResetToken";
import ResetPassword from "./pages/ResetPassword";
import DashboardUser from "./pages/DashboardUser";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardVocal from "./pages/DashboardVocal";
import ProtectedRoute from "./routes/ProtectedRoute";
import GoogleCallback from "./pages/GoogleCallback";
import Unauthorized from "./pages/Unauthorized";

function App() {
  return (
    <Router>
      <Routes>
        {/* Página principal: login */}
        <Route path="/" element={<Login />} />

        {/* Página para registros de nuevas cuentas */}
        <Route path="/register" element={<Register />} />

        {/* Página para recuperar contraseña */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-reset-token" element={<VerifyResetToken />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Dashboard protegido */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute role="USER">
              <DashboardUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/vocal/dashboard"
          element={
            <ProtectedRoute role="VOCAL">
              <DashboardVocal />
            </ProtectedRoute>
          }
        />

        {/* Ruta para usuarios sin autorización */}
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Redirigir cualquier ruta desconocida al login */}
        <Route path="*" element={<Navigate to="/" replace />} />

        {/* Página para redirigir inicios de sesión exitosos con Google*/}
        <Route path="/login/oauth2/code/google" element={<GoogleCallback />} />
      </Routes>
    </Router>
  );
}

export default App;
