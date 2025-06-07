import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';

// Importa los íconos oficiales de cada tecnología
import {
    SiReact,
    SiNextdotjs,
    SiClerk,
    SiTailwindcss,
    SiFirebase,
    SiGooglecloud
} from "react-icons/si";

interface TechCardProps {
    icon: React.ReactNode;
    name: string;
    description: string;
}

function TechCard({ icon, name, description }: TechCardProps) {

    return (

        <Card className="bg-card text-card-foreground shadow-lg hover:shadow-primary/20 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col items-center text-center max-w-md w-full mx-auto">
            <CardHeader className="items-center">
                {icon}
                <CardTitle className="font-headline text-xl mt-2">{name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground text-sm">{description}</p>
            </CardContent>
        </Card>

    );

}

export default function TechnologiesSection() {

    return (

        <section className="py-16 md:py-24 bg-background">

            <div className="container mx-auto px-4 md:px-6">

                <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12 md:mb-16">
                    Tecnologías que Impulsan <span className="text-primary">SISGI</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 gap-y-10">
                    <TechCard
                        icon={<SiReact className="h-12 w-12 mx-auto text-cyan-400" />}
                        name="React"
                        description="Biblioteca líder para construir interfaces de usuario modernas, rápidas y reactivas, con una gran comunidad y ecosistema."
                    />
                    <TechCard
                        icon={<SiNextdotjs className="h-12 w-12 mx-auto text-black dark:text-white" />}
                        name="Next.js"
                        description="Framework full-stack que permite SSR, SSG y API routes, ideal para aplicaciones escalables y de alto rendimiento."
                    />
                    <TechCard
                        icon={<SiClerk className="h-12 w-12 mx-auto text-blue-500" />}
                        name="Clerk"
                        description="Solución de autenticación y gestión de usuarios lista para producción, con integración sencilla y segura."
                    />
                    <TechCard
                        icon={<SiTailwindcss className="h-12 w-12 mx-auto text-sky-400" />}
                        name="Tailwind CSS"
                        description="Framework de utilidades CSS que permite crear diseños modernos y responsivos de forma rápida y eficiente."
                    />
                    <TechCard
                        icon={<SiGooglecloud className="h-12 w-12 mx-auto text-violet-500" />}
                        name="Genkit"
                        description="Herramientas de IA para potenciar funcionalidades inteligentes y automatizaciones dentro de la plataforma."
                    />
                    <TechCard
                        icon={<SiFirebase className="h-12 w-12 mx-auto text-yellow-400" />}
                        name="Firebase Studio"
                        description="Plataforma de desarrollo asistido por IA para crear, desplegar y escalar aplicaciones de manera ágil."
                    />
                </div>

            </div>

        </section>

    );
    
}