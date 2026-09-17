import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import FanHome from "./pages/FanHome";
import Login from "./pages/Login";
import OpsDashboard from "./pages/OpsDashboard";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user || user.role === "fan") return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<FanHome />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/ops"
        element={
          <ProtectedRoute>
            <OpsDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
