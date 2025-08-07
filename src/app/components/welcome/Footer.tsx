import { LayoutGrid } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    
    return (

        <footer className="py-10 border-t border-border/40 bg-card/30">

            <div className="container mx-auto max-w-7xl px-4 md:px-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left">

                <div className="flex items-center gap-2 mb-4 md:mb-0">
                    <LayoutGrid className="h-6 w-6 text-primary" />
                    <span className="text-lg font-headline font-semibold">Con ❤️ para SISGI</span>
                </div>

                <p className="text-sm text-muted-foreground">
                    &copy; {currentYear} SISGI - Variedades Dipal. Todos los derechos reservados.
                </p>

            </div>

        </footer>
        
    );

}