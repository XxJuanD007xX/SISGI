import type React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from 'lucide-react';

// ... (El resto del componente TestimonialsSection se puede mantener como estaba, ya que su diseño es bastante bueno y adaptable)
interface TestimonialCardProps {

    quote: string;
    name: string;
    role: string;
    avatarSrc?: string;
    avatarFallback: string;

}

function TestimonialCard({ quote, name, role, avatarSrc, avatarFallback }: TestimonialCardProps) {

    return (

        <Card className="bg-card/80 text-card-foreground shadow-lg flex flex-col p-6">

            <div className="flex text-primary mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
            </div>

            <CardContent className="p-0 flex-grow mb-4">
                <blockquote className="text-lg italic border-l-4 border-primary/50 pl-4">
                    "{quote}"
                </blockquote>
            </CardContent>

            <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                    {avatarSrc ? (
                        <AvatarImage src={avatarSrc} alt={name} />
                    ) : (
                        <AvatarFallback className="text-lg">{avatarFallback}</AvatarFallback>
                    )}
                </Avatar>
                <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-muted-foreground">{role}</p>
                </div>
            </div>

        </Card>

    );

}

export default function TestimonialsSection() {

    const testimonials: TestimonialCardProps[] = [

        {
            quote: "SISGI ha transformado nuestra gestión de inventario. Es intuitivo, potente y nos ahorra horas de trabajo cada semana.",
            name: "Ana Pérez",
            role: "Gerente de Operaciones, Dipal S.A.",
            avatarFallback: "AP",
        },
        {
            quote: "La capacidad de generar informes detallados y las alertas de stock son cruciales para nuestro negocio. ¡Altamente recomendado!",
            name: "Carlos López",
            role: "Jefe de Almacén, Proveedora Dipal",
            avatarFallback: "CL",
        },
        {
            quote: "Desde que implementamos SISGI, hemos reducido errores y optimizado nuestros pedidos a proveedores. Un cambio radical.",
            name: "Sofía Martínez",
            role: "Encargada de Compras, Distribuidora Dipal",
            avatarFallback: "SM",
        }
        
    ];

    return (

        <section className="py-16 md:py-24 bg-background border-y border-border/40">

            <div className="container mx-auto max-w-7xl px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-headline font-bold">
                        Lo que Dicen Nuestros <span className="text-primary">Usuarios</span>
                    </h2>
                </div>
                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} />
                    ))}
                </div>
            </div>

        </section>

    );
    
}