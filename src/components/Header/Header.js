import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Search, Home, BookOpen, Users, Mail } from 'lucide-react';
import SiteLogoMark from '../SiteLogoMark/SiteLogoMark';
import topics from '../../data/topics';
import './Header.css';

const NAV_ITEMS = [
  { to: '/', Icon: Home, label: 'Գլխավոր' },
  { to: '/lessons', Icon: BookOpen, label: 'Դասեր' },
  { to: '/about', Icon: Users, label: 'Մեր մասին' },
  { to: '/contact', Icon: Mail, label: 'Կապ' },
];

function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRefMobile = useRef(null);
  const searchRefDesktop = useRef(null);
  const searchInputRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const filteredTopics = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return topics.filter((topic) => topic.title.toLowerCase().includes(q));
  }, [searchQuery]);

  useEffect(() => {
    let rafId = null;
    const handleScroll = () => {
      if (rafId != null) return;
      rafId = window.requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        rafId = null;
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId != null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const t = e.target;
      const insideMobile = searchRefMobile.current?.contains(t);
      const insideDesktop = searchRefDesktop.current?.contains(t);
      if (insideMobile || insideDesktop) return;
      setIsSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutsideMenu = (e) => {
      const t = e.target;
      if (
        isMobileMenuOpen &&
        !t.closest('.header__nav') &&
        !t.closest('.header__burger')
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideMenu);
    return () => document.removeEventListener('mousedown', handleClickOutsideMenu);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      if (document.activeElement?.tagName === 'INPUT') {
        document.body.classList.add('keyboard-open');
      }
    };

    const handleBlur = () => {
      document.body.classList.remove('keyboard-open');
    };

    window.addEventListener('focusin', handleFocus);
    window.addEventListener('focusout', handleBlur);

    return () => {
      window.removeEventListener('focusin', handleFocus);
      window.removeEventListener('focusout', handleBlur);
      document.body.classList.remove('keyboard-open');
    };
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const handleSelectTopic = useCallback((topicId) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/lessons/${topicId}`);
  }, [navigate]);

  const handleSearchInputBlur = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsSearchOpen(false);
    }, 100);
  }, []);

  const handleSearchItemMouseDown = useCallback(
    (e, topicId) => {
      e.preventDefault();
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      handleSelectTopic(topicId);
    },
    [handleSelectTopic],
  );

  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen((p) => !p), []);

  const closeMobileNav = useCallback(() => setIsMobileMenuOpen(false), []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
    setIsSearchOpen(true);
  }, []);

  const handleSearchFocus = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setIsSearchOpen(true);
  }, []);

  const goHome = useCallback(() => navigate('/'), [navigate]);

  const searchInput = (
    <div className="header__searchInput">
      <span className="header__searchIconWrap" aria-hidden>
        <Search size={17} className="header__searchIcon" strokeWidth={2.25} />
      </span>
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Որոնել թեմա..."
        value={searchQuery}
        onChange={handleSearchChange}
        onFocus={handleSearchFocus}
        onBlur={handleSearchInputBlur}
        spellCheck="false"
        autoComplete="off"
        inputMode="search"
      />
    </div>
  );

  const searchDropdown = isSearchOpen && filteredTopics.length > 0 && (
    <div className="header__searchDropdown">
      {filteredTopics.map((topic) => (
        <button
          key={topic.id}
          className="header__searchItem"
          onMouseDown={(e) => handleSearchItemMouseDown(e, topic.id)}
          onTouchEnd={(e) => handleSearchItemMouseDown(e, topic.id)}
          onClick={(e) => {
            e.preventDefault();
            handleSearchItemMouseDown(e, topic.id);
          }}
          type="button"
          role="option"
          aria-selected={false}
        >
          <span className="header__searchItemTitle">{topic.title}</span>
          <span className="header__searchItemDesc">{topic.description}</span>
        </button>
      ))}
    </div>
  );

  return (
    <header className={`header${scrolled ? ' header--scrolled' : ''}`}>
      <div className="header__inner">
        <div
          className="header__logo"
          onClick={goHome}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              goHome();
            }
          }}
          role="button"
          tabIndex={0}
        >
          <div className="header__logoMark" aria-hidden>
            <SiteLogoMark />
          </div>
          <span className="header__logoText">Լոգիկա և մաթեմատիկա</span>
        </div>

        <div className="header__search header__search--mobile" ref={searchRefMobile}>
          {searchInput}
          {searchDropdown}
        </div>

        <button
          className={`header__burger ${isMobileMenuOpen ? 'is-open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Menu"
          type="button"
        >
          <span className="header__burgerLine" />
          <span className="header__burgerLine" />
          <span className="header__burgerLine" />
        </button>

        <nav className={`header__nav ${isMobileMenuOpen ? 'is-open' : ''}`}>
          {NAV_ITEMS.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              className={({ isActive }) =>
                `header__link${isActive ? ' is-active' : ''}`
              }
              to={to}
              onClick={closeMobileNav}
            >
              <Icon size={16} strokeWidth={2} className="header__linkIcon" />
              {label}
            </NavLink>
          ))}

          <div className="header__search header__search--desktop" ref={searchRefDesktop}>
            {searchInput}
            {searchDropdown}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
