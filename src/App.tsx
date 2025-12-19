import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/auth.context';
import { ThemeProvider } from './contexts/theme.context';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CasosPage } from './pages/CasosPage';
import { CaseDetailPage } from './pages/CaseDetailPage';
import { SimulacionesPage } from './pages/SimulacionesPage';
import { BibliotecaPage } from './pages/BibliotecaPage';
import { RuleConfigPage } from './pages/RuleConfigPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
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
          
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
