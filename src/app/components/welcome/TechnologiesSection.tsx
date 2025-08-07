import type React from 'react';
import { SiReact, SiNextdotjs, SiClerk, SiTailwindcss, SiSpring, SiPostgresql } from "react-icons/si";

const technologies = [
  { name: "React", icon: <SiReact className="h-10 w-10 text-cyan-400" /> },
  { name: "Next.js", icon: <SiNextdotjs className="h-10 w-10" /> },
  { name: "Clerk", icon: <SiClerk className="h-10 w-10 text-indigo-500" /> },
  { name: "Tailwind CSS", icon: <SiTailwindcss className="h-10 w-10 text-sky-400" /> },
  { name: "Spring Boot", icon: <SiSpring className="h-10 w-10 text-green-500" /> },
  { name: "PostgreSQL", icon: <SiPostgresql className="h-10 w-10 text-blue-400" /> },
];

export default function TechnologiesSection() {

    return (

        <section className="py-16 md:py-24 bg-card/30">

            <div className="container mx-auto max-w-7xl px-4 md:px-6">

                <div className="text-center">

                    <h2 className="text-3xl md:text-4xl font-headline font-bold">
                        Construido con <span className="text-primary">Tecnología de Punta</span>
                    </h2>

                    <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
                        Utilizamos un stack moderno y robusto para garantizar una experiencia rápida, segura y escalable.
                    </p>

                </div>

                <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    {technologies.map((tech) => (
                        <div key={tech.name} className="flex flex-col items-center justify-center gap-4 p-4 bg-background/50 rounded-lg border border-border/50 shadow-sm hover:shadow-lg transition-shadow">
                            {tech.icon}
                            <p className="text-sm font-semibold">{tech.name}</p>
                        </div>
                    ))}
                </div>

            </div>

        </section>

    );
    
}