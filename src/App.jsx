import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Root from "./routes/root";
import Dashboard from "./routes/dashboard";
import Login from "./routes/login";
import { ProtectedRoute } from "./protected-route";
import ErrorPage from "./error-page";
import Register from "./routes/register";
import { Layout } from "./layout";
import { useAuth } from "./hooks/useAuthContext";
import Booking from "./routes/booking";

function App() {
  const { user } = useAuth();
  return (
    <Layout>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Root />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
