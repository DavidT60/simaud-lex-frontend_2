import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Plus, User, FileText, ArrowLeft, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { courseAPI, userAPI } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth.context";

export const CourseDetailPage = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
    const [studentEmail, setStudentEmail] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const fetchCourse = async () => {
        try {
            setLoading(true);
            const data = await courseAPI.getOne(id!);
            setCourse(data);
        } catch (error) {
            console.error("Error fetching course:", error);
            toast.error("Error al cargar el curso");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchCourse();
    }, [id]);

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await courseAPI.addStudent(id!, studentEmail);
            toast.success("Estudiante agregado exitosamente");
            setStudentEmail("");
            setIsAddStudentOpen(false);
            fetchCourse();
        } catch (error: any) {
             console.error("Error adding student:", error);
             toast.error(error.response?.data?.message || "Error al agregar estudiante");
        }
    };

    if (loading) return <Layout><div>Cargando...</div></Layout>;
    if (!course) return <Layout><div>Curso no encontrado</div></Layout>;

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                     <Link to="/cursos" className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4">
                        <ArrowLeft className="w-4 h-4 mr-1" /> Volver a Mis Cursos
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                             <h1 className="text-3xl font-bold text-primary-900 dark:text-white">{course.name}</h1>
                             <p className="text-gray-600 dark:text-gray-300 mt-2">{course.description}</p>
                        </div>
                         {(user?.role === 'Admin' || user?.role === 'Profesor') && (
                            <Button onClick={() => setIsAddStudentOpen(true)} className="flex items-center gap-2">
                                <Plus className="w-4 h-4" /> Agregar Estudiante
                            </Button>
                        )}
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <User className="w-5 h-5 text-primary-600" />
                            Estudiantes Inscritos ({course.students?.length || 0})
                        </h2>
                    </CardHeader>
                    <CardContent>
                         <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                                    {course.students?.map((student: any) => (
                                        <tr key={student.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                 <div className="flex items-center gap-3">
                                                    <Link 
                                                        to={`/cursos/student/${student.id}/cases`}
                                                        className="text-primary-600 hover:text-primary-900 flex items-center gap-1"
                                                    >
                                                        <FileText className="w-4 h-4" /> Ver Casos
                                                    </Link>
                                                    {(user?.role === 'Admin' || user?.role === 'Profesor') && (
                                                        <Button 
                                                            variant="ghost" 
                                                            size="sm" 
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                            onClick={async () => {
                                                                if (confirm(`¿Estás seguro de que deseas eliminar a ${student.name} del curso?`)) {
                                                                    try {
                                                                        await courseAPI.removeStudent(id!, String(student.id));
                                                                        toast.success("Estudiante eliminado del curso");
                                                                        fetchCourse();
                                                                    } catch (error) {
                                                                        console.error("Error removing student:", error);
                                                                        toast.error("Error al eliminar estudiante");
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                 </div>
                                            </td>
                                        </tr>
                                    ))}
                                     {course.students?.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No hay estudiantes inscritos</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                 <Modal
                    isOpen={isAddStudentOpen}
                    onClose={() => setIsAddStudentOpen(false)}
                    title="Agregar Estudiante al Curso"
                >
                    <form onSubmit={handleAddStudent} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Buscar Estudiante</label>
                            <Input 
                                value={studentEmail}
                                onChange={async (e) => {
                                    const query = e.target.value;
                                    setStudentEmail(query);
                                    
                                    if (query.length > 2) {
                                        try {
                                            const results = await userAPI.searchStudents(query);
                                            setSearchResults(results);
                                        } catch (error) {
                                            console.error('Error searching students:', error);
                                        }
                                    } else {
                                        setSearchResults([]);
                                    }
                                }}
                                placeholder="Buscar por email..."
                                type="text"
                            />
                            
                            {searchResults.length > 0 && (
                                <div className="mt-2 border rounded-md max-h-48 overflow-y-auto">
                                    {searchResults.map((student: any) => (
                                        <div 
                                            key={student.id}
                                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer border-b last:border-b-0"
                                            onClick={() => {
                                                setStudentEmail(student.email);
                                                setSearchResults([]);
                                            }}
                                        >
                                            <p className="font-medium text-sm">{student.name || 'Sin nombre'}</p>
                                            <p className="text-xs text-gray-500">{student.email}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            
                            <p className="text-xs text-gray-500 mt-1">Busca y selecciona un estudiante registrado.</p>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <Button type="button" variant="ghost" onClick={() => {
                                setIsAddStudentOpen(false);
                                setSearchResults([]);
                            }}>Cancelar</Button>
                            <Button type="submit">Agregar</Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </Layout>
    );
};
