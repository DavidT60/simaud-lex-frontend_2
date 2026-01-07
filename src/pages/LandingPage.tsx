import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scale, Brain, Shield, Clock, ChevronRight, Gavel, BookOpen, Users } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">SIMAUD-LEX</span>
          </div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="ghost">Iniciar Sesión</Button>
            </Link>
            <Link to="/register">
              <Button>Registrarse</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-b from-slate-900 to-slate-800 text-white">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-300 backdrop-blur-xl">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                Versión 2.0 Disponible
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-300">
                Justicia Inteligente
                <br />
                Decisiones Precisas
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-300 md:text-xl">
                SIMAUD-LEX revoluciona la gestión judicial mediante inteligencia artificial avanzada. 
                Simulación de sentencias, análisis de casos y asistencia en tiempo real.
              </p>
              <div className="space-x-4 pt-4">
                <Link to="/register">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg shadow-blue-900/20">
                    Comenzar Ahora
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 backdrop-blur-sm">
                    Acceder al Sistema
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Potenciando la Labor Jurídica
              </h2>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                Herramientas diseñadas específicamente para optimizar el flujo de trabajo en juzgados y despachos.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard 
                icon={Brain}
                title="IA Predictiva"
                description="Motor de inferencia avanzado que analiza patrones y sugiere recomendaciones basadas en precedentes."
              />
              <FeatureCard 
                icon={Shield}
                title="Seguridad Total"
                description="Protección de datos de nivel institucional con encriptación de extremo a extremo y auditoría de accesos."
              />
              <FeatureCard 
                icon={Clock}
                title="Eficiencia Operativa"
                description="Automatización de tareas repetitivas y generación instantánea de documentos y reportes."
              />
            </div>
          </div>
        </section>

        {/* Custom Content Section (Extensible) */}
        <CustomSection />

      </main>

      <footer className="border-t bg-slate-950 text-slate-400 py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-4 text-center">
            <div className="space-y-4 flex flex-col items-center">
              <div className="flex items-center gap-2 justify-center">
                <Scale className="h-6 w-6 text-blue-500" />
                <span className="text-xl font-bold text-white">SIMAUD-LEX</span>
              </div>
              <p className="text-sm">
                Redefiniendo el futuro de la justicia con tecnología de vanguardia.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-white mb-4">Plataforma</h3>
              <ul className="space-y-2 text-sm text-center">
                <li><Link to="#" className="hover:text-blue-400">Características</Link></li>
                <li><Link to="#" className="hover:text-blue-400">Seguridad</Link></li>
                <li><Link to="#" className="hover:text-blue-400">Roadmap</Link></li>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-white mb-4">Recursos</h3>
              <ul className="space-y-2 text-sm text-center">
                <li><Link to="#" className="hover:text-blue-400">Documentación</Link></li>
                <li><Link to="#" className="hover:text-blue-400">API</Link></li>
                <li><Link to="#" className="hover:text-blue-400">Soporte</Link></li>
              </ul>
            </div>
            <div className="flex flex-col items-center">
              <h3 className="font-semibold text-white mb-4">Contacto</h3>
              <ul className="space-y-2 text-sm text-center">
                <li>contacto@simaud-lex.com</li>
                <li>+1 (809) 000-0000</li>
                <li>Santo Domingo, República Dominicana</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-sm">
             © 2025 SIMAUD-LEX. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <Card className="border-none shadow-lg bg-white dark:bg-slate-800 text-center">
    <CardHeader className="flex flex-col items-center">
      <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
        <Icon className="h-6 w-6" />
      </div>
      <CardTitle className="text-xl text-slate-900 dark:text-white">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </CardContent>
  </Card>
);

// This component is designed to be easily extensible by the user
const CustomSection = () => {
  // USER: Edit the specific data here to customize your section
  const customData = {
    title: "Nuestro Compromiso",
    subtitle: "Información institucional y valores agregados",
    content: "En SIMAUD-LEX nos comprometemos a brindar transparencia, celeridad y precisión en cada proceso judicial. Nuestra plataforma integra las mejores prácticas legales con la potencia del cómputo moderno.",
    items: [
      { id: 1, title: "Innovación Constante", text: "Actualizaciones semanales con nuevas reglas y jurisprudencia." },
      { id: 2, title: "Soporte Especializado", text: "Equipo legal y técnico disponible 24/7." },
      { id: 3, title: "Ética y Privacidad", text: "Estrictos protocolos de manejo ético de la información." }
    ]
  };

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-block rounded-lg bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-sm text-blue-700 dark:text-blue-300">
              Sobre Nosotros
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              {customData.title}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {customData.subtitle}
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
              {customData.content}
            </p>
            
            <div className="grid gap-6 mt-8 md:grid-cols-3">
              {customData.items.map((item) => (
                <div key={item.id} className="flex flex-col items-center gap-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="h-2 w-2 rounded-full bg-blue-500 mb-2" />
                  <h4 className="font-semibold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.text}</p>
                </div>
              ))}
            </div>

             {/* Team Image centered below content */}
            <div className="relative w-full aspect-video overflow-hidden rounded-xl shadow-2xl bg-slate-900 mt-8 max-w-3xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 mix-blend-overlay z-10" />
                <img 
                   alt="Equipo de Trabajo"
                   src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80"
                   className="object-cover w-full h-full opacity-80 hover:scale-105 transition-transform duration-700"
                />
            </div>
        </div>
      </div>
    </section>
  );
};
