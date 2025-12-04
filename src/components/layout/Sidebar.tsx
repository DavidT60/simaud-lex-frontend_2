import { Link, useLocation } from 'react-router-dom';
import { Home, Calculator, FolderOpen, Book } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Simulaciones', path: '/simulaciones', icon: Calculator },
  { name: 'Casos', path: '/casos', icon: FolderOpen },
  { name: 'Biblioteca', path: '/biblioteca', icon: Book },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-primary text-white flex flex-col">
      <div className="p-6 border-b border-primary-700">
        <h1 className="text-2xl font-bold">SIMAUD-LEX</h1>
        <p className="text-sm text-primary-300 mt-1">Sistema Legal</p>
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
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-accent text-white shadow-lg"
                      : "text-primary-200 hover:bg-primary-700 hover:text-white"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-primary-700">
        <p className="text-xs text-primary-400 text-center">
          © 2025 SIMAUD-LEX
        </p>
      </div>
    </aside>
  );
};
