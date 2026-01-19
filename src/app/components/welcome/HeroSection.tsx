"use client"

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LogIn, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import gsap from 'gsap';

export default function HeroSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.fromTo(titleRef.current,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, delay: 0.5 }
        )
        .fromTo(textRef.current,
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 },
            "-=0.8"
        )
        .fromTo(buttonsRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8 },
            "-=0.6"
        )
        .fromTo(imageRef.current,
            { scale: 0.9, opacity: 0, y: 100 },
            { scale: 1, opacity: 1, y: 0, duration: 1.5, ease: "expo.out" },
            "-=0.4"
        );

        gsap.to(".floating-blob", {
            x: "random(-20, 20)",
            y: "random(-20, 20)",
            duration: 5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.5
        });
    }, []);

    return (
        <section ref={containerRef} className="relative min-h-[90vh] overflow-hidden bg-background pt-32 pb-20">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
                <div className="floating-blob absolute top-[10%] left-[15%] w-96 h-96 bg-primary/10 rounded-full blur-[120px]"></div>
                <div className="floating-blob absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[150px]"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
            </div>

            <div className="container mx-auto px-4 text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-bold text-primary mb-8 animate-bounce">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>EL FUTURO DE LA LOGÍSTICA ESTÁ AQUÍ</span>
                </div>

                <h1 ref={titleRef} className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-none italic">
                    SISGI <span className="text-primary not-italic">2.5</span> <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/80 to-foreground/50">SMART INVENTORY</span>
                </h1>

                <p ref={textRef} className="text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
                    Mucho más que un software de gestión. Una experiencia <span className="text-foreground font-bold">inteligente, fluida y potente</span> diseñada para elevar tu negocio al siguiente nivel.
                </p>

                <div ref={buttonsRef} className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-20">
                    <Button asChild size="xl" className="h-16 px-12 text-lg font-black uppercase tracking-widest rounded-2xl shadow-[0_20px_50px_rgba(234,_179,_8,_0.3)] hover:shadow-primary/50 transition-all duration-500 hover:-translate-y-1">
                        <Link href="/sign-in">
                            <LogIn className="mr-3 h-6 w-6" />
                            Acceso Total
                        </Link>
                    </Button>
                    <Button asChild size="xl" variant="outline" className="h-16 px-12 text-lg font-bold rounded-2xl border-2 hover:bg-foreground hover:text-background transition-all duration-500 hover:-translate-y-1">
                        <Link href="#features">
                            Explorar Ecosistema
                            <ArrowRight className="ml-3 h-6 w-6" />
                        </Link>
                    </Button>
                </div>

                {/* Main Showcase */}
                <div ref={imageRef} className="relative group max-w-6xl mx-auto">
                    <div className="absolute -inset-4 bg-gradient-to-r from-primary via-purple-600 to-blue-600 rounded-[2.5rem] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>

                    <div className="relative bg-zinc-900 rounded-[2rem] border border-white/10 p-2 shadow-2xl overflow-hidden shadow-black/50">
                        <div className="absolute top-0 left-0 w-full h-12 bg-zinc-800/50 flex items-center px-6 gap-2">
                             <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                             <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                             <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                             <div className="flex-1 ml-4 bg-black/20 rounded-md h-6"></div>
                        </div>
                        <Image
                            src="/img/Widgets.png"
                            alt="SISGI Enterprise Dashboard"
                            width={1400}
                            height={800}
                            className="rounded-[1.5rem] mt-10 w-full"
                            priority
                        />
                    </div>
                </div>

                <div className="mt-20 flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Scroll para profundizar</span>
                    <ChevronDown className="h-4 w-4" />
                </div>
            </div>
        </section>
    );
}
