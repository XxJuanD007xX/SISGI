import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LogIn, ArrowRight } from 'lucide-react';

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-background py-20 md:py-32">
            {/* Fondo con gradiente sutil */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-gradient-to-b from-background to-card/30"></div>

            <div className="container mx-auto px-4 md:px-6 text-center">
                <h1 className="text-4xl md:text-6xl font-headline font-extrabold mb-6 tracking-tight">
                    La Gestión de Inventarios, <span className="text-primary">Reinventada</span>.
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
                    Bienvenido a SISGI, la solución integral para automatizar el control de tu stock, optimizar la gestión de proveedores y tomar decisiones basadas en datos reales.
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-primary/40 transition-all duration-300">
                        <Link href="/sign-in">
                            <LogIn className="mr-2 h-5 w-5" />
                            Comenzar Ahora
                        </Link>
                    </Button>
                    <Button asChild size="lg" variant="outline" className="px-10 py-6 text-lg font-semibold border-border hover:bg-accent hover:text-accent-foreground shadow-lg transition-all duration-300">
                        <Link href="#features">
                            Descubrir Funciones
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Showcase del Dashboard */}
            <div className="container mx-auto px-4 md:px-6 mt-16 md:mt-24 relative group">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-primary via-purple-500 to-blue-500 rounded-lg blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                
                <Image
                    src="/img/Widgets.png" 
                    alt="Vista previa del dashboard de SISGI"
                    width={1200}
                    height={675}
                    className="rounded-lg shadow-2xl mx-auto relative ring-1 ring-border/50"
                    priority
                />
            </div>
        </section>
    );
}