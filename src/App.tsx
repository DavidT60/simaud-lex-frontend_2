import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/auth.context';
import { ThemeProvider } from './contexts/theme.context';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CasosPage } from './pages/CasosPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { SimulacionesPage } from './pages/SimulacionesPage';
import { BibliotecaPage } from './pages/BibliotecaPage';
import { RuleConfigPage } from './pages/RuleConfigPage';
import { UserConfigPage } from './pages/UserConfigPage';

function App() {
  return (
    <ThemeProvider>
      <Toaster richColors position="top-right" />
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/casos"
            element={
              <ProtectedRoute>
                <CasosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/casos/:id"
            element={
              <ProtectedRoute>
                <CaseDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/simulaciones"
            element={
              <ProtectedRoute>
                <SimulacionesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/biblioteca"
            element={
              <ProtectedRoute>
                <BibliotecaPage />
              </ProtectedRoute>
            }
          />
           <Route
            path="/configuracion-reglas"
            element={
              <ProtectedRoute>
                <RuleConfigPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configuracion-usuario"
            element={
              <ProtectedRoute>
                <UserConfigPage />
              </ProtectedRoute>
            }
          />
          
          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
