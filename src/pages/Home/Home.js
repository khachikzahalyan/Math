import { useState } from 'react';
import HeroSection from './HeroSection';
import BenefitsSection from './BenefitsSection';
import CurriculumSection from './CurriculumSection';
import CTASection from './CTASection';

function Home() {
  const [quizStartCounter, setQuizStartCounter] = useState(0);

  const handleStartQuiz = () => {
    setQuizStartCounter((v) => v + 1);
  };

  return (
    <div className="mx-auto w-full max-w-[1160px] px-4 pb-10 pt-4 md:px-6 md:pt-6">
      <HeroSection onStartQuiz={handleStartQuiz} />
      <BenefitsSection />
      <CurriculumSection />
      <CTASection externalStartCounter={quizStartCounter} />
      <div className="h-3" />
    </div>
  );
}

export default Home;