import { BookOpen, Brain, Scale } from 'lucide-react';

function VisualMission() {
  return (
    <div className="about-visual about-visual--mission" aria-hidden>
      <div className="about-visual__mesh" />
      <div className="about-visual__card">
        <BookOpen className="about-visual__icon" strokeWidth={1.75} />
      </div>
      <span className="about-visual__ring" />
    </div>
  );
}

function VisualSkills() {
  return (
    <div className="about-visual about-visual--skills" aria-hidden>
      <div className="about-visual__mesh about-visual__mesh--violet" />
      <div className="about-visual__card about-visual__card--brain">
        <Brain className="about-visual__icon about-visual__icon--brain" strokeWidth={1.65} />
      </div>
      <span className="about-visual__ring about-visual__ring--violet" />
    </div>
  );
}

function VisualLogic() {
  return (
    <div className="about-visual about-visual--logic" aria-hidden>
      <div className="about-visual__mesh about-visual__mesh--teal" />
      <div className="about-visual__card about-visual__card--logic">
        <Scale className="about-visual__icon about-visual__icon--logic" strokeWidth={1.65} />
      </div>
      <span className="about-visual__ring about-visual__ring--teal" />
    </div>
  );
}

/**
 * Illustration for each block in SECTIONS (mission / skills / logic).
 */
export default function AboutSectionVisuals({ visual }) {
  if (visual === 'mission') return <VisualMission />;
  if (visual === 'skills') return <VisualSkills />;
  if (visual === 'logic') return <VisualLogic />;
  return null;
}
