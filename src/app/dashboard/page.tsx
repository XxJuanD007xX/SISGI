import { auth } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    // Clerk automáticamente redirige al login si no hay usuario autenticado
    return null;
  }

  return (
    <div>
      <h1>dashboard SISGI</h1>
    </div>
  );
}