import "./SiteLogoMark.css";

/**
 * Լոգիկա + մաթեմատիկա․ երկու հավաքի հատում (տրամաբանություն) և «հավասար» նշանը կենտրոնում։
 * Ոչ մոտոցենտրիկ, ոչ գրադարանային իկոն — միայն այս կայքի համար։
 */
function SiteLogoMark({ className = "" }) {
  return (
    <svg
      className={`siteLogoMark ${className}`.trim()}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g
        className="siteLogoMark__g"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle className="siteLogoMark__ring" cx="11.4" cy="16" r="7.4" fill="none" strokeWidth="2.15" />
        <circle className="siteLogoMark__ring" cx="20.6" cy="16" r="7.4" fill="none" strokeWidth="2.15" />
        <path
          className="siteLogoMark__eq"
          d="M14.1 14.65h3.8M14.1 17.35h3.8"
          strokeWidth="1.85"
        />
      </g>
    </svg>
  );
}

export default SiteLogoMark;
