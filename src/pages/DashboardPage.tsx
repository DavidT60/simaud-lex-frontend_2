import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { FolderOpen, Users, FileText, TrendingUp, Clock, ArrowUp, ArrowDown, Activity } from 'lucide-react';
import { procesoJudicialAPI, nnaAPI } from '@/lib/api';

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 2000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (value === 0) return;
    
    const startTime = Date.now();
    const endValue = value;

    const updateCount = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * endValue));

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(updateCount);
  }, [value, duration]);

  return <span>{count}</span>;
};

// Progress Ring Component
const ProgressRing = ({ percentage, color }: { percentage: number; color: string }) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="transform -rotate-90 w-24 h-24">
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${color} transition-all duration-1000 ease-out`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-gray-900 dark:text-white">{percentage}%</span>
      </div>
    </div>
  );
};

export const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalCasos: 0,
    activeCasos: 0,
    totalNnas: 0,
    documentos: 0,
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cases, nnas] = await Promise.all([
          procesoJudicialAPI.getAll(),
          nnaAPI.getAll(),
        ]);

        const totalCasos = cases.length;
        const activeCasos = cases.filter((c: any) => c.estado === 'EN_PROCESO').length;
        const totalNnas = nnas.length;

        setStats({
          totalCasos,
          activeCasos,
          totalNnas,
          documentos: 0,
        });

        const sortedCases = [...cases].sort((a: any, b: any) => 
          new Date(b.fecha_inicio).getTime() - new Date(a.fecha_inicio).getTime()
        ).slice(0, 5);

        const activity = sortedCases.map((c: any) => ({
          id: c.id,
          action: 'Nuevo caso registrado',
          case: `Caso de ${c.nna?.nombre_completo || 'NNA desconocido'}`,
          type: c.tipo_demanda,
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

  const activePercentage = stats.totalCasos > 0 
    ? Math.round((stats.activeCasos / stats.totalCasos) * 100) 
    : 0;

  const statCards = [
    { 
      title: 'Total Casos', 
      value: stats.totalCasos, 
      icon: FolderOpen, 
      color: 'text-blue-600 dark:text-blue-400', 
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      gradient: 'from-blue-500 to-blue-600',
      trend: '+12%',
      trendUp: true,
    },
    { 
      title: 'Casos Activos', 
      value: stats.activeCasos, 
      icon: TrendingUp, 
      color: 'text-green-600 dark:text-green-400', 
      bg: 'bg-green-50 dark:bg-green-900/20',
      gradient: 'from-green-500 to-green-600',
      trend: '+8%',
      trendUp: true,
    },
    { 
      title: 'NNA Registrados', 
      value: stats.totalNnas, 
      icon: Users, 
      color: 'text-purple-600 dark:text-purple-400', 
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      gradient: 'from-purple-500 to-purple-600',
      trend: '+5%',
      trendUp: true,
    },
    { 
      title: 'Documentos', 
      value: stats.documentos, 
      icon: FileText, 
      color: 'text-orange-600 dark:text-orange-400', 
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      gradient: 'from-orange-500 to-orange-600',
      trend: '0%',
      trendUp: false,
    },
  ];

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary-900 dark:text-white">Dashboard</h1>
            <p className="text-primary-600 dark:text-gray-400 mt-2">Resumen general del sistema</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <Activity className="w-4 h-4 text-green-600 dark:text-green-400 animate-pulse" />
            <span className="text-sm font-medium text-green-700 dark:text-green-300">Sistema Activo</span>
          </div>
        </div>

        {/* Stats Grid with Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.title} 
                className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden relative animate-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bg} p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="flex items-center gap-1">
                      {stat.trendUp ? (
                        <ArrowUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-xs font-medium ${stat.trendUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm font-medium text-primary-600 dark:text-gray-400">{stat.title}</p>
                  <p className="text-4xl font-bold text-primary-900 dark:text-white mt-2 tabular-nums">
                    {loading ? (
                      <span className="animate-pulse">...</span>
                    ) : (
                      <AnimatedCounter value={stat.value} />
                    )}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Progress and Recent Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cases Progress */}
          <Card className="lg:col-span-1 hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                Progreso de Casos
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-8">
              {loading ? (
                <div className="animate-pulse">
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              ) : (
                <>
                  <ProgressRing 
                    percentage={activePercentage} 
                    color="text-green-500 dark:text-green-400"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                    {stats.activeCasos} de {stats.totalCasos} casos activos
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2 hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                {loading ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">Cargando actividad...</p>
                ) : recentActivity.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">No hay actividad reciente.</p>
                ) : (
                  recentActivity.map((activity, index) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 border border-primary-100 dark:border-gray-700 rounded-lg hover:bg-primary-50 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-[1.02] cursor-pointer animate-in slide-in-from-right-4"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <div>
                          <p className="font-medium text-primary-900 dark:text-white">{activity.action}</p>
                          <p className="text-sm text-primary-600 dark:text-gray-400">{activity.case}</p>
                          {activity.type && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                              {activity.type}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-primary-500 dark:text-gray-500">{activity.time}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};
