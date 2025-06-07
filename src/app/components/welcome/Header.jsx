import Link from 'next/link';
import { Button } from '@/app/components/ui/button';
import { LayoutGrid } from 'lucide-react';

export default function Header() {

    return (

        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">

                <Link href="/" className="flex items-center gap-2">
                    <LayoutGrid className="h-7 w-7 text-primary" />
                    <span className="text-xl font-headline font-semibold">SISGI</span>
                </Link>

                <nav className="space-x-2">

                    <Button asChild variant="ghost" className="text-foreground hover:bg-accent hover:text-accent-foreground">
                        <Link href="/sign-in">Iniciar Sesión</Link>
                    </Button>

                    <Button asChild variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        <Link href="/sign-up">Registrarse</Link>
                    </Button>
                    
                </nav>

            </div>

        </header>

    );

}
