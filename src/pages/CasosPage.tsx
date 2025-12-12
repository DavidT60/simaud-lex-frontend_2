import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { NewCaseForm } from "@/components/forms/NewCaseForm";
import { CaseDetailsModal } from "@/components/modals/CaseDetailsModal";
import { procesoJudicialAPI } from "@/lib/api";

export const CasosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [casos, setCasos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Details Modal State
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const fetchCasos = async () => {
    try {
      setLoading(true);
      const data = await procesoJudicialAPI.getAll();
      setCasos(data);
    } catch (error) {
      console.error("Error fetching cases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCasos();
  }, []);

  const getEstadoBadge = (estado: string) => {
    const colors = {
      EN_PROCESO: "bg-yellow-100 text-yellow-800",
      SENTENCIA: "bg-green-100 text-green-800",
      CONCILIACION: "bg-blue-100 text-blue-800",
    };
    return colors[estado as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    fetchCasos();
  };

  const handleViewDetails = (id: string) => {
    setSelectedCaseId(id);
    setIsDetailsOpen(true);
  };

  const filteredCasos = casos.filter((caso) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      caso.id_caso_dinamico?.toLowerCase().includes(searchLower) ||
      caso.nna?.nombre_completo?.toLowerCase().includes(searchLower) ||
      caso.tipo_demanda?.toLowerCase().includes(searchLower) ||
      caso.estado?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-900 dark:text-white">Casos</h1>
            <p className="text-primary-600 dark:text-gray-400 mt-2">
              Gestión de procesos judiciales
            </p>
          </div>

          <Button 
            variant="accent" 
            className="flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Nuevo Caso
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 dark:text-gray-500 w-4 h-4" />
                <Input
                  placeholder="Buscar por ID Caso, NNA, tipo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-primary-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-primary-700 dark:text-gray-300">
                      ID Caso
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-primary-700 dark:text-gray-300">
                      NNA
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-primary-700 dark:text-gray-300">
                      Tipo
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-primary-700 dark:text-gray-300">
                      Estado
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-primary-700 dark:text-gray-300">
                      Fecha Inicio
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-primary-700 dark:text-gray-300">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Cargando casos...
                      </td>
                    </tr>
                  ) : filteredCasos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No se encontraron casos
                      </td>
                    </tr>
                  ) : (
                    filteredCasos.map((caso) => (
                      <tr
                        key={caso.id}
                        className="border-b border-primary-100 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-sm font-medium text-primary-900 dark:text-white">
                          {caso.id_caso_dinamico || 'N/A'}
                        </td>
                        <td className="py-3 px-4 font-medium text-primary-900 dark:text-gray-200">
                          {caso.nna?.nombre_completo || "Sin NNA"}
                        </td>
                        <td className="py-3 px-4 text-primary-700 dark:text-gray-300">
                          {caso.tipo_demanda}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadge(
                              caso.estado
                            )}`}
                          >
                            {caso.estado}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-primary-700 dark:text-gray-300">
                          {new Date(caso.fecha_inicio).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewDetails(caso.id)}
                            >
                              Ver Detalles
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => window.open(`/casos/${caso.id}`, '_blank')}
                            >
                              Ver Caso Completo
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Crear Nuevo Caso"
          className="max-w-4xl"
        >
          <NewCaseForm
            onSuccess={handleSuccess}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>

        <CaseDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => setIsDetailsOpen(false)}
          caseId={selectedCaseId}
        />
      </div>
    </Layout>
  );
};
