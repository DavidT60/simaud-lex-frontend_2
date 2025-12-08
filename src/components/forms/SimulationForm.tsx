import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { procesoJudicialAPI } from '@/lib/api';
import { Loader2, Search, AlertCircle } from 'lucide-react';

interface SimulationFormData {
  casoId: string;
  montoSolicitado?: string;
  notasAdicionales?: string;
  recursosDemandadoEstimados?: string;
}

interface SimulationFormProps {
  onSimulationComplete: (result: any) => void;
}

export const SimulationForm: React.FC<SimulationFormProps> = ({ 
  onSimulationComplete 
}) => {
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<SimulationFormData>();
  const [casos, setCasos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Case search states
  const [casoSearchTerm, setCasoSearchTerm] = useState('');
  const [isCasoListOpen, setIsCasoListOpen] = useState(false);
  const [selectedCaso, setSelectedCaso] = useState<any>(null);

  useEffect(() => {
    const fetchCasos = async () => {
      try {
        const data = await procesoJudicialAPI.getAll();
        setCasos(data);
      } catch (err) {
        setError('Error al cargar los casos');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCasos();
  }, []);

  const onSubmit = async (data: SimulationFormData) => {
    try {
      setError(null);
      
      if (!selectedCaso) {
        setError('Debe seleccionar un caso');
        return;
      }

      const simulationData = {
        montoSolicitado: data.montoSolicitado ? Number(data.montoSolicitado) : undefined,
        notasAdicionales: data.notasAdicionales || undefined,
        recursosDemandadoEstimados: data.recursosDemandadoEstimados ? Number(data.recursosDemandadoEstimados) : undefined,
      };
      
      const result = await procesoJudicialAPI.simularSentencia(data.casoId, simulationData);
      onSimulationComplete(result);
      
      // Reset form
      setCasoSearchTerm('');
      setSelectedCaso(null);
      setValue('casoId', '');
      setValue('montoSolicitado', '');
      setValue('notasAdicionales', '');
      setValue('recursosDemandadoEstimados', '');
    } catch (err: any) {
      console.error('Error en simulación:', err);
      setError(err.response?.data?.message || 'Error al generar simulación');
    }
  };

  // Filter cases based on search term
  const filteredCasos = casos.filter(caso => {
    const searchLower = casoSearchTerm.toLowerCase();
    return (
      caso.id_caso_dinamico?.toLowerCase().includes(searchLower) ||
      caso.nna?.nombre_completo?.toLowerCase().includes(searchLower) ||
      caso.tipo_demanda?.toLowerCase().includes(searchLower)
    );
  });

  const handleCasoSelect = (caso: any) => {
    setSelectedCaso(caso);
    setCasoSearchTerm(`${caso.id_caso_dinamico} - ${caso.nna?.nombre_completo || 'Sin NNA'}`);
    setValue('casoId', caso.id);
    setIsCasoListOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
        <span className="ml-2 text-primary-600">Cargando casos...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Case Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Seleccionar Caso <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por número de caso o nombre del NNA..."
              value={casoSearchTerm}
              onChange={(e) => {
                setCasoSearchTerm(e.target.value);
                setIsCasoListOpen(true);
                if (e.target.value === '') {
                  setSelectedCaso(null);
                  setValue('casoId', '');
                }
              }}
              onFocus={() => setIsCasoListOpen(true)}
              className="pl-10"
            />
          </div>
          
          {/* Dropdown List */}
          {isCasoListOpen && casoSearchTerm && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredCasos.length > 0 ? (
                filteredCasos.map((caso) => (
                  <div
                    key={caso.id}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleCasoSelect(caso)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {caso.id_caso_dinamico || 'Sin número'}
                        </p>
                        <p className="text-sm text-gray-600">
                          NNA: {caso.nna?.nombre_completo || 'No disponible'}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Tipo: {caso.tipo_demanda} • Estado: {caso.estado}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  No se encontraron casos
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Case Info */}
        {selectedCaso && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <p className="text-sm text-green-800">
                <span className="font-medium">Caso seleccionado:</span> {selectedCaso.id_caso_dinamico}
              </p>
              <p className="text-sm text-green-700 mt-1">
                NNA: {selectedCaso.nna?.nombre_completo} • Tipo: {selectedCaso.tipo_demanda}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Additional Fields - Only show when a case is selected */}
      {selectedCaso && (
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-md font-semibold text-primary-900">
            Datos Adicionales para la Simulación (Opcional)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Monto Solicitado */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Monto Solicitado (DOP)
              </label>
              <Input
                type="number"
                placeholder="Ej: 15000"
                {...register('montoSolicitado')}
                min="0"
                step="100"
              />
              <p className="text-xs text-gray-500">
                Dejar vacío para usar cálculo automático
              </p>
            </div>

            {/* Recursos Demandado */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Recursos del Demandado Estimados (DOP)
              </label>
              <Input
                type="number"
                placeholder="Ej: 80000"
                {...register('recursosDemandadoEstimados')}
                min="0"
                step="1000"
              />
              <p className="text-xs text-gray-500">
                Estimación actualizada de recursos económicos
              </p>
            </div>
          </div>

          {/* Notas Adicionales */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Notas Adicionales
            </label>
            <textarea
              {...register('notasAdicionales')}
              placeholder="Ej: El NNA requiere terapia especializada adicional..."
              className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              rows={4}
            />
            <p className="text-xs text-gray-500">
              Información adicional que desea considerar en la simulación
            </p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button 
          type="submit" 
          disabled={isSubmitting || !selectedCaso}
          className="min-w-[200px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generando...
            </>
          ) : (
            'Generar Simulación'
          )}
        </Button>
      </div>
    </form>
  );
};
