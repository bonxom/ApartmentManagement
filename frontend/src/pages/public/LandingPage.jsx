import { Box } from '@mui/material';
import LandingNavbar from '../../feature/landing/LandingNavbar';
import HeroSection from '../../feature/landing/HeroSection';
import StatsSection from '../../feature/landing/StatsSection';
import FeaturesSection from '../../feature/landing/FeaturesSection';
import HowItWorksSection from '../../feature/landing/HowItWorksSection';
import TestimonialsSection from '../../feature/landing/TestimonialsSection';
import CTASection from '../../feature/landing/CTASection';
import LandingFooter from '../../feature/landing/LandingFooter';
// import './LandingPage.css';

function LandingPage() {
  return (
    <Box className="landing-page">
      <LandingNavbar />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
      <LandingFooter />
    </Box>
  );
}

export default LandingPage;
