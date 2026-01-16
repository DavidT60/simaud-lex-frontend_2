import { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { courseAPI, procesoJudicialAPI } from "@/lib/api";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth.context";



export const StudentCasesPage = () => {
    const { studentId } = useParams();
    const { user } = useAuth();
    const location = useLocation();
    const [cases, setCases] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCase, setSelectedCase] = useState<any>(null);
    const [grade, setGrade] = useState("");
    const [details, setDetails] = useState("");
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

    const fetchCases = async () => {
        try {
            setLoading(true);
            const data = await courseAPI.getStudentCases(studentId!);
            setCases(data);
        } catch (error) {
            console.error("Error fetching student cases:", error);
            toast.error("Error al cargar casos del estudiante");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (studentId) fetchCases();
    }, [studentId]);

    const handleOpenGradeModal = (caso: any) => {
        setSelectedCase(caso);
        setGrade(caso.calificacion || "");
        setDetails(caso.detallesCalificacion || "");
        setIsGradeModalOpen(true);
    };

    const handleGradeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await procesoJudicialAPI.gradeCase(selectedCase.id, Number(grade), details);
            toast.success("Calificación actualizada");
            setIsGradeModalOpen(false);
            fetchCases(); // Refresh list to show new grade
        } catch (error: any) {
            console.error("Error grading case:", error);
            // Try different ways to access the error message
            const apiError = error?.response?.data?.message || error.message || "Error al guardar la calificación";
            toast.error(typeof apiError === 'string' ? apiError : JSON.stringify(apiError));
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                 <Link to="/cursos" className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Volver a Cursos
                </Link>
                
                <div className="flex items-center justify-between">
                    <div>
                         <h1 className="text-3xl font-bold text-primary-900 dark:text-white">Casos del Estudiante</h1>
                         <p className="text-gray-600 dark:text-gray-300 mt-2">Revisión y calificación de procesos</p>
                    </div>
                </div>

                <div className="grid gap-6">
                    {loading ? (
                        <p>Cargando casos...</p>
                    ) : cases.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">Este estudiante no tiene casos registrados.</p>
                    ) : (
                        cases.map(caso => (
                            <Card key={caso.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold mb-1">Caso #{caso.id_caso_dinamico}</h3>
                                            <p className="text-sm text-gray-500 mb-2">Estado: {caso.estado}</p>
                                            <p className="text-sm text-gray-600">Tipo: {caso.tipo_demanda}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold mb-2">Calificación</p>
                                            <div className="text-2xl font-bold text-primary-600">
                                                {caso.calificacion !== null ? caso.calificacion : "-"} / 100
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 flex justify-end gap-3 border-t pt-4">
                                        <Link 
                                            to={`/casos/${caso.id}`}
                                            state={{ from: location.pathname }}
                                        >
                                            <Button variant="outline" size="sm">
                                                <FileText className="w-4 h-4 mr-2" /> Ver Detalles
                                            </Button>
                                        </Link>
                                        {(user?.role === 'Admin' || user?.role === 'Profesor') && (
                                            caso.estado === 'SENTENCIA' ? (
                                                caso.is_calificacion ? (
                                                     <Button size="sm" variant="ghost" disabled title="Este caso ya ha sido calificado">
                                                        <span className="text-green-600 font-semibold opacity-70">Calificado</span>
                                                    </Button>
                                                ) : (
                                                    <Button onClick={() => handleOpenGradeModal(caso)} size="sm">
                                                        Calificar
                                                    </Button>
                                                )
                                            ) : (
                                                <Button size="sm" variant="ghost" disabled title="Solo se pueden calificar casos con sentencia">
                                                    <span className="opacity-50">Calificar</span>
                                                </Button>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                <Modal
                    isOpen={isGradeModalOpen}
                    onClose={() => setIsGradeModalOpen(false)}
                    title={`Calificar Caso ${selectedCase?.id_caso_dinamico}`}
                >
                    <form onSubmit={handleGradeSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nota (0-100)</label>
                            <Input 
                                type="number"
                                min="0"
                                max="100"
                                value={grade}
                                onChange={e => setGrade(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Detalles de la Calificación</label>
                            <textarea 
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Ingrese comentarios y detalles sobre la evaluación..."
                                value={details}
                                onChange={e => setDetails(e.target.value)}
                                rows={5}
                            />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button type="button" variant="ghost" onClick={() => setIsGradeModalOpen(false)}>Cancelar</Button>
                            <Button type="submit">Guardar Nota</Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </Layout>
    );
};
