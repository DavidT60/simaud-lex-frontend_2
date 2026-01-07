import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { procesoJudicialAPI } from '@/lib/api';
import { 
  Loader2, Search, AlertCircle, ChevronRight, ChevronLeft, 
  CheckCircle2, User, Home, Heart, Wallet, Scale, FileText, Sparkles 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SimulationWizardFormProps {
  onSimulationComplete: (result: any) => void;
}

const STEPS = [
  { id: 'case_selection', title: 'Selección de Caso', icon: Search },
  { id: 'basic_data', title: 'Datos Básicos', icon: FileText },
  { id: 'minor_data', title: 'Datos del Menor', icon: User },
  { id: 'environment', title: 'Entorno y Guarda', icon: Home },
  { id: 'mother_data', title: 'Datos de la Madre', icon: Heart },
  { id: 'father_data', title: 'Datos del Padre', icon: Heart },
  { id: 'procedural', title: 'Aspectos Procesales', icon: Scale },
  { id: 'confirmation', title: 'Confirmación', icon: Sparkles },
];

export const SimulationWizardForm: React.FC<SimulationWizardFormProps> = ({ 
  onSimulationComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const { register, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm({
    mode: 'onChange'
  });
  
  const [casos, setCasos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingField, setProcessingField] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Case search states
  const [casoSearchTerm, setCasoSearchTerm] = useState('');
  const [isCasoListOpen, setIsCasoListOpen] = useState(false);
  const [selectedCaso, setSelectedCaso] = useState<any>(null);

  // Watch fields for summary
  const formData = watch();

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

  const handleNext = async () => {
    const stepId = STEPS[currentStep].id;
    let isValid = false;

    if (stepId === 'case_selection') {
      if (selectedCaso) isValid = true;
      else setError('Debe seleccionar un caso para continuar');
    } else {
      // Trigger validation for current step fields
      // This is a simplification; ideally we'd validate specific fields per step
      isValid = await trigger(); 
    }

    if (isValid) {
      setError(null);
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    setError(null);
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

    // Autofill Logic
    if (caso.nna) {
      // Age calculation
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
      // Special needs
      if (caso.nna.necesidades_especiales && Array.isArray(caso.nna.necesidades_especiales)) {
         const hasSpecialNeeds = caso.nna.necesidades_especiales.length > 0;
         setValue('menor_tiene_necesidades_especiales', hasSpecialNeeds ? 'true' : 'false');
      }
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (!selectedCaso) {
        setError('Debe seleccionar un caso');
        return;
      }

      setIsProcessing(true);
      setError(null);
      
      // Data preparation
      const safeNumber = (val: any) => val ? Number(val) : 0;
      const safeBool = (val: any) => val === 'true';

      const simulationData = {
        montoSolicitado: safeNumber(data.montoSolicitado),
        notasAdicionales: data.notasAdicionales,
        recursosDemandadoEstimados: safeNumber(data.recursosDemandadoEstimados),
        
        edad_del_menor: safeNumber(data.edad_del_menor),
        preferencia_del_menor: data.preferencia_del_menor,
        expresa_preferencia_valida: safeBool(data.expresa_preferencia_valida),
        tiene_madurez_suficiente: safeBool(data.tiene_madurez_suficiente),
        menor_tiene_necesidades_especiales: safeBool(data.menor_tiene_necesidades_especiales),
        
        custodia_previa: data.custodia_previa,
        condiciones_de_la_vivienda: data.condiciones_de_la_vivienda,
        distancia_entre_domicilios: safeNumber(data.distancia_entre_domicilios),
        presencia_escolar: data.presencia_escolar,
        ambos_padres_tienen_condiciones_adecuadas: safeBool(data.ambos_padres_tienen_condiciones_adecuadas),
        
        // Madre
        nombre_madre: data.nombre_madre || undefined,
        idoneidad_moral_madre: data.idoneidad_moral_madre,
        estado_emocional_madre: data.estado_emocional_madre,
        madre_demuestra_estabilidad_emocional: safeBool(data.madre_demuestra_estabilidad_emocional),
        madre_tiene_antecedentes_de_violencia: safeBool(data.madre_tiene_antecedentes_de_violencia),
        madre_evidencia_negligencia_severa: safeBool(data.madre_evidencia_negligencia_severa),
        madre_conducta_agresiva_anterior: safeBool(data.madre_conducta_agresiva_anterior),
        madre_reportes_psicosociales_negativos: safeBool(data.madre_reportes_psicosociales_negativos),
        disponibilidad_de_tiempo_madre: data.disponibilidad_de_tiempo_madre,
        estado_de_salud_madre: data.estado_de_salud_madre,
        madre_maneja_necesidades_especiales: safeBool(data.madre_maneja_necesidades_especiales),
        nivel_de_ingresos_madre: safeNumber(data.nivel_de_ingresos_madre),
        estabilidad_laboral_madre: data.estabilidad_laboral_madre,
        madre_tiene_ingresos_comprobados: safeBool(data.madre_tiene_ingresos_comprobados),
        madre_sin_ingresos_formales: safeBool(data.madre_sin_ingresos_formales),
        madre_cargas_familiares_adicionales: safeBool(data.madre_cargas_familiares_adicionales),
        madre_incumple_pension: safeBool(data.madre_incumple_pension),

        // Padre
        nombre_padre: data.nombre_padre || undefined,
        idoneidad_moral_padre: data.idoneidad_moral_padre,
        estado_emocional_padre: data.estado_emocional_padre,
        padre_demuestra_estabilidad_emocional: safeBool(data.padre_demuestra_estabilidad_emocional),
        padre_tiene_antecedentes_de_violencia: safeBool(data.padre_tiene_antecedentes_de_violencia),
        padre_evidencia_negligencia_severa: safeBool(data.padre_evidencia_negligencia_severa),
        padre_conducta_agresiva_anterior: safeBool(data.padre_conducta_agresiva_anterior),
        padre_reportes_psicosociales_negativos: safeBool(data.padre_reportes_psicosociales_negativos),
        disponibilidad_de_tiempo_padre: data.disponibilidad_de_tiempo_padre,
        estado_de_salud_padre: data.estado_de_salud_padre,
        padre_maneja_necesidades_especiales: safeBool(data.padre_maneja_necesidades_especiales),
        nivel_de_ingresos_padre: safeNumber(data.nivel_de_ingresos_padre),
        estabilidad_laboral_padre: data.estabilidad_laboral_padre,
        padre_tiene_ingresos_comprobados: safeBool(data.padre_tiene_ingresos_comprobados),
        padre_sin_ingresos_formales: safeBool(data.padre_sin_ingresos_formales),
        padre_cargas_familiares_adicionales: safeBool(data.padre_cargas_familiares_adicionales),
        padre_incumple_pension: safeBool(data.padre_incumple_pension),

        // Procesal
        cumplimiento_de_las_obligaciones_previas: data.cumplimiento_de_las_obligaciones_previas,
        documentos_presentados_validos: safeBool(data.documentos_presentados_validos),
        notificacion_correcta_verdadera: safeBool(data.notificacion_correcta_verdadera),
        parte_no_comparece_sin_justificacion: safeBool(data.parte_no_comparece_sin_justificacion),
        testigo_relevante_valido: safeBool(data.testigo_relevante_valido),
        prueba_psicosocial_disponible: safeBool(data.prueba_psicosocial_disponible),
        hay_conciliacion_entre_las_partes: safeBool(data.hay_conciliacion_entre_las_partes),
        evidencia_contradice_testimonio: safeBool(data.evidencia_contradice_testimonio),
        pruebas_son_insuficientes: safeBool(data.pruebas_son_insuficientes),
      };

      // Simulation animation
      const steps = ["Validando...", "Analizando reglas...", "Calculando...", "Generando sentencia..."];
      for (const step of steps) {
        setProcessingField(step);
        await new Promise(r => setTimeout(r, 500));
      }

      const result = await procesoJudicialAPI.simularSentencia(selectedCaso.id, simulationData);
      onSimulationComplete(result);
      setIsCompleted(true);
      
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al generar simulación');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentStepData = STEPS[currentStep];

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stepper Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
           <h2 className="text-2xl font-bold text-gray-800">{currentStepData.title}</h2>
           <span className="text-sm text-gray-500">Paso {currentStep + 1} de {STEPS.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 overflow-x-auto pb-2">
            {STEPS.map((step, idx) => {
                const Icon = step.icon;
                return (
                    <div key={step.id} className={cn("flex flex-col items-center min-w-[80px]", idx === currentStep ? "text-primary font-bold" : "text-gray-400")}>
                        <div className={cn("p-2 rounded-full mb-1", idx <= currentStep ? "bg-primary/10 text-primary" : "bg-gray-100")}>
                            <Icon size={16} />
                        </div>
                        <span className="text-xs text-center whitespace-nowrap">{step.title}</span>
                    </div>
                )
            })}
        </div>
      </div>

      <Card className="min-h-[400px] flex flex-col">
        <CardContent className="flex-1 p-6">
            
            {/* Error Display */}
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-center gap-2 mb-6">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            {/* Step 1: Selection */}
            {currentStep === 0 && (
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-700">Seleccionar Caso</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Buscar caso..."
                      value={casoSearchTerm}
                      onChange={(e) => {
                        setCasoSearchTerm(e.target.value);
                        setIsCasoListOpen(true);
                      }}
                      onFocus={() => setIsCasoListOpen(true)}
                      className="pl-10 h-12 text-lg"
                    />
                    
                    {isCasoListOpen && casoSearchTerm && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                            {filteredCasos.map(caso => (
                                <div 
                                    key={caso.id} 
                                    className="p-3 hover:bg-gray-50 cursor-pointer border-b"
                                    onClick={() => handleCasoSelect(caso)}
                                >
                                    <p className="font-bold">{caso.id_caso_dinamico}</p>
                                    <p className="text-sm">{caso.nna?.nombre_completo}</p>
                                </div>
                            ))}
                        </div>
                    )}
                  </div>
                  
                  {selectedCaso && (
                    <div className="bg-green-50 border border-green-200 p-4 rounded-md">
                        <div className="flex items-center gap-2 text-green-700 font-semibold">
                            <CheckCircle2 size={20} />
                            Caso Seleccionado
                        </div>
                        <p className="mt-1 text-green-800 text-lg">
                            {selectedCaso.id_caso_dinamico}
                        </p>
                        <p className="text-green-600">NNA: {selectedCaso.nna?.nombre_completo}</p>
                    </div>
                  )}
                </div>
            )}

            {/* Step 2: Basic Data */}
            {currentStep === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Monto Solicitado (DOP)</label>
                        <Input type="number" {...register('montoSolicitado')} placeholder="0.00" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Recursos Estimados del Demandado (DOP)</label>
                        <Input type="number" {...register('recursosDemandadoEstimados')} placeholder="0.00" />
                    </div>
                    <div className="col-span-2 space-y-2">
                        <label className="text-sm font-medium">Notas Adicionales</label>
                        <Input {...register('notasAdicionales')} placeholder="Detalles relevantes..." />
                    </div>
                </div>
            )}

            {/* Step 3: Minor Data */}
            {currentStep === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Edad del Menor</label>
                        <Input type="number" {...register('edad_del_menor')} defaultValue={selectedCaso?.nna && new Date().getFullYear() - new Date(selectedCaso.nna.fecha_nacimiento).getFullYear() } />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Preferencia</label>
                        <select {...register('preferencia_del_menor')} className="w-full border rounded-md h-10 px-3">
                            <option value="NINGUNA">NINGUNA</option>
                            <option value="MADRE">MADRE</option>
                            <option value="PADRE">PADRE</option>
                            <option value="AMBOS">AMBOS</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">¿Tiene madurez suficiente?</label>
                         <select {...register('tiene_madurez_suficiente')} className="w-full border rounded-md h-10 px-3">
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium">¿Necesidades Especiales?</label>
                         <select {...register('menor_tiene_necesidades_especiales')} className="w-full border rounded-md h-10 px-3">
                            <option value="false">No</option>
                            <option value="true">Sí</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium">¿Preferencia es válida?</label>
                         <select {...register('expresa_preferencia_valida')} className="w-full border rounded-md h-10 px-3">
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Step 4: Environment */}
            {currentStep === 3 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Custodia Previa</label>
                        <select {...register('custodia_previa')} className="w-full border rounded-md h-10 px-3">
                            <option value="MADRE">MADRE</option>
                            <option value="PADRE">PADRE</option>
                            <option value="COMPARTIDA">COMPARTIDA</option>
                            <option value="NINGUNA">NINGUNA</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Condiciones Vivienda</label>
                        <select {...register('condiciones_de_la_vivienda')} className="w-full border rounded-md h-10 px-3">
                            <option value="ADECUADAS">ADECUADAS</option>
                            <option value="INADECUADAS">INADECUADAS</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Distancia (km)</label>
                        <Input type="number" {...register('distancia_entre_domicilios')} />
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Ambos padres condiciones adecuadas</label>
                         <select {...register('ambos_padres_tienen_condiciones_adecuadas')} className="w-full border rounded-md h-10 px-3">
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Presencia Escolar</label>
                        <select {...register('presencia_escolar')} className="w-full border rounded-md h-10 px-3">
                            <option value="REGULAR">REGULAR</option>
                            <option value="IRREGULAR">IRREGULAR</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Step 5 & 6: Parents Data (Generic Render) */}
            {(currentStep === 4 || currentStep === 5) && (
                <div className="space-y-6">
                    <div className={cn("p-4 border-l-4 rounded bg-gray-50", currentStep === 4 ? "border-pink-400" : "border-blue-400")}>
                        <h3 className="font-bold text-lg mb-4">{currentStep === 4 ? "Sobre la MADRE" : "Sobre el PADRE"}</h3>
                        
                        {/* Parent Name Field */}
                        <div className="mb-6">
                            <label className="text-sm font-medium">Nombre Completo {currentStep === 4 ? "de la Madre" : "del Padre"}</label>
                            <Input 
                                type="text" 
                                placeholder={currentStep === 4 ? "Ej: María González" : "Ej: Juan Pérez"}
                                {...register(`nombre_${currentStep === 4 ? 'madre' : 'padre'}`)} 
                                className="mt-2"
                            />
                            <p className="text-xs text-gray-500 mt-1">Opcional: Ingrese el nombre completo</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {/* Individual Fields with specific options */}
                             
                             {/* Idoneidad Moral */}
                             <div className="space-y-2">
                                 <label className="text-sm font-medium">Idoneidad Moral</label>
                                 <select {...register(`idoneidad_moral_${currentStep === 4 ? 'madre' : 'padre'}`)} className="w-full border rounded-md h-10 px-3">
                                    <option value="BUENA">BUENA</option>
                                    <option value="MEDIA">MEDIA</option>
                                    <option value="MALA">MALA</option>
                                 </select>
                             </div>

                             {/* Estado Emocional */}
                             <div className="space-y-2">
                                 <label className="text-sm font-medium">Estado Emocional</label>
                                 <select {...register(`estado_emocional_${currentStep === 4 ? 'madre' : 'padre'}`)} className="w-full border rounded-md h-10 px-3">
                                    <option value="ESTABLE">ESTABLE</option>
                                    <option value="INESTABLE">INESTABLE</option>
                                    <option value="BAJO_TRATAMIENTO">BAJO TRATAMIENTO</option>
                                 </select>
                             </div>

                             {/* Disponibilidad de Tiempo */}
                             <div className="space-y-2">
                                 <label className="text-sm font-medium">Disponibilidad de Tiempo</label>
                                 <select {...register(`disponibilidad_de_tiempo_${currentStep === 4 ? 'madre' : 'padre'}`)} className="w-full border rounded-md h-10 px-3">
                                    <option value="ALTA">ALTA</option>
                                    <option value="MEDIA">MEDIA</option>
                                    <option value="BAJA">BAJA</option>
                                 </select>
                             </div>

                             {/* Estado de Salud */}
                             <div className="space-y-2">
                                 <label className="text-sm font-medium">Estado de Salud</label>
                                 <select {...register(`estado_de_salud_${currentStep === 4 ? 'madre' : 'padre'}`)} className="w-full border rounded-md h-10 px-3">
                                    <option value="SANO">SANO</option>
                                    <option value="CON_CONDICION">CON CONDICIÓN</option>
                                 </select>
                             </div>

                             {/* Estabilidad Laboral */}
                             <div className="space-y-2">
                                 <label className="text-sm font-medium">Estabilidad Laboral</label>
                                 <select {...register(`estabilidad_laboral_${currentStep === 4 ? 'madre' : 'padre'}`)} className="w-full border rounded-md h-10 px-3">
                                    <option value="ESTABLE">ESTABLE</option>
                                    <option value="INDEPENDIENTE">INDEPENDIENTE</option>
                                    <option value="DESEMPLEADO">DESEMPLEADO</option>
                                 </select>
                             </div>
                             
                             <div className="space-y-2">
                                <label className="text-sm font-medium">Ingresos Mensuales</label>
                                <Input type="number" {...register(`nivel_de_ingresos_${currentStep === 4 ? 'madre' : 'padre'}`)} />
                             </div>

                             {/* Boolean Fields */}
                             {[
                                {k: 'demuestra_estabilidad_emocional', l: 'Estabilidad Emocional'},
                                {k: 'tiene_antecedentes_de_violencia', l: 'Antecedentes Violencia'},
                                {k: 'evidencia_negligencia_severa', l: 'Negligencia Severa'},
                                {k: 'tiene_ingresos_comprobados', l: 'Ingresos Comprobados'},
                                {k: 'incumple_pension', l: 'Incumple Pensión'}
                             ].map(item => (
                                <div key={item.k} className="space-y-2">
                                    <label className="text-sm font-medium">{item.l}</label>
                                    <select 
                                        {...register(`${currentStep === 4 ? 'madre' : 'padre'}_${item.k}`)}
                                        className="w-full border rounded-md h-10 px-3"
                                    >
                                        <option value="true">Sí</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                             ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Step 7: Procedural */}
            {currentStep === 6 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        { k: 'documentos_presentados_validos', l: 'Documentos Válidos' },
                        { k: 'notificacion_correcta_verdadera', l: 'Notificación Correcta' },
                        { k: 'parte_no_comparece_sin_justificacion', l: 'Incomparecencia Injustificada' },
                        { k: 'testigo_relevante_valido', l: 'Testigos Válidos' },
                        { k: 'prueba_psicosocial_disponible', l: 'Prueba Psicosocial Disponible' },
                        { k: 'hay_conciliacion_entre_las_partes', l: 'Hubo Conciliación' }
                    ].map(field => (
                        <div key={field.k} className="space-y-2">
                            <label className="text-sm font-medium">{field.l}</label>
                            <select {...register(field.k)} className="w-full border rounded-md h-10 px-3">
                                <option value="true">Sí</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                    ))}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Cumplimiento Obligaciones Previas</label>
                        <select {...register('cumplimiento_de_las_obligaciones_previas')} className="w-full border rounded-md h-10 px-3">
                            <option value="BUENO">BUENO</option>
                            <option value="REGULAR">REGULAR</option>
                            <option value="MALO">MALO</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Step 8: Confirmation */}
            {currentStep === 7 && (
                <div className="space-y-6 text-center">
                    <div className="flex justify-center">
                        <div className="bg-primary/10 p-6 rounded-full">
                           <Sparkles size={48} className="text-primary" />
                        </div>
                    </div>
                    <h3 className="text-2xl font-bold">¡Todo listo para simular!</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Has completado todos los pasos necesarios. El motor de inferencia analizará los datos ingresados para generar una recomendación de sentencia.
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-md text-left max-w-lg mx-auto text-sm space-y-2">
                        <p><strong>Caso:</strong> {selectedCaso?.id_caso_dinamico}</p>
                        <p><strong>Menor:</strong> {formData.edad_del_menor} años</p>
                        <p><strong>Custodia Previa:</strong> {formData.custodia_previa}</p>
                        <p><strong>Ingresos Madre:</strong> {formData.nivel_de_ingresos_madre}</p>
                        <p><strong>Ingresos Padre:</strong> {formData.nivel_de_ingresos_padre}</p>
                    </div>
                </div>
            )}

        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
            <Button 
                variant="outline" 
                onClick={handleBack} 
                disabled={currentStep === 0 || isProcessing}
            >
                <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
            </Button>
            
            {currentStep === STEPS.length - 1 ? (
                <Button onClick={handleSubmit(onSubmit)} disabled={isProcessing || isCompleted} className="bg-green-600 hover:bg-green-700">
                    {isCompleted ? (
                        <>Simulación Completada <CheckCircle2 className="ml-2 h-4 w-4" /></>
                    ) : isProcessing ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {processingField || "Procesando..."}
                        </>
                    ) : (
                        <>Simular Sentencia <Sparkles className="ml-2 h-4 w-4" /></>
                    )}
                </Button>
            ) : (
                <Button onClick={handleNext}>
                    Siguiente <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            )}
        </CardFooter>
      </Card>
    </div>
  );
};
