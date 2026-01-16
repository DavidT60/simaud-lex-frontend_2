import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Plus, BookOpen, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { courseAPI } from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth.context";

export const CoursesPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", description: "" });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await courseAPI.getAll();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Error al cargar cursos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await courseAPI.create(newCourse);
      toast.success("Curso creado exitosamente");
      setIsModalOpen(false);
      setNewCourse({ name: "", description: "" });
      fetchCourses();
    } catch (error) {
       console.error("Error creating course:", error);
       toast.error("Error al crear el curso");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-900 dark:text-white">Mis Cursos</h1>
            <p className="text-primary-600 dark:text-gray-400 mt-2">
              Gestión de cursos y estudiantes
            </p>
          </div>

          <Button 
            variant="accent"
            className="flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Crear Curso
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
                <p>Cargando cursos...</p>
            ) : courses.length === 0 ? (
                <p className="col-span-3 text-center text-gray-500">No tienes cursos registrados.</p>
            ) : (
                courses.map(course => {
                    const colors = [
                        "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
                        "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
                        "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
                        "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
                        "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
                        "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
                        "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800",
                        "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
                    ];
                    const getColorIndex = (id: string | number) => {
                        if (typeof id === 'number') return id % colors.length;
                        const str = String(id);
                        let hash = 0;
                        for (let i = 0; i < str.length; i++) {
                            hash = str.charCodeAt(i) + ((hash << 5) - hash);
                        }
                        return Math.abs(hash % colors.length);
                    };
                    
                    const courseColor = colors[getColorIndex(course.id)];
                    const [bgClass, textClass, borderClass] = courseColor.split(' ').filter(c => c.startsWith('bg-') || c.startsWith('text-') || c.startsWith('border-')); 
                    // Simple split won't work perfectly for complex classes, but we can use the full string for the badge
                    
                    return (
                    <Link key={course.id} to={`/cursos/${course.id}`} className="block group">
                        <Card className={`h-full hover:shadow-lg transition-all cursor-pointer border-2 hover:-translate-y-1 ${courseColor.split(' ').filter(c => c.includes('border')).join(' ')}`}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className={`p-3 rounded-xl ${courseColor}`}>
                                        <BookOpen className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                         <div className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${courseColor}`}>
                                            ID: {course.identificatorId}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Users className="w-4 h-4" />
                                            <span>{course.students?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mt-4 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{course.name}</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 h-[4.5rem]">
                                    {course.description}
                                </p>
                                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-sm">
                                    <span className="text-gray-500 font-medium flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${courseColor.split(' ').filter(c => c.startsWith('bg-'))[0]}`}></div>
                                        Prof: {course.professor?.name || 'N/A'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )})
            )}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Crear Nuevo Curso"
        >
          <form onSubmit={handleCreateCourse} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Nombre del Curso</label>
                <Input 
                    value={newCourse.name}
                    onChange={e => setNewCourse({ ...newCourse, name: e.target.value })}
                    required
                    placeholder="Ej. Derecho Civil II"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea 
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={newCourse.description}
                    onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                    required
                    placeholder="Descripción del curso..."
                />
            </div>
            <div className="flex justify-end gap-3 mt-6">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button type="submit">Crear Curso</Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};
