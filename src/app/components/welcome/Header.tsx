"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Database, Menu, X, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Funciones', href: '#features' },
        { name: 'Tecnología', href: '#tech' },
        { name: 'Testimonios', href: '#testimonials' },
    ];

    return (
        <header className={cn(
            "fixed top-0 left-0 w-full z-50 transition-all duration-500 py-4",
            isScrolled ? "bg-background/80 backdrop-blur-xl border-b shadow-xl py-3" : "bg-transparent"
        )}>
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-300">
                            <Database className="h-5 w-5" />
                        </div>
                        <span className="text-2xl font-black tracking-tighter">SISGI</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <Separator />
                        <Button asChild variant="ghost" className="font-bold hover:bg-primary/10 hover:text-primary">
                            <Link href="/sign-in">Log In</Link>
                        </Button>
                        <Button asChild className="font-black uppercase tracking-wider rounded-xl px-8 shadow-lg shadow-primary/20">
                            <Link href="/sign-up">Registrarse</Link>
                        </Button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 rounded-lg bg-muted/50"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-background border-b p-6 flex flex-col gap-6 animate-in slide-in-from-top-4 duration-300">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-lg font-bold"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-4 pt-4 border-t">
                        <Button asChild variant="outline" className="w-full h-12">
                            <Link href="/sign-in">Log In</Link>
                        </Button>
                        <Button asChild className="w-full h-12">
                            <Link href="/sign-up">Registrarse</Link>
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
}

function Separator() {
    return <div className="h-6 w-px bg-border mx-2"></div>
}
