import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Header from '@/app/components/welcome/Header';
import HeroSection from '@/app/components/welcome/HeroSection';
import FeaturesSection from '@/app/components/welcome/FeaturesSection';
import TechnologiesSection from '@/app/components/welcome/TechnologiesSection';
import TestimonialsSection from '@/app/components/welcome/TestimonialsSection';
import Footer from '@/app/components/welcome/Footer';

export default async function WelcomePage() {
  const { userId } = await auth();
  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <TechnologiesSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
