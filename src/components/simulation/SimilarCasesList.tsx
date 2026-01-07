import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Scale, 
  Calendar, 
  User, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  Gavel 
} from 'lucide-react';

interface SimilarCase {
  casoId: string;
  procesoId: string;
  numeroCaso: string;
  tipoDemanda: string;
  scoreSimulitud: number;
  puntuacionMadre: number | null;
  puntuacionPadre: number | null;
  recomendacion: string | null;
  fechaSimulacion: string;
  camposCoincidentes: {
    campo: string;
    categoria: string;
    peso: number;
    coincide: boolean;
  }[];
}

interface SimilarCasesListProps {
  casos: SimilarCase[];
  loading?: boolean;
}

export const SimilarCasesList: React.FC<SimilarCasesListProps> = ({ casos, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!casos || casos.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No se encontraron casos similares con suficiente relevancia.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-DO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRecomendacionLabel = (key: string | null) => {
    switch (key) {
      case 'MADRE': return 'Custodia Materna';
      case 'PADRE': return 'Custodia Paterna';
      case 'COMPARTIDA': return 'Custodia Compartida';
      default: return 'No definida';
    }
  };

  const getRecomendacionColor = (key: string | null) => {
    switch (key) {
      case 'MADRE': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'PADRE': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'COMPARTIDA': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        Casos Similares Encontrados ({casos.length})
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
        {casos.map((caso) => (
          <Card key={caso.casoId} className="border-l-4 border-l-primary/50 overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="bg-muted/10 pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="mb-2">
                     <p className="font-bold text-lg text-primary-900">{caso.numeroCaso || 'Caso sin N°'}</p>
                     <p className="text-sm text-gray-500 font-medium">{caso.tipoDemanda?.replace(/_/g, ' ') || 'Demanda General'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {Number(caso.scoreSimulitud).toFixed(1)}% Similitud
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(caso.fechaSimulacion)}
                    </span>
                  </div>
                </div>
                {caso.recomendacion && (
                  <Badge className={`ml-2 ${getRecomendacionColor(caso.recomendacion)}`}>
                    <Gavel className="w-3 h-3 mr-1" />
                    {getRecomendacionLabel(caso.recomendacion)}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4 text-sm">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1 p-2 bg-pink-50/50 rounded-md">
                  <span className="text-xs text-muted-foreground">Puntuación Madre</span>
                  <span className="font-semibold text-pink-700 text-lg">
                     {caso.puntuacionMadre !== null ? caso.puntuacionMadre : 'N/A'}
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-2 bg-blue-50/50 rounded-md">
                  <span className="text-xs text-muted-foreground">Puntuación Padre</span>
                  <span className="font-semibold text-blue-700 text-lg">
                    {caso.puntuacionPadre !== null ? caso.puntuacionPadre : 'N/A'}
                  </span>
                </div>
              </div>

              {caso.camposCoincidentes && caso.camposCoincidentes.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Factores coincidentes:</p>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(new Set(caso.camposCoincidentes.map(c => c.categoria))).map((cat) => (
                      <Badge key={cat} variant="secondary" className="text-xs font-normal">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
