import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Layers, Shield } from "lucide-react";
import "./Footer.css";

const HIGHLIGHTS = [
  {
    Icon: BookOpen,
    text: "Քայլ առ քայլ՝ տեսությունից մինչև առաջադրանք",
  },
  {
    Icon: Layers,
    text: "Բազմաստիճան մակարդակներ և թեմաներ",
  },
  {
    Icon: Shield,
    text: "Առաջընթացը պահվում է այս սարքում, առանց գրանցման",
  },
];

/** Inline SVGs — փոխարինեք href-երը ձեր սոցիալ հղումներով */
const SOCIAL_LINKS = [
  {
    href: "https://www.facebook.com/",
    label: "Facebook",
    Icon: IconFacebook,
  },
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
    Icon: IconInstagram,
  },
  {
    href: "https://www.youtube.com/",
    label: "YouTube",
    Icon: IconYoutube,
  },
  {
    href: "https://t.me/",
    label: "Telegram",
    Icon: IconTelegram,
  },
];

function IconFacebook(props) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </svg>
  );
}

function IconInstagram(props) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 1-2.881.001 1.44 1.44 0 0 1 2.881-.001z"
      />
    </svg>
  );
}

function IconYoutube(props) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
      />
    </svg>
  );
}

function IconTelegram(props) {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.799-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"
      />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <div className="footer__brand">
          <span className="footer__title">Լոգիկա և մաթեմատիկա</span>
          <p className="footer__tagline">
            Ուսուցում առցանց՝ հստակ քայլերով։
          </p>
          <ul className="footer__social">
            {SOCIAL_LINKS.map(({ href, label, Icon }) => (
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
