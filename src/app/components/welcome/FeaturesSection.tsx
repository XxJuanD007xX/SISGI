import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, PackageSearch, Users, Zap, ShieldCheck, LayoutGrid } from 'lucide-react';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {

    return (

        <Card className="bg-card text-card-foreground shadow-lg hover:shadow-primary/20 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">

            <CardHeader className="items-center text-center">
                {icon}
                <CardTitle className="font-headline text-xl mt-2">{title}</CardTitle>
            </CardHeader>

            <CardContent className="text-center">
                <p className="text-muted-foreground">{description}</p>
            </CardContent>

        </Card>

    );

}

export default function FeaturesSection() {

    return (

        <section className="py-16 md:py-24 bg-card/30 border-y border-border/40">
            
            <div className="container mx-auto px-4 md:px-6">

                <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-16">
                Potencia tu Negocio con <span className="text-primary">SISGI</span>
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    <FeatureCard
                        icon={<PackageSearch className="h-10 w-10 text-primary mx-auto" />}
                        title="Gestión Eficaz de Productos"
                        description="Control total sobre tu inventario: registro, seguimiento y categorización detallada de productos."
                    />
                    <FeatureCard
                        icon={<Users className="h-10 w-10 text-primary mx-auto" />}
                        title="Administración de Proveedores"
                        description="Centraliza y gestiona la información de tus proveedores para optimizar tus compras."
                    />
                    <FeatureCard
                        icon={<Zap className="h-10 w-10 text-primary mx-auto" />}
                        title="Optimización de Procesos"
                        description="Automatiza tareas repetitivas y agiliza la gestión de inventario, reduciendo errores y tiempos."
                    />
                    <FeatureCard
                        icon={<BarChart3 className="h-10 w-10 text-primary mx-auto" />}
                        title="Informes y Análisis"
                        description="Genera informes detallados y visualizaciones de datos para tomar decisiones estratégicas."
                    />
                    <FeatureCard
                        icon={<ShieldCheck className="h-10 w-10 text-primary mx-auto" />}
                        title="Alertas Inteligentes"
                        description="Recibe notificaciones proactivas sobre niveles bajos de stock y otros eventos críticos."
                    />
                        <FeatureCard
                        icon={<LayoutGrid className="h-10 w-10 text-primary mx-auto" />}
                        title="Interfaz Intuitiva y Moderna"
                        description="Diseño amigable y fácil de usar, inspirado en las mejores prácticas de software empresarial."
                    />
                    
                </div>

            </div>

        </section>

    );

}
