import './About.css';
import { aboutInfo } from '../../shared/aboutInfo';

function About() {
  return (
    <div className="about">
      <h1 className="about__title">{aboutInfo.title}</h1>
      {aboutInfo.paragraphs.map((p, idx) => (
        <p className="about__text" key={idx}>
          {p}
        </p>
      ))}
    </div>
  );
}

export default About;
