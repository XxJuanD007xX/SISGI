"use client"

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { CheckCircle, Zap, Shield, BarChart, Globe } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface FeatureCardProps {
  title: string;
  description: string;
  imageUrl: string;
  features: string[];
  reverse?: boolean;
  icon: any;
}

function FeatureCard({ title, description, imageUrl, features, reverse = false, icon: Icon }: FeatureCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
        { y: 100, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 1,
            scrollTrigger: {
                trigger: cardRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );
  }, []);

  return (
    <div ref={cardRef} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${reverse ? 'lg:grid-flow-col-dense' : ''}`}>
      <div className={`lg:order-${reverse ? '2' : '1'} space-y-6`}>
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-4xl font-black tracking-tight">{title}</h3>
        <p className="text-xl text-muted-foreground leading-relaxed font-medium">{description}</p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3 bg-muted/30 p-3 rounded-xl border border-border/50">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
              <span className="text-sm font-bold text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={`lg:order-${reverse ? '1' : '2'} relative group`}>
        <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-purple-500/10 to-blue-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
        <div className="relative bg-zinc-900 rounded-3xl border border-white/10 p-2 shadow-2xl overflow-hidden shadow-black/50">
             <Image
                src={imageUrl}
                alt={title}
                width={800}
                height={600}
                className="rounded-2xl w-full"
            />
        </div>
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 bg-background relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center mb-32 space-y-4">
            <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">Capacidades de Grado Industrial</span>
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter">
                Diseñado para <br /><span className="text-muted-foreground">Escalar sin Límites.</span>
            </h2>
        </div>

        <div className="space-y-40">
          <FeatureCard
            title="Inteligencia en Stock"
            description="Algoritmos avanzados para predecir faltantes y automatizar el ciclo de vida de tus productos."
            imageUrl="/img/Grafica.png"
            icon={Zap}
            features={[
              "Alertas Predictivas",
              "Seguimiento LIFO/FIFO",
              "Geolocalización",
              "Etiquetado Inteligente",
            ]}
          />
          <FeatureCard
            title="Ecosistema de Proveedores"
            description="Una red centralizada para gestionar compras, negociaciones y cumplimiento en tiempo récord."
            imageUrl="/img/Grafica.png"
            icon={Globe}
            features={[
              "Órdenes de Compra PDF",
              "Logs de Interacción",
              "Scorecard de Proveedor",
              "Pagos Automatizados",
            ]}
            reverse={true}
          />
          <FeatureCard
            title="Analítica en Tiempo Real"
            description="Visualiza cada centavo de tu inventario con dashboards de alto impacto visual."
            imageUrl="/img/Grafica.png"
            icon={BarChart}
            features={[
              "Reportes Senior PDF",
              "Gráficos Dinámicos",
              "Exportación masiva",
              "Auditoría Total",
            ]}
          />
        </div>
      </div>
    </section>
  );
}
