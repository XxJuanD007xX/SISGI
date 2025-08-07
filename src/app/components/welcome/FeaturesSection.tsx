import type React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

// Subcomponente para una característica específica
interface FeatureCardProps {
  title: string;
  description: string;
  imageUrl: string;
  features: string[];
  reverse?: boolean; // Para alternar la disposición
}

function FeatureCard({ title, description, imageUrl, features, reverse = false }: FeatureCardProps) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center ${reverse ? 'lg:grid-flow-col-dense' : ''}`}>
      <div className={`lg:order-${reverse ? '2' : '1'}`}>
        <h3 className="text-3xl font-headline font-bold mb-4">{title}</h3>
        <p className="text-lg text-muted-foreground mb-6">{description}</p>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={`lg:order-${reverse ? '1' : '2'} relative group`}>
        <div className="absolute -inset-2.5 bg-gradient-to-r from-primary to-blue-500 rounded-lg blur-lg opacity-10 group-hover:opacity-25 transition-opacity duration-300"></div>
        <Image
          src={imageUrl}
          alt={`Característica: ${title}`}
          width={800}
          height={600}
          className="rounded-lg shadow-xl mx-auto relative ring-1 ring-border/50"
        />
      </div>
    </div>
  );
}

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-background border-y border-border/40">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-headline font-bold">
            Una plataforma, <span className="text-primary">infinitas posibilidades</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            [cite_start]Descubre las herramientas diseñadas para optimizar cada aspecto de tu gestión de inventarios y proveedores[cite: 635, 636].
          </p>
        </div>
        <div className="space-y-24">
          <FeatureCard
            title="Inventario Inteligente"
            description="Control total sobre tus productos, desde el registro hasta el análisis de su movimiento[cite: 712, 715]."
            imageUrl="/img/Grafica.png"
            features={[
              "Registro detallado con categorías y precios",
              "Alertas automáticas de stock bajo para evitar quiebres",
              "Seguimiento de la ubicación en el almacén",
              "Visualización clara del inventario actual",
            ]}
          />
          <FeatureCard
            title="Proveedores Centralizados"
            description="Fortalece tus relaciones comerciales gestionando toda la información de tus proveedores en un solo lugar[cite: 718]."
            imageUrl="/img/Grafica.png"
            features={[
              "Base de datos completa de proveedores",
              "Creación y seguimiento de órdenes de compra",
              "Gestión de condiciones de pago y contactos",
              "Historial de compras para una mejor negociación",
            ]}
            reverse={true}
          />
          <FeatureCard
            title="Decisiones Basadas en Datos"
            description="Transforma los datos en acción con reportes y analíticas que te dan una visión clara de tu negocio[cite: 637, 721]."
            imageUrl="/img/Grafica.png"
            features={[
              "Generación de reportes de ventas e inventario",
              "Análisis de tendencias y rendimiento de productos",
              "Paneles visuales (Dashboards) para un monitoreo rápido",
              "Exportación de datos para análisis avanzado",
            ]}
          />
        </div>
      </div>
    </section>
  );
}