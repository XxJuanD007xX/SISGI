import type { Appearance } from "@clerk/types";
import { dark } from '@clerk/themes';

export const clerkAppearance: Appearance = {

    baseTheme: dark, // Usamos el tema oscuro de Clerk como base

    variables: {

        // Aquí conectamos las variables de Clerk con las de tu tema
        colorPrimary: 'hsl(var(--primary))',
        colorBackground: 'hsl(var(--card))',
        colorInputBackground: 'hsl(var(--input))',
        colorInputText: 'hsl(var(--foreground))',
        colorText: 'hsl(var(--foreground))',
        colorTextSecondary: 'hsl(var(--muted-foreground))',
        colorDanger: 'hsl(var(--destructive))',
        borderRadius: 'var(--radius)',
        
    },

    elements: {

        // Aplicamos clases de Tailwind a los elementos internos de Clerk
        card: 'bg-card border border-border shadow-2xl',
        headerTitle: 'font-headline text-2xl',
        headerSubtitle: 'text-muted-foreground',
        formButtonPrimary:
        'bg-primary text-primary-foreground hover:bg-primary/90 text-sm normal-case',
        socialButtonsBlockButton:
        'bg-secondary text-secondary-foreground hover:bg-secondary/90 text-sm normal-case',
        dividerLine: 'bg-border',
        dividerText: 'text-muted-foreground',
        formFieldInput:
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        footerActionLink: 'text-primary hover:text-primary/90 font-medium',

    },
    
};