import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-primary-50">
      <Sidebar />
      
      <div className="ml-64">
        <Header />
        
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
