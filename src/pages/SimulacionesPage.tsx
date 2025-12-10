import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sparkles, TrendingUp, DollarSign, Calendar, Receipt, Loader2, History, FileText } from 'lucide-react';
import { SimulationFormComplete } from '@/components/forms/SimulationFormComplete';
import { procesoJudicialAPI } from '@/lib/api';

export const SimulacionesPage = () => {
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [simulationHistory, setSimulationHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'history'>('form');
  const [selectedCasoForHistory, setSelectedCasoForHistory] = useState<string | null>(null);
  const [casos, setCasos] = useState<any[]>([]);
  const [loadingCasos, setLoadingCasos] = useState(false);

  // Load cases when history tab is opened
  const loadCasos = async () => {
    setLoadingCasos(true);
    try {
      const data = await procesoJudicialAPI.getAll();
      setCasos(data);
    } catch (error) {
      console.error('Error al cargar casos:', error);
    } finally {
      setLoadingCasos(false);
    }
  };

  const handleSimulationComplete = (result: any) => {
    setSimulationResult(result);
    
    // Reload history after new simulation
    if (result.procesoId) {
      loadHistorialSimulaciones(result.procesoId);
    }
  };

  // Load simulation history for a specific case
  const loadHistorialSimulaciones = async (casoId: string) => {
    setLoadingHistory(true);
    setSelectedCasoForHistory(casoId);
    try {
      const historial = await procesoJudicialAPI.getHistorialSimulaciones(casoId);
      setSimulationHistory(historial);
    } catch (error) {
      console.error('Error al cargar historial:', error);
      setSimulationHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Load detail of a specific simulation
  const handleViewSimulationDetail = async (simulacionId: string) => {
    try {
      const simulacion = await procesoJudicialAPI.getSimulacionById(simulacionId);
      
      // Convert the HechosSimulacion to a simulation result format
      const simulationResultFormat = {
        procesoId: simulacion.proceso.id,
        casoNumero: simulacion.proceso.id_caso_dinamico,
        hechosSimulacionId: simulacion.id,
        simulacion: {
          montoSugerido: simulacion.montoSolicitado || 0,
          moneda: 'DOP',
          razonamiento: [
            `Simulación histórica del ${formatDate(simulacion.fecha_simulacion)}`,
            simulacion.notasAdicionales ? `Notas: ${simulacion.notasAdicionales}` : ''
          ].filter(Boolean),
          datosConsiderados: {
            necesidadesNNA: [],
            recursosDemandado: simulacion.recursosDemandadoEstimados || 0,
            montoSolicitadoUsuario: simulacion.montoSolicitado,
            notasUsuario: simulacion.notasAdicionales
          }
        },
        fechaSimulacion: simulacion.fecha_simulacion
      };
      
      setSimulationResult(simulationResultFormat);
      setActiveTab('form'); // Switch to form/results tab to show the result
    } catch (error) {
      console.error('Error al cargar detalles de simulación:', error);
    }
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
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('form')}
              className={`${
                activeTab === 'form'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <Sparkles className="w-4 h-4" />
              Nueva Simulación
            </button>
            <button
              onClick={() => {
                setActiveTab('history');
                if (casos.length === 0) {
                  loadCasos();
                }
              }}
              className={`${
                activeTab === 'history'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <History className="w-4 h-4" />
              Ver Historial
            </button>
          </nav>
        </div>

        {/* Form Tab Content */}
        {activeTab === 'form' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Crear Nueva Simulación Completa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SimulationFormComplete onSimulationComplete={handleSimulationComplete} />
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

            {/* History Table - Show when there are simulations */}
            {(simulationHistory.length > 0 || loadingHistory) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Historial de Simulaciones del Caso
                    {!loadingHistory && (
                      <span className="ml-auto text-sm font-normal text-gray-500">
                        {simulationHistory.length} simulación{simulationHistory.length !== 1 ? 'es' : ''}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingHistory ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                      <span className="ml-2 text-primary-600">Cargando historial...</span>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                              Fecha
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                              Monto Solicitado
                            </th>
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                              Recursos Demandado
                            </th>
                            <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                              Acción
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {simulationHistory.map((sim) => (
                            <tr key={sim.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(sim.fecha_simulacion)}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-sm font-semibold text-primary-700">
                                {sim.montoSolicitado ? formatCurrency(Number(sim.montoSolicitado)) : 'N/A'}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">
                                {sim.recursosDemandadoEstimados ? formatCurrency(Number(sim.recursosDemandadoEstimados)) : 'N/A'}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  onClick={() => handleViewSimulationDetail(sim.id)}
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
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* History Tab Content */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* Search Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Buscar Caso para Ver Historial
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingCasos ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                    <span className="ml-2 text-primary-600">Cargando casos...</span>
                  </div>
                ) : (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Buscar por número de caso o nombre del NNA
                      </label>
                      <div className="relative">
                        <History className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Buscar caso..."
                          value={selectedCasoForHistory || ''}
                          onChange={(e) => setSelectedCasoForHistory(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-10 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        />
                      </div>
                    </div>

                    {/* Filtered Cases List */}
                    {selectedCasoForHistory && (
                      <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-2">
                        {casos
                          .filter(caso => {
                            const searchLower = selectedCasoForHistory.toLowerCase();
                            return (
                              caso.id_caso_dinamico?.toLowerCase().includes(searchLower) ||
                              caso.nna?.nombre_completo?.toLowerCase().includes(searchLower) ||
                              caso.tipo_demanda?.toLowerCase().includes(searchLower)
                            );
                          })
                          .map((caso) => (
                            <button
                              key={caso.id}
                              onClick={() => {
                                loadHistorialSimulaciones(caso.id);
                                setSelectedCasoForHistory(caso.id_caso_dinamico || caso.id);
                              }}
                              className="w-full text-left p-3 border rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-colors"
                            >
                              <p className="font-medium text-gray-900">
                                {caso.id_caso_dinamico || caso.id}
                              </p>
                              <p className="text-sm text-gray-600">
                                NNA: {caso.nna?.nombre_completo || 'Sin NNA'}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Tipo: {caso.tipo_demanda} • Estado: {caso.estado}
                              </p>
                            </button>
                          ))}
                        {casos.filter(caso => {
                          const searchLower = selectedCasoForHistory.toLowerCase();
                          return (
                            caso.id_caso_dinamico?.toLowerCase().includes(searchLower) ||
                            caso.nna?.nombre_completo?.toLowerCase().includes(searchLower) ||
                            caso.tipo_demanda?.toLowerCase().includes(searchLower)
                          );
                        }).length === 0 && (
                          <p className="text-center py-4 text-gray-500">No se encontraron casos</p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Loading History */}
            {loadingHistory && (
              <Card>
                <CardContent className="py-8">
                  <div className="flex justify-center items-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                    <span className="ml-2 text-primary-600">Cargando historial...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Simulations Cards Display */}
            {!loadingHistory && simulationHistory.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Historial de Simulaciones
                  </h3>
                  <span className="text-sm text-gray-500">
                    {simulationHistory.length} simulación{simulationHistory.length !== 1 ? 'es' : ''}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {simulationHistory.map((sim) => (
                    <Card key={sim.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewSimulationDetail(sim.id)}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(sim.fecha_simulacion).toLocaleDateString('es-DO')}
                          </div>
                          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                            {sim.edad_del_menor} años
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* Monto Solicitado */}
                        <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Monto Solicitado</p>
                          <p className="text-lg font-bold text-primary-700">
                            {sim.montoSolicitado ? formatCurrency(Number(sim.montoSolicitado)) : 'N/A'}
                          </p>
                        </div>

                        {/* Recursos Demandado */}
                        <div className="border-t pt-3">
                          <p className="text-xs text-gray-600 mb-1">Recursos del Demandado</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {sim.recursosDemandadoEstimados ? formatCurrency(Number(sim.recursosDemandadoEstimados)) : 'N/A'}
                          </p>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-2 gap-2 text-xs border-t pt-3">
                          <div>
                            <p className="text-gray-500">Preferencia</p>
                            <p className="font-medium text-gray-700">{sim.preferencia_del_menor}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Custodia</p>
                            <p className="font-medium text-gray-700">{sim.custodia_previa}</p>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewSimulationDetail(sim.id);
                          }}
                          className="w-full mt-3 text-sm text-primary-600 hover:text-primary-800 font-medium py-2 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
                        >
                          Ver detalles completos
                        </button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loadingHistory && simulationHistory.length === 0 && selectedCasoForHistory && casos.some(c => c.id_caso_dinamico === selectedCasoForHistory || c.id === selectedCasoForHistory) && (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-lg font-medium mb-1">No hay simulaciones registradas</p>
                    <p className="text-sm">Este caso aún no tiene simulaciones guardadas</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};
