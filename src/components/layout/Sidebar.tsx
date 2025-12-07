import { Link, useLocation } from 'react-router-dom';
import { Home, Sparkles, FolderOpen, Book, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Simulaciones', path: '/simulaciones', icon: Sparkles },
  { name: 'Casos', path: '/casos', icon: FolderOpen },
  { name: 'Biblioteca', path: '/biblioteca', icon: Book },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-primary to-primary-900 dark:from-gray-900 dark:to-gray-950 text-white flex flex-col shadow-2xl transition-colors duration-300">
      <div className="p-6 border-b border-primary-700 dark:border-gray-800">
        <div className="flex items-center gap-2 mb-1">
          <Scale className="w-8 h-8 text-accent-400" />
          <h1 className="text-2xl font-bold">SIMAUD-LEX</h1>
        </div>
        <p className="text-sm text-primary-300 dark:text-gray-400 ml-10">Sistema Legal</p>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-accent text-white shadow-lg shadow-accent-900/50 scale-105"
                      : "text-primary-200 dark:text-gray-400 hover:bg-primary-700/50 dark:hover:bg-gray-800 hover:text-white hover:scale-105"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-transform duration-200",
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-primary-700 dark:border-gray-800">
        <p className="text-xs text-primary-400 dark:text-gray-500 text-center">
          © 2025 SIMAUD-LEX
        </p>
      </div>
    </aside>
  );
};
