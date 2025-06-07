import Header from '@/app/components/welcome/Header';
import HeroSection from '@/app/components/welcome/HeroSection';
import FeaturesSection from '@/app/components/welcome/FeaturesSection';
import TechnologiesSection from '@/app/components/welcome/TechnologiesSection';
import TestimonialsSection from '@/app/components/welcome/TestimonialsSection';
import Footer from '@/app/components/welcome/Footer';

export default function WelcomePage() {
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
