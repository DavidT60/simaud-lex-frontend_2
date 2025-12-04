import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { FolderOpen, Users, FileText, TrendingUp } from 'lucide-react';
import { procesoJudicialAPI, nnaAPI } from '@/lib/api';

export const DashboardPage = () => {
  const [stats, setStats] = useState([
    { title: 'Total Casos', value: '...', icon: FolderOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Casos Activos', value: '...', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'NNA Registrados', value: '...', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Documentos', value: '0', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]);

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cases, nnas] = await Promise.all([
          procesoJudicialAPI.getAll(),
          nnaAPI.getAll(),
        ]);

        // Calculate Metrics
        const totalCasos = cases.length;
        const activeCasos = cases.filter((c: any) => c.estado === 'EN_PROCESO').length;
        const totalNnas = nnas.length;

        setStats([
          { title: 'Total Casos', value: totalCasos.toString(), icon: FolderOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Casos Activos', value: activeCasos.toString(), icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
          { title: 'NNA Registrados', value: totalNnas.toString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { title: 'Documentos', value: '0', icon: FileText, color: 'text-orange-600', bg: 'bg-orange-50' },
        ]);

        // Derive Recent Activity from Cases
        // Sort by date desc (assuming fecha_inicio is relevant, or ideally created_at if available)
        // Since we only have fecha_inicio in the basic DTO, we'll use that.
        const sortedCases = [...cases].sort((a: any, b: any) => 
          new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime()
        ).slice(0, 5);

        const activity = sortedCases.map((c: any) => ({
          id: c.id,
          action: 'Nuevo caso registrado',
          case: `Caso de ${c.nna?.nombre_completo || 'NNA desconocido'}`,
          time: new Date(c.fecha_inicio).toLocaleDateString(),
        }));

        setRecentActivity(activity);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary-900">Dashboard</h1>
          <p className="text-primary-600 mt-2">Resumen general del sistema</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-primary-600">{stat.title}</p>
                      <p className="text-3xl font-bold text-primary-900 mt-2">
                        {loading ? '...' : stat.value}
                      </p>
                    </div>
                    <div className={`${stat.bg} p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente (Últimos Casos)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <p className="text-center text-gray-500 py-4">Cargando actividad...</p>
              ) : recentActivity.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No hay actividad reciente.</p>
              ) : (
                recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-4 border border-primary-100 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-primary-900">{activity.action}</p>
                      <p className="text-sm text-primary-600">{activity.case}</p>
                    </div>
                    <span className="text-sm text-primary-500">{activity.time}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
