import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ArrowLeft, Gavel, Share2, User } from "lucide-react";
import { procesoJudicialAPI } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import { ShareCaseModal } from "@/components/modals/ShareCaseModal";
import { HechosSimulacionReadOnly } from "@/components/HechosSimulacionReadOnly";
import { SimilarCasesList } from "@/components/simulation/SimilarCasesList";

export const CaseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [simulationData, setSimulationData] = useState<any>(null);
  const [loadingSimulation, setLoadingSimulation] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (id) {
        setLoading(true);
        try {
          const data = await procesoJudicialAPI.getOne(id);
          setCaseData(data);
        } catch (error) {
          console.error("Error fetching case details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDetails();
  }, [id]);

  // Fetch simulation data if case has a sentence
  useEffect(() => {
    const fetchSimulationData = async () => {
      if (caseData?.sentencia && id) {
        setLoadingSimulation(true);
        try {
          const historial = await procesoJudicialAPI.getHistorialSimulaciones(
            id
          );
          if (historial && historial.length > 0) {
            // Get the most recent simulation
            setSimulationData(historial[0]);
          }
        } catch (error) {
          console.error("Error fetching simulation data:", error);
        } finally {
          setLoadingSimulation(false);
        }
      }
    };
    fetchSimulationData();
  }, [caseData, id]);

  // Transformar datos del backend al formato del componente
  const similarCasesMapped =
    simulationData?.casosSimilares?.map((s: any) => ({
      casoId: s.casoSimilar?.id,
      procesoId: s.casoSimilar?.proceso?.id,
      numeroCaso: s.casoSimilar?.proceso?.id_caso_dinamico || "N/A",
      tipoDemanda: s.casoSimilar?.proceso?.tipo_demanda || "N/A",
      scoreSimulitud: s.scoreSimulitud,
      puntuacionMadre: s.puntuacionMadreSimilar,
      puntuacionPadre: s.puntuacionPadreSimilar,
      recomendacion: s.recomendacionSimilar,
      fechaSimulacion: s.fechaComparacion, // Ojo: usar fechaComparacion o fecha_simulacion del similar? Usaremos lo disponible
      camposCoincidentes: s.camposCoincidentes,
    })) || [];

  const getEstadoBadge = (estado: string) => {
    const colors = {
      EN_PROCESO: "bg-yellow-100 text-yellow-800",
      SENTENCIA: "bg-green-100 text-green-800",
      CONCILIACION: "bg-blue-100 text-blue-800",
    };
    return colors[estado as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
               if (location.state?.from) {
                  navigate(location.state.from);
               } else {
                  navigate("/casos");
               }
            }}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {location.state?.from ? "Volver" : "Volver a Casos"}
          </Button>
        </div>

        {loading ? (
          <Card>
            <CardContent className="p-8 text-center text-gray-500">
              Cargando información del caso...
            </CardContent>
          </Card>
        ) : caseData ? (
          <div className="space-y-6">
            {/* Case Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-primary-900 dark:text-white">
                  Detalles del Caso
                </h1>
                {caseData.id_caso_dinamico && (
                  <span className="px-4 py-2 bg-primary-100 text-primary-900 rounded-lg font-mono text-lg font-semibold">
                    {caseData.id_caso_dinamico}
                  </span>
                )}
              </div>
              <p className="text-primary-600 dark:text-gray-400 mt-2">
                Vista completa del proceso judicial
              </p>
            </div>

            {/* Grading Info Section */}
            {caseData.is_calificacion && (
              <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b border-green-200 dark:border-green-800 pb-4">
                    <div>
                         <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                        <Gavel className="w-5 h-5" />
                        Calificación del Caso
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300">Este caso ha sido evaluado por un profesor.</p>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                         <div className="flex items-baseline gap-1 justify-end">
                          <span className="text-4xl font-bold text-green-700 dark:text-green-400">
                            {caseData.calificacion}
                          </span>
                          <span className="text-sm text-green-600 dark:text-green-500 font-medium">/ 100</span>
                        </div>
                         {caseData.calificadoPor && (
                          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                              <span className="font-semibold">Evaluado por:</span> {caseData.calificadoPor.name}
                          </div>
                       )}
                      </div>
                    </div>
                  </div>
                  
                  {caseData.detallesCalificacion && (
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-green-100 dark:border-green-900/30">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-200 mb-2">
                        Comentarios y Detalles de la Evaluación
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                        {caseData.detallesCalificacion}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Main Case Information */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-primary-900 dark:text-white">
                  Información General
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      Tipo de Demanda
                    </p>
                    <p className="text-lg font-semibold text-primary-900 dark:text-white">
                      {caseData.tipo_demanda}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      Estado Actual
                    </p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getEstadoBadge(
                        caseData.estado
                      )}`}
                    >
                      {caseData.estado}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium mb-1">
                      Fecha de Inicio
                    </p>
                    <p className="text-lg text-gray-900">
                      {new Date(caseData.fecha_inicio).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NNA Information */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-primary-900">
                  Información del NNA
                </h2>
              </CardHeader>
              <CardContent>
                {caseData.nna ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">
                          Nombre Completo
                        </p>
                        <p className="text-lg font-medium text-gray-900 dark:text-gray-200">
                          {caseData.nna.nombre_completo}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">
                          Fecha de Nacimiento
                        </p>
                        <p className="text-lg text-gray-900 dark:text-gray-200">
                          {new Date(
                            caseData.nna.fecha_nacimiento
                          ).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    {caseData.nna.opinion_nna && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                        <p className="text-sm text-gray-500 font-medium mb-2">
                          Opinión del NNA
                        </p>
                        <p className="italic text-gray-700 dark:text-gray-300">
                          "{caseData.nna.opinion_nna}"
                        </p>
                      </div>
                    )}

                    {caseData.nna.necesidades_especiales &&
                      caseData.nna.necesidades_especiales.length > 0 && (
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-2">
                            Necesidades Especiales
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {caseData.nna.necesidades_especiales.map(
                              (tag: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium"
                                >
                                  {tag}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 italic">
                    No hay información del NNA asociada.
                  </p>
                )}
              </CardContent>
            </Card>

            {caseData.sentencia ? (
              <Card className="border-2 border-primary-200 bg-slate-50 dark:bg-slate-800 dark:border-primary-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-primary-900 dark:text-white flex items-center gap-2">
                      <Gavel className="w-6 h-6" />
                      Fallo de Sentencia (Generado por IA)
                    </h2>
                    <Button
                      onClick={() => setShareModalOpen(true)}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Compartir Caso
                    </Button>
                  </div>
                  {/* Creator Info */}
                  {(caseData.sentencia.created_by_name ||
                    caseData.sentencia.created_by_email) && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4" />
                        <span>
                          Creado por:{" "}
                          <span className="font-medium text-gray-900 dark:text-gray-200">
                            {caseData.sentencia.created_by_name || "Sistema"}
                          </span>
                          {caseData.sentencia.created_by_email && (
                            <span className="ml-2">
                              ({caseData.sentencia.created_by_email})
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-slate-700 dark:text-slate-300 leading-relaxed font-serif p-4 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700">
                    <ReactMarkdown>{caseData.sentencia.fallo}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            ) : caseData.estado === "SENTENCIA" ? (
              <Card className="border-2 border-yellow-200 bg-yellow-50">
                <CardContent className="p-6">
                  <p className="text-yellow-800 font-medium flex items-center gap-2">
                    <Gavel className="w-5 h-5" />
                    El caso está marcado como SENTENCIA, pero no se encontró el
                    documento de fallo asociado.
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Esto puede ocurrir si la simulación no se guardó
                    correctamente. Intente generar la simulación nuevamente.
                  </p>
                </CardContent>
              </Card>
            ) : null}

            {/* Simulation Data Section */}
            {simulationData && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-primary-900 dark:text-white">
                    Datos de la Simulación
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Información detallada utilizada para generar la sentencia
                  </p>
                </CardHeader>
                <CardContent>
                  {loadingSimulation ? (
                    <div className="text-center text-gray-500 py-4">
                      Cargando datos de simulación...
                    </div>
                  ) : (
                    <>
                      <HechosSimulacionReadOnly data={simulationData} />
                      <div className="mt-8 border-t pt-8">
                        <SimilarCasesList casos={similarCasesMapped} />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Parties Involved */}
            {caseData.partes && caseData.partes.length > 0 && (
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-semibold text-primary-900">
                    Partes Involucradas
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {caseData.partes.map((parte: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600/50 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100 text-lg">
                            {parte.person?.nombre_completo || "Desconocido"}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Rol: {parte.rol}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center text-red-500">
              No se pudo cargar la información del caso.
            </CardContent>
          </Card>
        )}
      </div>

      {/* Share Case Modal */}
      {id && (
        <ShareCaseModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          caseId={id}
          caseNumber={caseData?.id_caso_dinamico}
        />
      )}
    </Layout>
  );
};
