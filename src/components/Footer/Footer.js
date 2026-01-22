import './Footer.css';
import { aboutInfo } from '../../shared/aboutInfo';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__title">{aboutInfo.title}</div>
        {aboutInfo.paragraphs.map((p, idx) => (
          <p className="footer__text" key={idx}>
            {p}
          </p>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
