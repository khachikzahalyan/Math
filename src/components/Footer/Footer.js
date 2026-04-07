import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers, Shield } from 'lucide-react';
import SiteLogoMark from '../SiteLogoMark/SiteLogoMark';
import { FOOTER_SOCIAL_LINKS } from './FooterSocialIcons';
import './Footer.css';

const HIGHLIGHTS = [
  {
    Icon: BookOpen,
    text: 'Քայլ առ քայլ՝ տեսությունից մինչև առաջադրանք',
  },
  {
    Icon: Layers,
    text: 'Բազմաստիճան մակարդակներ և թեմաներ',
  },
  {
    Icon: Shield,
    text: 'Առաջընթացը պահվում է այս սարքում, առանց գրանցման',
  },
];

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <div className="footer__brand">
          <div className="footer__brandRow">
            <div className="footer__logoMark" aria-hidden>
              <SiteLogoMark />
            </div>
            <div className="footer__brandText">
              <span className="footer__title">Լոգիկա և մաթեմատիկա</span>
              <p className="footer__tagline">Ուսուցում առցանց՝ հստակ քայլերով։</p>
            </div>
          </div>
          <ul className="footer__social">
            {FOOTER_SOCIAL_LINKS.map(({ href, label, Icon }) => (
              <li key={label} className="footer__socialItem">
                <a
                  className="footer__socialLink"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                >
                  <Icon className="footer__socialIcon" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__mid">
          <nav className="footer__nav" aria-label="Կայքի նավիգացիա">
            <Link className="footer__link" to="/">
              Գլխավոր
            </Link>
            <Link className="footer__link" to="/lessons">
              Դասեր
            </Link>
            <Link className="footer__link" to="/about">
              Մեր մասին
            </Link>
            <Link className="footer__link" to="/contact">
              Կապ
            </Link>
          </nav>

          <ul className="footer__highlights">
            {HIGHLIGHTS.map(({ Icon, text }) => (
              <li key={text} className="footer__highlight">
                <span className="footer__highlightIcon" aria-hidden>
                  <Icon size={15} strokeWidth={2.2} />
                </span>
                <span className="footer__highlightText">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
