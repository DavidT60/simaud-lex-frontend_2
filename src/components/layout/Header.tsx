import { useAuth } from '@/contexts/auth.context';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-primary-200 px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold text-primary-900">
          Bienvenido, {user?.name || user?.email}
        </h2>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-primary-600">
          <User className="w-5 h-5" />
          <span className="text-sm">{user?.email}</span>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </Button>
      </div>
    </header>
  );
};
