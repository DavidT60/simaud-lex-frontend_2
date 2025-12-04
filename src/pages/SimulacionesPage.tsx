import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

export const SimulacionesPage = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Simulaciones</h1>
          <p className="text-primary-600 mt-2">Herramientas de cálculo legal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Crear Simulación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-primary-600">
              Funcionalidad de simulaciones en desarrollo...
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
