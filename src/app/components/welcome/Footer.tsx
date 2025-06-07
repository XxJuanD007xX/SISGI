export default function Footer() {

    const currentYear = new Date().getFullYear();
    
    return (

        <footer className="py-10 border-t border-border/40 bg-background">

            <div className="container mx-auto text-center text-muted-foreground px-4 md:px-6">

                <p className="mb-2">SISGI - Sistema de Gestión de Inventarios para Variedades Dipal</p>
                <p>&copy; {currentYear} Todos los derechos reservados.</p>

            </div>
            
        </footer>

    );

}
