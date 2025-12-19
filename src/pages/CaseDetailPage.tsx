import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ArrowLeft, Gavel } from "lucide-react";
import { procesoJudicialAPI } from "@/lib/api";
import ReactMarkdown from 'react-markdown';

export const CaseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
            onClick={() => navigate("/casos")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Casos
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
              <Card className="border-2 border-primary-200 bg-slate-50">
                <CardHeader>
                  <h2 className="text-xl font-semibold text-primary-900 flex items-center gap-2">
                    <Gavel className="w-6 h-6" />
                    Fallo de Sentencia (Generado por IA)
                  </h2>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed font-serif p-4 bg-white rounded-lg border border-gray-200">
                    <ReactMarkdown>{caseData.sentencia.fallo}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            ) : caseData.estado === 'SENTENCIA' ? (
              <Card className="border-2 border-yellow-200 bg-yellow-50">
                 <CardContent className="p-6">
                    <p className="text-yellow-800 font-medium flex items-center gap-2">
                       <Gavel className="w-5 h-5" />
                       El caso está marcado como SENTENCIA, pero no se encontró el documento de fallo asociado.
                    </p>
                    <p className="text-sm text-yellow-700 mt-1">
                       Esto puede ocurrir si la simulación no se guardó correctamente. Intente generar la simulación nuevamente.
                    </p>
                 </CardContent>
              </Card>
            ) : null}
            
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
    </Layout>
  );
};
