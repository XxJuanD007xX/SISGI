import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutGrid } from 'lucide-react';

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <LayoutGrid className="h-5 w-5" />
                    </div>
                    <span className="text-xl font-headline font-semibold">SISGI</span>
                </Link>
                <nav className="flex items-center gap-2">
                    <Button asChild variant="ghost" className="text-foreground hover:bg-accent hover:text-accent-foreground">
                        <Link href="/sign-in">Iniciar Sesión</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/sign-up">Registrarse</Link>
                    </Button>
                </nav>
            </div>
        </header>
    );
}