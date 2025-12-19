import React, { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { procesoJudicialAPI } from "@/lib/api";
import { Gavel } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface CaseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseId: string | null;
}

export const CaseDetailsModal: React.FC<CaseDetailsModalProps> = ({
  isOpen,
  onClose,
  caseId,
}) => {
  const [caseData, setCaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (caseId && isOpen) {
        setLoading(true);
        try {
          const data = await procesoJudicialAPI.getOne(caseId);
          setCaseData(data);
        } catch (error) {
          console.error("Error fetching case details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDetails();
  }, [caseId, isOpen]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Caso">
      {loading ? (
        <div className="p-8 text-center text-gray-500">
          Cargando información...
        </div>
      ) : caseData ? (
        <div className="space-y-6">
          {/* Header Info */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">Tipo de Demanda</p>
                <p className="text-lg font-semibold text-primary-900">
                  {caseData.tipo_demanda}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Estado Actual</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                  {caseData.estado}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Fecha de Inicio</p>
                <p className="text-gray-900">
                  {new Date(caseData.fecha_inicio).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* NNA Info */}
          <div className="space-y-3">
            <h3 className="text-md font-semibold text-gray-900 border-b pb-2">
              Información del NNA
            </h3>
            {caseData.nna ? (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Nombre Completo</p>
                  <p className="font-medium">{caseData.nna.nombre_completo}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fecha de Nacimiento</p>
                  <p className="font-medium">
                    {new Date(caseData.nna.fecha_nacimiento).toLocaleDateString()}
                  </p>
                </div>
                {caseData.nna.opinion_nna && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Opinión del NNA</p>
                    <p className="italic text-gray-700">"{caseData.nna.opinion_nna}"</p>
                  </div>
                )}
                {caseData.nna.necesidades_especiales && caseData.nna.necesidades_especiales.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-gray-500">Necesidades Especiales</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {caseData.nna.necesidades_especiales.map((tag: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">No hay información del NNA asociada.</p>
            )}
          </div>

            {/* Sentencia Generada */}
            {caseData.sentencia ? (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 shadow-sm mt-4">
                <h3 className="font-serif font-semibold text-slate-900 mb-2 flex items-center gap-2 text-md border-b border-slate-200 pb-2">
                    <Gavel className="w-4 h-4 text-slate-700" />
                    Fallo de Sentencia (Generado por IA)
                </h3>
                <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed font-serif">
                    <ReactMarkdown>{caseData.sentencia.fallo}</ReactMarkdown>
                </div>
              </div>
            ) : caseData.estado === 'SENTENCIA' ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 shadow-sm mt-4">
                    <p className="text-yellow-800 font-medium flex items-center gap-2 text-sm">
                       <Gavel className="w-4 h-4" />
                       Documento de sentencia no encontrado.
                    </p>
                </div>
            ) : null}

          {/* Parties Info - Placeholder if API doesn't return relations yet */}
          {/* Assuming 'partes' might be in the response based on entity definition */}
          {caseData.partes && caseData.partes.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-md font-semibold text-gray-900 border-b pb-2">
                Partes Involucradas
              </h3>
              <div className="space-y-3">
                {caseData.partes.map((parte: any, index: number) => (
                  <div key={index} className="flex justify-between items-center bg-white p-3 border rounded-md shadow-sm">
                    <div>
                      <p className="font-medium text-gray-900">{parte.person?.nombre_completo || "Desconocido"}</p>
                      <p className="text-xs text-gray-500">{parte.rol}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center text-red-500">
          No se pudo cargar la información del caso.
        </div>
      )}
    </Modal>
  );
};
