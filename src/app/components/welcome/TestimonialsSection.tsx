import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/ui/avatar";
import { Star } from 'lucide-react';

interface TestimonialCardProps {

    quote: string;
    name: string;
    role: string;
    avatarSrc?: string;
    avatarFallback: string;

}

function TestimonialCard({ quote, name, role, avatarSrc, avatarFallback }: TestimonialCardProps) {

    return (

        <Card className="bg-card text-card-foreground shadow-lg hover:shadow-primary/20 hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col">

            <CardHeader className="pb-4">

                <div className="flex items-center space-x-3 mb-3">
                    
                    <Avatar className="w-12 h-12"> {/* Avatar más pequeño */}
                        {avatarSrc ? (
                            <AvatarImage src={avatarSrc} alt={name} className="w-12 h-12 object-cover" />
                        ) : (
                            <AvatarFallback className="w-12 h-12 text-base">{avatarFallback}</AvatarFallback>
                        )}
                    </Avatar>

                    <div>
                        <CardTitle className="text-base font-semibold leading-tight">{name}</CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">{role}</CardDescription>
                    </div>

                </div>

                <div className="flex text-primary">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-primary" />)}
                </div>

            </CardHeader><hr /> 
            
            <CardContent className="flex-grow">
                <p className="text-muted-foreground italic">"{quote}"</p>
            </CardContent>

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
            avatarSrc: "https://placehold.co/100x100.png"
        },

        {
            quote: "La capacidad de generar informes detallados y las alertas de stock son cruciales para nuestro negocio. ¡Altamente recomendado!",
            name: "Carlos López",
            role: "Jefe de Almacén, Proveedora Dipal",
            avatarFallback: "CL",
            avatarSrc: "https://placehold.co/100x100.png"
        },

        {
            quote: "Desde que implementamos SISGI, hemos reducido errores y optimizado nuestros pedidos a proveedores. Un cambio radical.",
            name: "Sofía Martínez",
            role: "Encargada de Compras, Distribuidora Dipal",
            avatarFallback: "SM",
            avatarSrc: "https://placehold.co/100x100.png"
        }

    ];

    return (

        <section className="py-16 md:py-24 bg-card/30 border-y border-border/40">

            <div className="container mx-auto px-4 md:px-6">

                <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12 md:mb-16">
                    Lo que Dicen Nuestros <span className="text-primary">Clientes</span>
                </h2>

                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">

                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard key={index} {...testimonial} />
                    ))}
                    
                </div>

            </div>

        </section>

    );
    
}
