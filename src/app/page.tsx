import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MapSection from "@/components/MapSection";
import WhySection from "@/components/WhySection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-mist-25">
      <Header />
      <HeroSection />
      <MapSection />
      <WhySection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
