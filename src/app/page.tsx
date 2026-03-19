import LandingHeader from "./components/landing/LandingHeader";
import HeroSection from "./components/landing/HeroSection";
import FeaturesSection from "./components/landing/FeaturesSection";
import HowItWorksSection from "./components/landing/HowItWorksSection";
import ForWhomSection from "./components/landing/ForWhomSection";
import FooterSection from "./components/landing/FooterSection";

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ForWhomSection />
      </main>
      <FooterSection />
    </>
  );
}
