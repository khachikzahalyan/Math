import './Home.css';
import './ProgressWidgets.css';
import HeroSection from './HeroSection';
import HomeJourney from './HomeJourney';
import AchievementsSection from './AchievementsSection';
import StepsSection from './StepsSection';
import DailyChallenge from './DailyChallenge';
import CTASection from './CTASection';

function Home() {
  return (
    <div className="home-page mx-auto w-full min-w-0 max-w-[1160px] px-3 pb-8 pt-2 sm:px-4 md:px-6 md:pt-6">
      <HeroSection />
      <HomeJourney />
      <AchievementsSection />
      <StepsSection />
      <DailyChallenge />
      <CTASection />
    </div>
  );
}

export default Home;
