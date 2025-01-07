import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ResourcesSection } from "@/components/home/ResourcesSection";
import { CommunitySection } from "@/components/home/CommunitySection";

const Index = () => {
  return (
    <div className="min-h-screen bg-white font-poppins">
      <div className="pt-24 pb-16">
        <HeroSection />
        <FeaturesSection />
        <ResourcesSection />
        <CommunitySection />
      </div>
    </div>
  );
};

export default Index;