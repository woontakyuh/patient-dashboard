import type { Metadata } from "next";
import LandingHeader from "../components/landing/LandingHeader";
import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import ForWhomSection from "../components/landing/ForWhomSection";
import FooterSection from "../components/landing/FooterSection";

export const metadata: Metadata = {
  title: "SpineTrack",
  description: "척추 수술 환자를 위한 맞춤형 회복 가이드",
};

export default function KoreanLandingPage() {
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
