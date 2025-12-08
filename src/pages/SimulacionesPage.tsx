import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calculator, TrendingUp, FileText, DollarSign, Calendar, Receipt } from 'lucide-react';
import { SimulationForm } from '@/components/forms/SimulationForm';

export const SimulacionesPage = () => {
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [simulationHistory, setSimulationHistory] = useState<any[]>([]);

  const handleSimulationComplete = (result: any) => {
    setSimulationResult(result);
    setSimulationHistory(prev => [result, ...prev].slice(0, 10)); // Keep last 10
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-DO', {
      style: 'currency',
      currency: 'DOP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Simulaciones</h1>
          <p className="text-primary-600 mt-2">Herramientas de cálculo legal para estimación de sentencias</p>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Crear Nueva Simulación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SimulationForm onSimulationComplete={handleSimulationComplete} />
          </CardContent>
        </Card>

        {/* Results Card */}
        {simulationResult && (
          <Card className="border-2 border-primary-200 bg-primary-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary-900">
                <TrendingUp className="w-5 h-5" />
                Resultado de Simulación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Main Result */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Caso #</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {simulationResult.casoNumero || simulationResult.procesoId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Fecha de Simulación</p>
                    <p className="text-sm text-gray-900">
                      {formatDate(simulationResult.fechaSimulacion)}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary-600 to-accent-500 rounded-lg p-6 text-white mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-6 h-6" />
                    <p className="text-sm font-medium opacity-90">Monto Sugerido</p>
                  </div>
                  <p className="text-4xl font-bold">
                    {formatCurrency(simulationResult.simulacion.montoSugerido)}
                  </p>
                  <p className="text-sm opacity-90 mt-1">
                    {simulationResult.simulacion.moneda}
                  </p>
                </div>

                {/* Reasoning */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    Razonamiento del Cálculo
                  </h4>
                  <ul className="space-y-2">
                    {simulationResult.simulacion.razonamiento.map((razon: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-primary-600 font-bold mt-0.5">•</span>
                        <span>{razon}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Datos Considerados */}
                {simulationResult.simulacion.datosConsiderados && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-gray-900 mb-3">Datos Considerados</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600 font-medium">Necesidades del NNA</p>
                        <p className="text-gray-900 mt-1">
                          {simulationResult.simulacion.datosConsiderados.necesidadesNNA.length > 0
                            ? simulationResult.simulacion.datosConsiderados.necesidadesNNA.join(', ')
                            : 'Ninguna registrada'}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600 font-medium">Recursos del Demandado</p>
                        <p className="text-gray-900 mt-1">
                          {formatCurrency(simulationResult.simulacion.datosConsiderados.recursosDemandado || 0)}
                        </p>
                      </div>
                      {simulationResult.simulacion.datosConsiderados.montoSolicitadoUsuario && (
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-gray-600 font-medium">Monto Base Solicitado</p>
                          <p className="text-gray-900 mt-1">
                            {formatCurrency(simulationResult.simulacion.datosConsiderados.montoSolicitadoUsuario)}
                          </p>
                        </div>
                      )}
                      {simulationResult.simulacion.datosConsiderados.notasUsuario && (
                        <div className="bg-gray-50 p-3 rounded md:col-span-2">
                          <p className="text-gray-600 font-medium">Notas Adicionales</p>
                          <p className="text-gray-900 mt-1">
                            {simulationResult.simulacion.datosConsiderados.notasUsuario}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* History Table */}
        {simulationHistory.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Historial de Simulaciones
                <span className="ml-auto text-sm font-normal text-gray-500">
                  {simulationHistory.length} simulación{simulationHistory.length !== 1 ? 'es' : ''}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Caso
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                        Fecha
                      </th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                        Monto Sugerido
                      </th>
                      <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                        Acción
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulationHistory.map((sim, idx) => (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm">
                          <p className="font-medium text-gray-900">
                            {sim.casoNumero || sim.procesoId}
                          </p>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(sim.fechaSimulacion).toLocaleDateString('es-DO')}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-right font-semibold text-primary-700">
                          {formatCurrency(sim.simulacion.montoSugerido)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setSimulationResult(sim)}
                            className="text-xs text-primary-600 hover:text-primary-800 font-medium"
                          >
                            Ver detalles
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};
