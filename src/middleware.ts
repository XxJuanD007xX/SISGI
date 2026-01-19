import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// 1. Inicializamos el middleware de idiomas
const intlMiddleware = createMiddleware(routing);

// 2. Definimos rutas públicas (ajusta según tu necesidad)
// Nota: Usamos :locale para que coincida con /es, /en, etc.
const isPublicRoute = createRouteMatcher([
  '/',                          // Raíz absoluta
  '/(es|en)',                   // Raíz con idioma (ej: /es o /en)
  '/(es|en)/sign-in(.*)',       // Páginas de auth
  '/(es|en)/sign-up(.*)',
  '/api/webhook(.*)'            // Si tienes webhooks de Clerk
]);

export default clerkMiddleware(async (auth, req) => {
  // Si no es pública, protegemos
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  // IMPORTANTE: Retornamos el middleware de idiomas para manejar la redirección
  return intlMiddleware(req);
});

export const config = {
  matcher: [
    // Este matcher es crucial para que Next.js no ignore la raíz '/'
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};