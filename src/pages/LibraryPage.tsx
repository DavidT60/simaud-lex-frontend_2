import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, Search, Scale, FileText, Gavel, ExternalLink, 
  HelpCircle, ChevronRight, Filter, AlertCircle 
} from 'lucide-react';
import { procesoJudicialAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

export const LibraryPage = () => {
  const [activeTab, setActiveTab] = useState<'cases' | 'rules'>('cases');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Data States
  const [casos, setCasos] = useState<any[]>([]);
  const [reglas, setReglas] = useState<any[]>([]);
  
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'cases' && casos.length === 0) {
        const data = await procesoJudicialAPI.getAll();
        setCasos(data);
      } else if (activeTab === 'rules' && reglas.length === 0) {
        const data = await procesoJudicialAPI.getReglas();
        setReglas(data);
      }
    } catch (error) {
      console.error('Error loading library data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCasos = casos.filter(caso => {
    const term = searchTerm.toLowerCase();
    return (
      caso.id_caso_dinamico?.toLowerCase().includes(term) ||
      caso.nna?.nombre_completo?.toLowerCase().includes(term) ||
      caso.tipo_demanda?.toLowerCase().includes(term)
    );
  });

  const filteredReglas = reglas.filter(regla => {
    const term = searchTerm.toLowerCase();
    return (
      regla.legal_basis?.toLowerCase().includes(term) ||
      regla.condition?.toLowerCase().includes(term) ||
      regla.action?.toLowerCase().includes(term)
    );
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <BookOpen className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              Biblioteca Jurídica
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Explora casos históricos, precedentes y reglas del motor de inferencia.
            </p>
          </div>
          
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('cases')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                activeTab === 'cases' 
                  ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              Casos y Precedentes
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                activeTab === 'rules' 
                  ? "bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm" 
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              Reglas de Inferencia
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder={activeTab === 'cases' ? "Buscar casos por ID, nombre o tipo..." : "Buscar reglas por fundamento o condición..."}
            className="pl-10 h-11 bg-white dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Content Area */}
        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1,2,3,4,5,6].map(i => (
                    <Card key={i} className="bg-gray-50 dark:bg-gray-800/50 animate-pulse border-none h-40">
                         <CardContent></CardContent>
                    </Card>
                ))}
            </div>
        ) : (
          <>
            {/* CASES VIEW */}
            {activeTab === 'cases' && (
              <div className="grid grid-cols-1 gap-4">
                {filteredCasos.map((caso) => (
                  <Card key={caso.id} className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 group">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row md:items-center">
                         {/* Case ID & Type */}
                         <div className="p-6 flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <Badge variant="outline" className="text-xs font-mono bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                                    {caso.id_caso_dinamico}
                                </Badge>
                                <span className={cn(
                                    "text-xs font-medium px-2 py-0.5 rounded-full border",
                                    caso.estado === 'ABIERTO' ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800" :
                                    "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                                )}>
                                    {caso.estado}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                                {caso.tipo_demanda.replace(/_/g, ' ')}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <UserIcon className="w-3 h-3" />
                                NNA: {caso.nna?.nombre_completo || 'No registrado'}
                            </p>
                         </div>
                         
                         {/* Stats/Metrics */}
                         <div className="bg-gray-50 dark:bg-gray-800/80 p-6 md:w-64 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-700 flex flex-col justify-center">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-gray-500">Puntajes (M/P)</span>
                                <span className="text-xs font-mono text-gray-700 dark:text-gray-300">
                                    {caso.puntuacion_madre ?? '-'} / {caso.puntuacion_padre ?? '-'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">Recomendación</span>
                                <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                                    {caso.recomendacion_custodia ?? 'Pendiente'}
                                </span>
                            </div>
                            <Button variant="ghost" className="mt-4 w-full text-xs h-8 group-hover:bg-white dark:group-hover:bg-gray-700">
                                Ver Detalles <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                 {filteredCasos.length === 0 && (
                    <EmptyState 
                        icon={FileText} 
                        title="No se encontraron casos" 
                        description="Intenta con otro término de búsqueda." 
                    />
                )}
              </div>
            )}

            {/* RULES VIEW */}
            {activeTab === 'rules' && (
              <div className="space-y-4">
                 <div className="flex gap-2 pb-2 overflow-x-auto">
                    {/* Optional: Add filters for rules here */}
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredReglas.map((regla) => (
                        <Card key={regla.id} className="dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start gap-4">
                                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 border-none">
                                        Peso: {regla.peso}
                                    </Badge>
                                    <Badge variant="outline" className="font-mono text-[10px] text-gray-500">
                                        ID: {regla.id.substring(0,8)}
                                    </Badge>
                                </div>
                                <CardTitle className="text-base text-gray-900 dark:text-gray-100 mt-2 leading-tight">
                                    {regla.legal_basis}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-md">
                                    <p className="font-semibold text-xs text-gray-500 uppercase mb-1">Condición Lógica</p>
                                    <code className="text-xs text-blue-600 dark:text-blue-400 font-mono break-all">
                                        {regla.condition}
                                    </code>
                                </div>
                                <div>
                                    <p className="font-semibold text-xs text-gray-500 uppercase mb-1">Acción Resultante</p>
                                    <p className="text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <Gavel className="w-3 h-3 text-gray-400" />
                                        {regla.action}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                 </div>
                 {filteredReglas.length === 0 && (
                    <EmptyState 
                        icon={Scale} 
                        title="No se encontraron reglas" 
                        description="La base de conocimientos del motor está vacía o no coincide con tu búsqueda." 
                    />
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

// Sub-components
const UserIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

const EmptyState = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
            <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mt-1">{description}</p>
    </div>
);
