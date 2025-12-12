import { useAuth } from '@/contexts/auth.context';
import { useTheme } from '@/contexts/theme.context';
import { Button } from '@/components/ui/button';
import { LogOut, User, Moon, Sun, Settings } from 'lucide-react';
import { useState } from 'react';

export const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-primary-200 dark:border-gray-700 px-8 py-4 flex items-center justify-between shadow-sm transition-colors duration-300">
      <div>
        <h2 className="text-xl font-semibold text-primary-900 dark:text-white">
          Bienvenido, {user?.name || user?.email}
        </h2>
        <p className="text-sm text-primary-600 dark:text-gray-400 mt-0.5">
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-primary-600 dark:text-gray-300 px-3 py-2 bg-primary-50 dark:bg-gray-700/50 rounded-lg">
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">{user?.email}</span>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="flex items-center gap-2 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
          title={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-4 h-4" />
              <span className="hidden sm:inline">Oscuro</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4" />
              <span className="hidden sm:inline">Claro</span>
            </>
          )}
        </Button>

        {/* Settings Button */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-2 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Ajustes</span>
          </Button>

          {showSettings && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-primary-200 dark:border-gray-700 p-4 z-50">
              <h3 className="font-semibold text-primary-900 dark:text-white mb-3">Configuración</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-primary-700 dark:text-gray-300">Modo Oscuro</span>
                  <button
                    onClick={toggleTheme}
                    className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary-200 dark:bg-accent-600 transition-colors"
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-2 border-t border-primary-100 dark:border-gray-700">
                  <p className="text-xs text-primary-500 dark:text-gray-400">
                    v1.0.0 - SIMAUD-LEX
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Cerrar Sesión</span>
        </Button>
      </div>
    </header>
  );
};
