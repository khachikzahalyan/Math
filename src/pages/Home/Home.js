import './Home.css';
import HeroSection from './HeroSection';
import StepsSection from './StepsSection';
import CTASection from './CTASection';

function Home() {
  return (
    <div className="mx-auto w-full max-w-[1160px] px-4 pb-6 pt-4 md:px-6 md:pt-6">
      <HeroSection />
      <StepsSection />
      <CTASection />
    </div>
  );
}

export default Home;
