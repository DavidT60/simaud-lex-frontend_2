import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Book } from 'lucide-react';

export const BibliotecaPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Biblioteca</h1>
          <p className="text-primary-600 mt-2">Recursos y documentación legal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="w-5 h-5" />
              Documentos y Recursos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-primary-600">
              Biblioteca de recursos en desarrollo...
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
