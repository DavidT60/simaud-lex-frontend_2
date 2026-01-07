import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { procesoJudicialAPI } from '@/lib/api';
import { Loader2, Search, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface SimulationFormCompleteProps {
  onSimulationComplete: (result: any) => void;
}

export const SimulationFormComplete: React.FC<SimulationFormCompleteProps> = ({ 
  onSimulationComplete 
}) => {
  const { register, handleSubmit, setValue, formState: { isSubmitting } } = useForm();
  const [casos, setCasos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Animation states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingField, setProcessingField] = useState<string>('');
  const [processingStep, setProcessingStep] = useState(0);
  
  // Case search states
  const [casoSearchTerm, setCasoSearchTerm] = useState('');
  const [isCasoListOpen, setIsCasoListOpen] = useState(false);
  const [selectedCaso, setSelectedCaso] = useState<any>(null);

  // Section collapse states
  const [sectionsOpen, setSectionsOpen] = useState({
    basicos: true,
    menor: false,
    ambiente: false,
    progenitores: false,
    salud: false,
    financieros: false,
    procesales: false,
  });

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

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const onSubmit = async (data: any) => {
    try {
      setError(null);
      
      if (!selectedCaso) {
        setError('Debe seleccionar un caso');
        return;
      }

      // Convert form data to proper types
      const simulationData = {
        // Basicos
        montoSolicitado: data.montoSolicitado ? Number(data.montoSolicitado) : undefined,
        notasAdicionales: data.notasAdicionales || undefined,
        recursosDemandadoEstimados: data.recursosDemandadoEstimados ? Number(data.recursosDemandadoEstimados) : undefined,
        
        // Atributos del menor
        edad_del_menor: Number(data.edad_del_menor),
        preferencia_del_menor: data.preferencia_del_menor,
        expresa_preferencia_valida: data.expresa_preferencia_valida === 'true',
        tiene_madurez_suficiente: data.tiene_madurez_suficiente === 'true',
        menor_tiene_necesidades_especiales: data.menor_tiene_necesidades_especiales === 'true',
        
        // Guarda/Ambiente
        custodia_previa: data.custodia_previa,
        condiciones_de_la_vivienda: data.condiciones_de_la_vivienda,
        distancia_entre_domicilios: Number(data.distancia_entre_domicilios),
        presencia_escolar: data.presencia_escolar,
        ambos_padres_tienen_condiciones_adecuadas: data.ambos_padres_tienen_condiciones_adecuadas === 'true',
        
        // Progenitores - MADRE
        nombre_madre: data.nombre_madre || undefined,
        idoneidad_moral_madre: data.idoneidad_moral_madre,
        estado_emocional_madre: data.estado_emocional_madre,
        madre_demuestra_estabilidad_emocional: data.madre_demuestra_estabilidad_emocional === 'true',
        madre_tiene_antecedentes_de_violencia: data.madre_tiene_antecedentes_de_violencia === 'true',
        madre_evidencia_negligencia_severa: data.madre_evidencia_negligencia_severa === 'true',
        madre_conducta_agresiva_anterior: data.madre_conducta_agresiva_anterior === 'true',
        madre_reportes_psicosociales_negativos: data.madre_reportes_psicosociales_negativos === 'true',

        // Progenitores - PADRE
        nombre_padre: data.nombre_padre || undefined,
        idoneidad_moral_padre: data.idoneidad_moral_padre,
        estado_emocional_padre: data.estado_emocional_padre,
        padre_demuestra_estabilidad_emocional: data.padre_demuestra_estabilidad_emocional === 'true',
        padre_tiene_antecedentes_de_violencia: data.padre_tiene_antecedentes_de_violencia === 'true',
        padre_evidencia_negligencia_severa: data.padre_evidencia_negligencia_severa === 'true',
        padre_conducta_agresiva_anterior: data.padre_conducta_agresiva_anterior === 'true',
        padre_reportes_psicosociales_negativos: data.padre_reportes_psicosociales_negativos === 'true',
        
        // Tiempo y Salud - MADRE
        disponibilidad_de_tiempo_madre: data.disponibilidad_de_tiempo_madre,
        estado_de_salud_madre: data.estado_de_salud_madre,
        madre_maneja_necesidades_especiales: data.madre_maneja_necesidades_especiales === 'true',

        // Tiempo y Salud - PADRE
        disponibilidad_de_tiempo_padre: data.disponibilidad_de_tiempo_padre,
        estado_de_salud_padre: data.estado_de_salud_padre,
        padre_maneja_necesidades_especiales: data.padre_maneja_necesidades_especiales === 'true',
        
        // Financieros - MADRE
        nivel_de_ingresos_madre: Number(data.nivel_de_ingresos_madre),
        estabilidad_laboral_madre: data.estabilidad_laboral_madre,
        madre_tiene_ingresos_comprobados: data.madre_tiene_ingresos_comprobados === 'true',
        madre_sin_ingresos_formales: data.madre_sin_ingresos_formales === 'true',
        madre_cargas_familiares_adicionales: data.madre_cargas_familiares_adicionales === 'true',
        madre_incumple_pension: data.madre_incumple_pension === 'true',

        // Financieros - PADRE
        nivel_de_ingresos_padre: Number(data.nivel_de_ingresos_padre),
        estabilidad_laboral_padre: data.estabilidad_laboral_padre,
        padre_tiene_ingresos_comprobados: data.padre_tiene_ingresos_comprobados === 'true',
        padre_sin_ingresos_formales: data.padre_sin_ingresos_formales === 'true',
        padre_cargas_familiares_adicionales: data.padre_cargas_familiares_adicionales === 'true',
        padre_incumple_pension: data.padre_incumple_pension === 'true',
        cumplimiento_de_las_obligaciones_previas: data.cumplimiento_de_las_obligaciones_previas,
        
        // Procesales
        documentos_presentados_validos: data.documentos_presentados_validos === 'true',
        notificacion_correcta_verdadera: data.notificacion_correcta_verdadera === 'true',
        parte_no_comparece_sin_justificacion: data.parte_no_comparece_sin_justificacion === 'true',
        testigo_relevante_valido: data.testigo_relevante_valido === 'true',
        prueba_psicosocial_disponible: data.prueba_psicosocial_disponible === 'true',
        hay_conciliacion_entre_las_partes: data.hay_conciliacion_entre_las_partes === 'true',
        evidencia_contradice_testimonio: data.evidencia_contradice_testimonio === 'true',
        pruebas_son_insuficientes: data.pruebas_son_insuficientes === 'true',
      };
      
      
      // Animation sequence
      setIsProcessing(true);
      
      // Helper for safe number conversion
      const safeNumber = (val: any) => {
        if (!val) return 0;
        const num = Number(val);
        return isNaN(num) ? 0 : num;
      };

      // Sanitize data before sending
      const sanitizedData = {
        ...simulationData,
        montoSolicitado: data.montoSolicitado ? Number(data.montoSolicitado) : undefined,
        recursosDemandadoEstimados: data.recursosDemandadoEstimados ? Number(data.recursosDemandadoEstimados) : undefined,
        edad_del_menor: safeNumber(data.edad_del_menor),
        distancia_entre_domicilios: safeNumber(data.distancia_entre_domicilios),
        nivel_de_ingresos: safeNumber(data.nivel_de_ingresos),
      };
      
      // Start API call concurrently
      // Attach a catch handler to avoid "Uncaught (in promise)" if it fails during animation
      const apiPromise = procesoJudicialAPI.simularSentencia(selectedCaso.id, sanitizedData)
        .catch(err => {
            // We want to re-throw this error later when we await it
            throw err;
        });

      const simulationFields = [
        "Identificando reglas aplicables...",
        "Validando atributos del menor...",
        "Analizando condiciones de vivienda...",
        "Verificando ingresos del demandado...",
        "Calculando montos de manutención...",
        "Consultando base legal...",
        "Generando razonamiento jurídico...",
        "Finalizando simulación..."
      ];

      for (let i = 0; i < simulationFields.length; i++) {
        setProcessingField(simulationFields[i]);
        setProcessingStep(i + 1);
        try {
            // Check if API already failed (optimization: stop animation early if error)
            // But promises don't expose state easily without race.
            // Just continue animation. 
            await new Promise(resolve => setTimeout(resolve, 600)); 
        } catch (e) { break; }
      }

      // Wait for API result
      // If apiPromise rejected, this await will throw and go to the main catch block
      const result = await apiPromise;
      setIsProcessing(false);
      onSimulationComplete(result);
      
      // Reset form
      setCasoSearchTerm('');
      setSelectedCaso(null);
    } catch (err: any) {
      console.error('Error en simulación:', err);
      
      // Extract validation messages based on AllExceptionsFilter structure:
      // { statusCode: 400, error: { message: [...] }, timestamp: ... }
      const backendError = err.response?.data?.error;
      
      if (backendError?.message) {
         console.error("Backend Validation Errors:", backendError.message);
      }
      
      let errorMessage = 'Error al generar simulación';
      if (backendError?.message) {
        // If it's an array (class-validator), join them
        if (Array.isArray(backendError.message)) {
            errorMessage = backendError.message.join(', ');
        } else {
            errorMessage = backendError.message;
        }
      } else if (err.response?.data?.message) {
          // Fallback if structure is different
          errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
    }
  };

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

    // Autofill data from NNA if available
    if (caso.nna) {
      // 1. Calculate Age
      if (caso.nna.fecha_nacimiento) {
        const birthDate = new Date(caso.nna.fecha_nacimiento);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }
        setValue('edad_del_menor', age);
      }

      // 2. Special Needs
      if (caso.nna.necesidades_especiales && Array.isArray(caso.nna.necesidades_especiales)) {
         const hasSpecialNeeds = caso.nna.necesidades_especiales.length > 0;
         setValue('menor_tiene_necesidades_especiales', hasSpecialNeeds ? 'true' : 'false');
      }
      
      // 3. Pre-open sections based on relevance
      setSectionsOpen(prev => ({
          ...prev,
          menor: true // Open the section to show the filled data
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
        <span className="ml-2 text-primary-600">Cargando casos...</span>
      </div>
    );
  }

  const SectionHeader = ({ title, section }: { title: string; section: keyof typeof sectionsOpen }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors border-b border-primary-200 dark:border-primary-800"
    >
      <h3 className="text-lg font-semibold text-primary-900 dark:text-primary-100">{title}</h3>
      {sectionsOpen[section] ? (
        <ChevronUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-primary-600 dark:text-primary-400" />
      )}
    </button>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Case Selector */}
      <div className="space-y-2 p-4 border rounded-lg bg-white dark:bg-slate-900 dark:border-slate-800">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Seleccionar Caso <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input className="dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 pl-10"
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
            />
          </div>
          
          {isCasoListOpen && casoSearchTerm && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredCasos.length > 0 ? (
                filteredCasos.map((caso) => (
                  <div
                    key={caso.id}
                    className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    onClick={() => handleCasoSelect(caso)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {caso.id_caso_dinamico || 'Sin número'}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
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
                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 text-center">
                  No se encontraron casos
                </div>
              )}
            </div>
          )}
        </div>

        {selectedCaso && (
          <Card className="bg-gree-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <p className="text-sm text-green-800 dark:text-green-300">
                <span className="font-medium">Caso seleccionado:</span> {selectedCaso.id_caso_dinamico}
              </p>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                NNA: {selectedCaso.nna?.nombre_completo} • Tipo: {selectedCaso.tipo_demanda}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Only show form sections when a case is selected */}
      {selectedCaso && (
        <div className="space-y-2 border rounded-lg overflow-hidden dark:border-slate-800">
          {/* SECCIÓN: Datos Básicos */}
          <div>
            <SectionHeader title="I. Datos Básicos (Opcional)" section="basicos" />
            {sectionsOpen.basicos && (
              <div className="p-4 space-y-4 bg-white dark:bg-slate-900">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Monto Solicitado (DOP)</label>
                    <Input type="number" placeholder="15000" {...register('montoSolicitado')} min="0" step="100" className="dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Recursos Demandado Estimados (DOP)</label>
                    <Input className="dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100" type="number" placeholder="80000" {...register('recursosDemandadoEstimados')} min="0" step="1000" />
                  </div>
                  <div className="md:col-span-1">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notas Adicionales</label>
                    <Input className="dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100" placeholder="Información adicional..." {...register('notasAdicionales')} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN: Atributos del Menor */}
          <div>
            <SectionHeader title="II. Atributos del Menor" section="menor" />
            {sectionsOpen.menor && (
              <div className="p-4 space-y-4 bg-white dark:bg-slate-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Edad del Menor <span className="text-red-500">*</span></label>
                    <Input type="number" {...register('edad_del_menor', { required: true })} min="0" max="18" defaultValue="8" className="dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preferencia del Menor <span className="text-red-500">*</span></label>
                    <select {...register('preferencia_del_menor', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100">
                      <option value="MADRE">MADRE</option>
                      <option value="PADRE">PADRE</option>
                      <option value="AMBOS">AMBOS</option>
                      <option value="NINGUNA">NINGUNA</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Expresa Preferencia Válida <span className="text-red-500">*</span></label>
                    <select {...register('expresa_preferencia_valida', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiene Madurez Suficiente <span className="text-red-500">*</span></label>
                    <select {...register('tiene_madurez_suficiente', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Menor Tiene Necesidades Especiales <span className="text-red-500">*</span></label>
                    <select {...register('menor_tiene_necesidades_especiales', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                      <option value="false">No</option>
                      <option value="true">Sí</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN: Guarda/Ambiente */}
          <div>
            <SectionHeader title="III. Guarda y Ambiente" section="ambiente" />
            {sectionsOpen.ambiente && (
              <div className="p-4 space-y-4 bg-white dark:bg-slate-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Custodia Previa <span className="text-red-500">*</span></label>
                    <select {...register('custodia_previa', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100">
                      <option value="MADRE">MADRE</option>
                      <option value="PADRE">PADRE</option>
                      <option value="COMPARTIDA">COMPARTIDA</option>
                      <option value="NINGUNA">NINGUNA</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Condiciones de la Vivienda <span className="text-red-500">*</span></label>
                    <select {...register('condiciones_de_la_vivienda', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                      <option value="ADECUADAS">ADECUADAS</option>
                      <option value="INADECUADAS">INADECUADAS</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Distancia Entre Domicilios (km) <span className="text-red-500">*</span></label>
                    <Input type="number" {...register('distancia_entre_domicilios', { required: true })} min="0" step="0.1" defaultValue="5" className="dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Presencia Escolar <span className="text-red-500">*</span></label>
                    <select {...register('presencia_escolar', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                      <option value="REGULAR">REGULAR</option>
                      <option value="IRREGULAR">IRREGULAR</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ambos Padres Tienen Condiciones Adecuadas <span className="text-red-500">*</span></label>
                    <select {...register('ambos_padres_tienen_condiciones_adecuadas', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN: Progenitores */}
          <div>
            <SectionHeader title="IV. Atributos de Progenitores" section="progenitores" />
             {sectionsOpen.progenitores && (
              <div className="p-4 space-y-6 bg-white dark:bg-slate-900">
                {/* IV.A. Datos de la Madre */}
                <div className="border-l-4 border-pink-400 pl-4">
                  <h4 className="text-md font-semibold text-pink-700 dark:text-pink-400 mb-4">IV.A. Datos de la Madre</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo de la Madre</label>
                      <Input type="text" placeholder="Ej: María González" {...register('nombre_madre')} className="dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Idoneidad Moral (Madre) <span className="text-red-500">*</span></label>
                      <select {...register('idoneidad_moral_madre', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                        <option value="BUENA">BUENA</option>
                        <option value="MEDIA">MEDIA</option>
                        <option value="MALA">MALA</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado Emocional (Madre) <span className="text-red-500">*</span></label>
                      <select {...register('estado_emocional_madre', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                        <option value="ESTABLE">ESTABLE</option>
                        <option value="INESTABLE">INESTABLE</option>
                        <option value="BAJO_TRATAMIENTO">BAJO TRATAMIENTO</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Demuestra Estabilidad Emocional (Madre) <span className="text-red-500">*</span></label>
                      <select {...register('madre_demuestra_estabilidad_emocional', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Antecedentes de Violencia (Madre) <span className="text-red-500">*</span></label>
                      <select {...register('madre_tiene_antecedentes_de_violencia', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                        <option value="false">No</option>
                        <option value="true">Sí</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Evidencia de Negligencia Severa (Madre) <span className="text-red-500">*</span></label>
                      <select {...register('madre_evidencia_negligencia_severa', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                        <option value="false">No</option>
                        <option value="true">Sí</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Conducta Agresiva Anterior (Madre) <span className="text-red-500">*</span></label>
                      <select {...register('madre_conducta_agresiva_anterior', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                        <option value="false">No</option>
                        <option value="true">Sí</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reportes Psicosociales Negativos (Madre) <span className="text-red-500">*</span></label>
                      <select {...register('madre_reportes_psicosociales_negativos', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                        <option value="false">No</option>
                        <option value="true">Sí</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* IV.B. Datos del Padre */}
                <div className="border-l-4 border-blue-400 pl-4">
                  <h4 className="text-md font-semibold text-blue-700 dark:text-blue-400 mb-4">IV.B. Datos del Padre</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo del Padre</label>
                      <Input type="text" placeholder="Ej: Juan Pérez" {...register('nombre_padre')} className="dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Idoneidad Moral (Padre) <span className="text-red-500">*</span></label>
                      <select {...register('idoneidad_moral_padre', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                        <option value="BUENA">BUENA</option>
                        <option value="MEDIA">MEDIA</option>
                        <option value="MALA">MALA</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado Emocional (Padre) <span className="text-red-500">*</span></label>
                      <select {...register('estado_emocional_padre', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                        <option value="ESTABLE">ESTABLE</option>
                        <option value="INESTABLE">INESTABLE</option>
                        <option value="BAJO_TRATAMIENTO">BAJO TRATAMIENTO</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Demuestra Estabilidad Emocional (Padre) <span className="text-red-500">*</span></label>
                      <select {...register('padre_demuestra_estabilidad_emocional', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                        <option value="true">Sí</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Antecedentes de Violencia (Padre) <span className="text-red-500">*</span></label>
                      <select {...register('padre_tiene_antecedentes_de_violencia', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                        <option value="false">No</option>
                        <option value="true">Sí</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Evidencia de Negligencia Severa (Padre) <span className="text-red-500">*</span></label>
                      <select {...register('padre_evidencia_negligencia_severa', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                        <option value="false">No</option>
                        <option value="true">Sí</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Conducta Agresiva Anterior (Padre) <span className="text-red-500">*</span></label>
                      <select {...register('padre_conducta_agresiva_anterior', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                        <option value="false">No</option>
                        <option value="true">Sí</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Reportes Psicosociales Negativos (Padre) <span className="text-red-500">*</span></label>
                      <select {...register('padre_reportes_psicosociales_negativos', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                        <option value="false">No</option>
                        <option value="true">Sí</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN: Tiempo y Salud */}
          <div>
            <SectionHeader title="V. Tiempo y Salud" section="salud" />
            {sectionsOpen.salud && (
              <div className="p-4 space-y-4 bg-white dark:bg-slate-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* V.A. Madre */}
                  <div className="border-l-4 border-pink-400 pl-4">
                    <h4 className="text-md font-semibold text-pink-700 mb-4">Madre</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Disponibilidad de Tiempo (Madre) <span className="text-red-500">*</span></label>
                        <select {...register('disponibilidad_de_tiempo_madre', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                          <option value="ALTA">ALTA</option>
                          <option value="MEDIA">MEDIA</option>
                          <option value="BAJA">BAJA</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado de Salud Física (Madre) <span className="text-red-500">*</span></label>
                        <select {...register('estado_de_salud_madre', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                          <option value="SANO">SANO</option>
                          <option value="CON_CONDICION">CON CONDICIÓN</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Maneja Necesidades Especiales (Madre) <span className="text-red-500">*</span></label>
                        <select {...register('madre_maneja_necesidades_especiales', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                          <option value="true">Sí</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* V.B. Padre */}
                  <div className="border-l-4 border-blue-400 pl-4">
                    <h4 className="text-md font-semibold text-blue-700 mb-4">Padre</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Disponibilidad de Tiempo (Padre) <span className="text-red-500">*</span></label>
                        <select {...register('disponibilidad_de_tiempo_padre', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                          <option value="ALTA">ALTA</option>
                          <option value="MEDIA">MEDIA</option>
                          <option value="BAJA">BAJA</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado de Salud Física (Padre) <span className="text-red-500">*</span></label>
                        <select {...register('estado_de_salud_padre', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                          <option value="SANO">SANO</option>
                          <option value="CON_CONDICION">CON CONDICIÓN</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Maneja Necesidades Especiales (Padre) <span className="text-red-500">*</span></label>
                        <select {...register('padre_maneja_necesidades_especiales', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                          <option value="true">Sí</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN: Financieros */}
          <div>
            <SectionHeader title="VI. Atributos Financieros y Cumplimiento" section="financieros" />
            {sectionsOpen.financieros && (
              <div className="p-4 space-y-4 bg-white dark:bg-slate-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* VI.A. Madre */}
                  <div className="border-l-4 border-pink-400 pl-4">
                    <h4 className="text-md font-semibold text-pink-700 dark:text-pink-400 mb-4">Madre</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nivel de Ingresos (DOP/mes) (Madre) <span className="text-red-500">*</span></label>
                        <Input type="number" {...register('nivel_de_ingresos_madre', { required: true })} min="0" step="100" defaultValue="50000" className="dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estabilidad Laboral (Madre) <span className="text-red-500">*</span></label>
                        <select {...register('estabilidad_laboral_madre', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                          <option value="ESTABLE">ESTABLE</option>
                          <option value="INDEPENDIENTE">INDEPENDIENTE</option>
                          <option value="DESEMPLEADO">DESEMPLEADO</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiene Ingresos Comprobados (Madre) <span className="text-red-500">*</span></label>
                        <select {...register('madre_tiene_ingresos_comprobados', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                          <option value="true">Sí</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sin Ingresos Formales (Madre) <span className="text-red-500">*</span></label>
                        <select {...register('madre_sin_ingresos_formales', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                          <option value="false">No</option>
                          <option value="true">Sí</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cargas Familiares Adicionales (Madre) <span className="text-red-500">*</span></label>
                        <select {...register('madre_cargas_familiares_adicionales', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                          <option value="true">Sí</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Incumple Pensión (Madre) <span className="text-red-500">*</span></label>
                        <select {...register('madre_incumple_pension', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                          <option value="false">No</option>
                          <option value="true">Sí</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* VI.B. Padre */}
                  <div className="border-l-4 border-blue-400 pl-4">
                    <h4 className="text-md font-semibold text-blue-700 dark:text-blue-400 mb-4">Padre</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nivel de Ingresos (DOP/mes) (Padre) <span className="text-red-500">*</span></label>
                        <Input type="number" {...register('nivel_de_ingresos_padre', { required: true })} min="0" step="100" defaultValue="50000" className="dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100" />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estabilidad Laboral (Padre) <span className="text-red-500">*</span></label>
                        <select {...register('estabilidad_laboral_padre', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                          <option value="ESTABLE">ESTABLE</option>
                          <option value="INDEPENDIENTE">INDEPENDIENTE</option>
                          <option value="DESEMPLEADO">DESEMPLEADO</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tiene Ingresos Comprobados (Padre) <span className="text-red-500">*</span></label>
                        <select {...register('padre_tiene_ingresos_comprobados', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                          <option value="true">Sí</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sin Ingresos Formales (Padre) <span className="text-red-500">*</span></label>
                        <select {...register('padre_sin_ingresos_formales', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                          <option value="false">No</option>
                          <option value="true">Sí</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cargas Familiares Adicionales (Padre) <span className="text-red-500">*</span></label>
                        <select {...register('padre_cargas_familiares_adicionales', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                          <option value="true">Sí</option>
                          <option value="false">No</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Incumple Pensión (Padre) <span className="text-red-500">*</span></label>
                        <select {...register('padre_incumple_pension', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                          <option value="false">No</option>
                          <option value="true">Sí</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cumplimiento de Obligaciones Previas (General) */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cumplimiento de Obligaciones Previas <span className="text-red-500">*</span></label>
                  <select {...register('cumplimiento_de_las_obligaciones_previas', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                    <option value="BUENO">BUENO</option>
                    <option value="REGULAR">REGULAR</option>
                    <option value="MALO">MALO</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* SECCIÓN: Procesales */}
          <div>
            <SectionHeader title="VII. Atributos Procesales" section="procesales" />
            {sectionsOpen.procesales && (
              <div className="p-4 space-y-4 bg-white dark:bg-slate-900">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Documentos Presentados Válidos <span className="text-red-500">*</span></label>
                    <select {...register('documentos_presentados_validos', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Notificación Correcta/Verdadera <span className="text-red-500">*</span></label>
                    <select {...register('notificacion_correcta_verdadera', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Parte No Comparece Sin Justificación <span className="text-red-500">*</span></label>
                    <select {...register('parte_no_comparece_sin_justificacion', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                      <option value="false">No</option>
                      <option value="true">Sí</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Testigo Relevante Válido <span className="text-red-500">*</span></label>
                    <select {...register('testigo_relevante_valido', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Prueba Psicosocial Disponible <span className="text-red-500">*</span></label>
                    <select {...register('prueba_psicosocial_disponible', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Hay Conciliación Entre las Partes <span className="text-red-500">*</span></label>
                    <select {...register('hay_conciliacion_entre_las_partes', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Evidencia Contradice Testimonio <span className="text-red-500">*</span></label>
                    <select {...register('evidencia_contradice_testimonio', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                      <option value="false">No</option>
                      <option value="true">Sí</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Pruebas Son Insuficientes <span className="text-red-500">*</span></label>
                    <select {...register('pruebas_son_insuficientes', { required: true })} className="flex h-10 w-full rounded-md border border-input bg-background dark:bg-slate-800 dark:border-slate-700 dark:text-gray-100 px-3 py-2 text-sm">
                      <option value="false">No</option>
                      <option value="true">Sí</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="p-4 bg-gray-50 flex justify-end gap-3">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="min-w-[200px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generando...
                </>
              ) : (
                'Generar Simulación Completa'
              )}
            </Button>
          </div>
        </div>
      )}
      {/* Processing Overlay Animation */}
      {isProcessing && (
        <div className="fixed inset-0 bg-white dark:bg-slate-900/90 z-50 flex flex-col items-center justify-center p-6 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-8">
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-primary-200 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 border-4 border-t-primary-600 rounded-full animate-spin"></div>
                <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-primary-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Simulando Sentencia</h3>
              <p className="text-gray-500 text-center mb-8">El motor de inferencia está analizando el caso...</p>
              
              <div className="w-full bg-gray-100 rounded-full h-2 mb-4 overflow-hidden">
                <div 
                  className="h-full bg-primary-600 transition-all duration-300 ease-out"
                  style={{ width: `${Math.min(processingStep * 10, 100)}%` }}
                />
              </div>
              
              <div className="h-8 flex custom-processing-text items-center justify-center">
                <p className="text-sm font-medium text-primary-700 animate-pulse">
                  {processingField && `Analizando: ${processingField}`}
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-xs opacity-50">
               {/* Decorative background elements to look like processing data */}
               <div className="font-mono text-gray-400">Verificando Idoneidad Moral...</div>
               <div className="font-mono text-gray-400 text-right">OK</div>
               <div className="font-mono text-gray-400">Calculando Ingresos...</div>
               <div className="font-mono text-gray-400 text-right">OK</div>
               <div className="font-mono text-gray-400">Validando Documentos...</div>
               <div className="font-mono text-gray-400 text-right">PENDIENTE</div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};
