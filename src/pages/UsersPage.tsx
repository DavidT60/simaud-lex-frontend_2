import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Search, UserCog } from "lucide-react";
import { Input } from "@/components/ui/input";
import { userAPI, api } from "@/lib/api";
import { toast } from "sonner";

export const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userAPI.getAll();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await userAPI.updateRole(userId, newRole);
      toast.success("Rol actualizado exitosamente");
      // Update local state to reflect change immediately without refetch
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
       console.error("Error updating role:", error);
       toast.error("Error al actualizar el rol");
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.role?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-900 dark:text-white">Usuarios</h1>
            <p className="text-primary-600 dark:text-gray-400 mt-2">
              Gestión de roles y usuarios del sistema
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 dark:text-gray-500 w-4 h-4" />
                <Input
                  placeholder="Buscar por Nombre, Email, Rol..."
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
                      ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-primary-700 dark:text-gray-300">
                      Nombre
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-primary-700 dark:text-gray-300">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-primary-700 dark:text-gray-300">
                      Rol
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        Cargando usuarios...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No se encontraron usuarios
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b border-primary-100 dark:border-gray-700 hover:bg-primary-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-sm font-medium text-primary-900 dark:text-white">
                          #{user.id}
                        </td>
                        <td className="py-3 px-4 font-medium text-primary-900 dark:text-gray-200">
                          {user.name || "Sin Nombre"}
                        </td>
                         <td className="py-3 px-4 text-primary-700 dark:text-gray-300">
                          {user.email}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            value={user.role || "Estudiante"}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          >
                            <option value="Admin">Admin</option>
                            <option value="Profesor">Profesor</option>
                            <option value="Estudiante">Estudiante</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
