import './LessonContent.css';

function LessonContent({ lesson }) {
  return (
    <section className="lesson-content">
      <h1>{lesson?.title}</h1>
      <div>{lesson?.content}</div>
    </section>
  );
}

export default LessonContent;
