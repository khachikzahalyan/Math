import './LessonNav.css';

function LessonNav({ lessonSlug }) {
  return (
    <nav className="lesson-nav">
      <button>← Previous</button>
      <button>Next →</button>
    </nav>
  );
}

export default LessonNav;
