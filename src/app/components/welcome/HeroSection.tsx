import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';
import { LogIn } from 'lucide-react';

export default function HeroSection() {

    return (

        <section className="container mx-auto px-4 md:px-6 py-16 md:py-24 text-center">

            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] [background-size:32px_32px]"></div>

            <h1 className="text-4xl md:text-6xl font-headline font-extrabold mb-6 tracking-tight">
                Bienvenido a <span className="text-primary">SISGI</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
                Optimiza la gestión de inventarios de Variedades Dipal con nuestra solución integral. Automatiza procesos, controla tu stock y toma decisiones informadas.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">

                <Button asChild size="lg" className="bg-primary hover:bg-primary/80 text-primary-foreground px-10 py-6 text-lg font-semibold shadow-lg hover:shadow-primary/40 transition-all duration-300">
                    <Link href="/sign-in">
                        <LogIn className="mr-2 h-5 w-5" />
                        Comenzar Ahora
                    </Link>
                </Button>

                <Button asChild size="lg" variant="outline" className="px-10 py-6 text-lg font-semibold border-primary text-primary hover:bg-primary/10 hover:text-primary shadow-lg hover:shadow-primary/20 transition-all duration-300">
                    <Link href="/learn-more">Conocer Más</Link>
                </Button>

            </div>

            <div className="mt-16 md:mt-24 relative group">

                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                
                <Image
                    src="https://placehold.co/1000x560.png"
                    alt="Vista previa del dashboard de SISGI"
                    width={1000}
                    height={560}
                    className="rounded-lg shadow-2xl mx-auto relative ring-1 ring-border"
                    priority
                    data-ai-hint="dashboard interface"
                />

            </div>

        </section>

    );

}
