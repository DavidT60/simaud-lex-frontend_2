import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface HechosSimulacionData {
  // Basic data
  montoSolicitado?: number;
  notasAdicionales?: string;
  recursosDemandadoEstimados?: number;

  // Results
  puntuacion_madre?: number;
  puntuacion_padre?: number;
  recomendacion_custodia?: string;
  fecha_simulacion?: string;

  // Minor attributes
  edad_del_menor: number;
  preferencia_del_menor: string;
  expresa_preferencia_valida: boolean;
  tiene_madurez_suficiente: boolean;
  menor_tiene_necesidades_especiales: boolean;

  // Environment
  custodia_previa: string;
  condiciones_de_la_vivienda: string;
  distancia_entre_domicilios: number;
  presencia_escolar: string;
  ambos_padres_tienen_condiciones_adecuadas: boolean;

  // Mother data
  nombre_madre?: string;
  idoneidad_moral_madre: string;
  estado_emocional_madre: string;
  madre_demuestra_estabilidad_emocional: boolean;
  madre_tiene_antecedentes_de_violencia: boolean;
  madre_evidencia_negligencia_severa: boolean;
  madre_conducta_agresiva_anterior: boolean;
  madre_reportes_psicosociales_negativos: boolean;
  disponibilidad_de_tiempo_madre: string;
  estado_de_salud_madre: string;
  madre_maneja_necesidades_especiales: boolean;
  nivel_de_ingresos_madre: number;
  estabilidad_laboral_madre: string;
  madre_tiene_ingresos_comprobados: boolean;
  madre_sin_ingresos_formales: boolean;
  madre_cargas_familiares_adicionales: boolean;
  madre_incumple_pension: boolean;

  // Father data
  nombre_padre?: string;
  idoneidad_moral_padre: string;
  estado_emocional_padre: string;
  padre_demuestra_estabilidad_emocional: boolean;
  padre_tiene_antecedentes_de_violencia: boolean;
  padre_evidencia_negligencia_severa: boolean;
  padre_conducta_agresiva_anterior: boolean;
  padre_reportes_psicosociales_negativos: boolean;
  disponibilidad_de_tiempo_padre: string;
  estado_de_salud_padre: string;
  padre_maneja_necesidades_especiales: boolean;
  nivel_de_ingresos_padre: number;
  estabilidad_laboral_padre: string;
  padre_tiene_ingresos_comprobados: boolean;
  padre_sin_ingresos_formales: boolean;
  padre_cargas_familiares_adicionales: boolean;
  padre_incumple_pension: boolean;

  cumplimiento_de_las_obligaciones_previas: string;

  // Procedural
  documentos_presentados_validos: boolean;
  notificacion_correcta_verdadera: boolean;
  parte_no_comparece_sin_justificacion: boolean;
  testigo_relevante_valido: boolean;
  prueba_psicosocial_disponible: boolean;
  hay_conciliacion_entre_las_partes: boolean;
  evidencia_contradice_testimonio: boolean;
  pruebas_son_insuficientes: boolean;
}

interface HechosSimulacionReadOnlyProps {
  data: HechosSimulacionData;
}

export const HechosSimulacionReadOnly: React.FC<HechosSimulacionReadOnlyProps> = ({ data }) => {
  const [sectionsOpen, setSectionsOpen] = React.useState({
    results: true,
    basicos: false,
    menor: false,
    ambiente: false,
    madre: false,
    padre: false,
    procesales: false,
  });

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const formatBoolean = (value: boolean) => value ? 'Sí' : 'No';
  const formatCurrency = (value?: number) => value ? `RD$ ${value.toLocaleString()}` : 'N/A';

  const SectionHeader = ({ title, section }: { title: string; section: keyof typeof sectionsOpen }) => (
    <button
      type="button"
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border-b border-slate-300 dark:border-slate-600"
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {sectionsOpen[section] ? (
        <ChevronUp className="w-5 h-5 text-slate-600 dark:text-slate-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-slate-600 dark:text-slate-400" />
      )}
    </button>
  );

  const DataField = ({ label, value }: { label: string; value: string | number }) => (
    <div>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-1">{label}</p>
      <p className="text-base text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );

  return (
    <div className="space-y-2 border rounded-lg overflow-hidden dark:border-slate-700">
      {/* Results Section */}
      <div>
        <SectionHeader title="Resultados de la Simulación" section="results" />
        {sectionsOpen.results && (
          <div className="p-4 space-y-4 bg-white dark:bg-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DataField 
                label="Puntuación Madre" 
                value={data.puntuacion_madre != null ? Number(data.puntuacion_madre).toFixed(2) : 'N/A'} 
              />
              <DataField 
                label="Puntuación Padre" 
                value={data.puntuacion_padre != null ? Number(data.puntuacion_padre).toFixed(2) : 'N/A'} 
              />
              <DataField label="Recomendación de Custodia" value={data.recomendacion_custodia || 'N/A'} />
            </div>
            {data.fecha_simulacion && (
              <DataField 
                label="Fecha de Simulación" 
                value={new Date(data.fecha_simulacion).toLocaleString('es-ES')} 
              />
            )}
          </div>
        )}
      </div>

      {/* Basic Data */}
      <div>
        <SectionHeader title="Datos Básicos" section="basicos" />
        {sectionsOpen.basicos && (
          <div className="p-4 space-y-4 bg-white dark:bg-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <DataField label="Monto Solicitado" value={formatCurrency(data.montoSolicitado)} />
              <DataField label="Recursos Demandado Estimados" value={formatCurrency(data.recursosDemandadoEstimados)} />
              {data.notasAdicionales && (
                <div className="md:col-span-3">
                  <DataField label="Notas Adicionales" value={data.notasAdicionales} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Minor Data */}
      <div>
        <SectionHeader title="Atributos del Menor" section="menor" />
        {sectionsOpen.menor && (
          <div className="p-4 space-y-4 bg-white dark:bg-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataField label="Edad del Menor" value={data.edad_del_menor} />
              <DataField label="Preferencia del Menor" value={data.preferencia_del_menor} />
              <DataField label="Expresa Preferencia Válida" value={formatBoolean(data.expresa_preferencia_valida)} />
              <DataField label="Tiene Madurez Suficiente" value={formatBoolean(data.tiene_madurez_suficiente)} />
              <DataField label="Tiene Necesidades Especiales" value={formatBoolean(data.menor_tiene_necesidades_especiales)} />
            </div>
          </div>
        )}
      </div>

      {/* Environment */}
      <div>
        <SectionHeader title="Guarda y Ambiente" section="ambiente" />
        {sectionsOpen.ambiente && (
          <div className="p-4 space-y-4 bg-white dark:bg-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataField label="Custodia Previa" value={data.custodia_previa} />
              <DataField label="Condiciones de Vivienda" value={data.condiciones_de_la_vivienda} />
              <DataField label="Distancia Entre Domicilios" value={`${data.distancia_entre_domicilios} km`} />
              <DataField label="Presencia Escolar" value={data.presencia_escolar} />
              <DataField label="Ambos Padres con Condiciones Adecuadas" value={formatBoolean(data.ambos_padres_tienen_condiciones_adecuadas)} />
            </div>
          </div>
        )}
      </div>

      {/* Mother Data */}
      <div>
        <SectionHeader title="Datos de la Madre" section="madre" />
        {sectionsOpen.madre && (
          <div className="p-4 space-y-4 bg-white dark:bg-slate-900 border-l-4 border-pink-400">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.nombre_madre && <DataField label="Nombre Completo" value={data.nombre_madre} />}
              <DataField label="Idoneidad Moral" value={data.idoneidad_moral_madre} />
              <DataField label="Estado Emocional" value={data.estado_emocional_madre} />
              <DataField label="Demuestra Estabilidad Emocional" value={formatBoolean(data.madre_demuestra_estabilidad_emocional)} />
              <DataField label="Antecedentes de Violencia" value={formatBoolean(data.madre_tiene_antecedentes_de_violencia)} />
              <DataField label="Evidencia Negligencia Severa" value={formatBoolean(data.madre_evidencia_negligencia_severa)} />
              <DataField label="Conducta Agresiva Anterior" value={formatBoolean(data.madre_conducta_agresiva_anterior)} />
              <DataField label="Reportes Psicosociales Negativos" value={formatBoolean(data.madre_reportes_psicosociales_negativos)} />
              <DataField label="Disponibilidad de Tiempo" value={data.disponibilidad_de_tiempo_madre} />
              <DataField label="Estado de Salud" value={data.estado_de_salud_madre} />
              <DataField label="Maneja Necesidades Especiales" value={formatBoolean(data.madre_maneja_necesidades_especiales)} />
              <DataField label="Nivel de Ingresos Mensual" value={formatCurrency(data.nivel_de_ingresos_madre)} />
              <DataField label="Estabilidad Laboral" value={data.estabilidad_laboral_madre} />
              <DataField label="Tiene Ingresos Comprobados" value={formatBoolean(data.madre_tiene_ingresos_comprobados)} />
              <DataField label="Sin Ingresos Formales" value={formatBoolean(data.madre_sin_ingresos_formales)} />
              <DataField label="Cargas Familiares Adicionales" value={formatBoolean(data.madre_cargas_familiares_adicionales)} />
              <DataField label="Incumple Pensión" value={formatBoolean(data.madre_incumple_pension)} />
            </div>
          </div>
        )}
      </div>

      {/* Father Data */}
      <div>
        <SectionHeader title="Datos del Padre" section="padre" />
        {sectionsOpen.padre && (
          <div className="p-4 space-y-4 bg-white dark:bg-slate-900 border-l-4 border-blue-400">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.nombre_padre && <DataField label="Nombre Completo" value={data.nombre_padre} />}
              <DataField label="Idoneidad Moral" value={data.idoneidad_moral_padre} />
              <DataField label="Estado Emocional" value={data.estado_emocional_padre} />
              <DataField label="Demuestra Estabilidad Emocional" value={formatBoolean(data.padre_demuestra_estabilidad_emocional)} />
              <DataField label="Antecedentes de Violencia" value={formatBoolean(data.padre_tiene_antecedentes_de_violencia)} />
              <DataField label="Evidencia Negligencia Severa" value={formatBoolean(data.padre_evidencia_negligencia_severa)} />
              <DataField label="Conducta Agresiva Anterior" value={formatBoolean(data.padre_conducta_agresiva_anterior)} />
              <DataField label="Reportes Psicosociales Negativos" value={formatBoolean(data.padre_reportes_psicosociales_negativos)} />
              <DataField label="Disponibilidad de Tiempo" value={data.disponibilidad_de_tiempo_padre} />
              <DataField label="Estado de Salud" value={data.estado_de_salud_padre} />
              <DataField label="Maneja Necesidades Especiales" value={formatBoolean(data.padre_maneja_necesidades_especiales)} />
              <DataField label="Nivel de Ingresos Mensual" value={formatCurrency(data.nivel_de_ingresos_padre)} />
              <DataField label="Estabilidad Laboral" value={data.estabilidad_laboral_padre} />
              <DataField label="Tiene Ingresos Comprobados" value={formatBoolean(data.padre_tiene_ingresos_comprobados)} />
              <DataField label="Sin Ingresos Formales" value={formatBoolean(data.padre_sin_ingresos_formales)} />
              <DataField label="Cargas Familiares Adicionales" value={formatBoolean(data.padre_cargas_familiares_adicionales)} />
              <DataField label="Incumple Pensión" value={formatBoolean(data.padre_incumple_pension)} />
            </div>
            <div>
              <DataField label="Cumplimiento de Obligaciones Previas (General)" value={data.cumplimiento_de_las_obligaciones_previas} />
            </div>
          </div>
        )}
      </div>

      {/* Procedural */}
      <div>
        <SectionHeader title="Atributos Procesales" section="procesales" />
        {sectionsOpen.procesales && (
          <div className="p-4 space-y-4 bg-white dark:bg-slate-900">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DataField label="Documentos Presentados Válidos" value={formatBoolean(data.documentos_presentados_validos)} />
              <DataField label="Notificación Correcta" value={formatBoolean(data.notificacion_correcta_verdadera)} />
              <DataField label="Parte No Comparece Sin Justificación" value={formatBoolean(data.parte_no_comparece_sin_justificacion)} />
              <DataField label="Testigo Relevante Válido" value={formatBoolean(data.testigo_relevante_valido)} />
              <DataField label="Prueba Psicosocial Disponible" value={formatBoolean(data.prueba_psicosocial_disponible)} />
              <DataField label="Conciliación Entre las Partes" value={formatBoolean(data.hay_conciliacion_entre_las_partes)} />
              <DataField label="Evidencia Contradice Testimonio" value={formatBoolean(data.evidencia_contradice_testimonio)} />
              <DataField label="Pruebas Insuficientes" value={formatBoolean(data.pruebas_son_insuficientes)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
