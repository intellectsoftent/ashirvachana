import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedPoojas from "@/components/FeaturedPoojas";
import BrowsePoojas from "@/components/BrowsePoojas";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturedPoojas />
      <BrowsePoojas />
      <HowItWorks />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
