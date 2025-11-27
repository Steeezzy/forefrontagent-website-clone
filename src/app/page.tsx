import NavigationHeader from '@/components/sections/navigation-header';
import AnnouncementBanner from '@/components/sections/announcement-banner';
import HeroSection from '@/components/sections/hero-section';
import ThreeCardStackSection from '@/components/sections/three-card-stack-section';
import StatsCardsSection from '@/components/sections/stats-cards-section';
import BrandStatementSection from '@/components/sections/brand-statement-section';
import AiComparisonSection from '@/components/sections/ai-comparison-section';
import TrustedBrandsCarousel from '@/components/sections/trusted-brands-carousel';
import TeamSolutionsSection from '@/components/sections/team-solutions-section';
import AiAgentComparisonSection from '@/components/sections/ai-agent-comparison-section';
import CaseStudyCardsSection from '@/components/sections/case-study-cards-section';
import GuaranteeBanner from '@/components/sections/guarantee-banner';
import ThreeStepsSection from '@/components/sections/three-steps-section';
import IntegrationsShowcaseSection from '@/components/sections/integrations-showcase-section';
import FinalCtaSection from '@/components/sections/final-cta-section';
import Footer from '@/components/sections/footer';
import CookieConsentBanner from '@/components/sections/cookie-consent-banner';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white font-inter">
      <NavigationHeader />
      <AnnouncementBanner />
      
      <div className="pt-[72px]">
        <HeroSection />
      </div>
      
      <ThreeCardStackSection />
      <StatsCardsSection />
      <BrandStatementSection />
      <AiComparisonSection />
      <TrustedBrandsCarousel />
      <TeamSolutionsSection />
      <AiAgentComparisonSection />
      
      <CaseStudyCardsSection />
      
      <section className="bg-white py-20">
        <div className="container">
          <GuaranteeBanner />
        </div>
      </section>
      
      <ThreeStepsSection />
      <IntegrationsShowcaseSection />
      <FinalCtaSection />
      <Footer />
      <CookieConsentBanner />
    </main>
  );
}