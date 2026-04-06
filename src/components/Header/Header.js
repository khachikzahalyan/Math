import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Brain, Search, Home, BookOpen, Users, Mail } from 'lucide-react';
import topics from '../../data/topics';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const filteredTopics = searchQuery.trim()
    ? topics.filter((topic) =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleClickOutsideMenu = (e) => {
      if (
        isMobileMenuOpen &&
        !e.target.closest('.header__nav') &&
        !e.target.closest('.header__burger')
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

  const handleSelectTopic = (topicId) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/lessons/${topicId}`);
  };

  const handleSearchInputBlur = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsSearchOpen(false);
    }, 100);
  };

  const handleSearchItemMouseDown = (e, topicId) => {
    e.preventDefault();
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    handleSelectTopic(topicId);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((p) => !p);

  const NAV_ITEMS = [
    { to: '/', Icon: Home, label: 'Գլխավոր' },
    { to: '/lessons', Icon: BookOpen, label: 'Դասեր' },
    { to: '/about', Icon: Users, label: 'Մեր մասին' },
    { to: '/contact', Icon: Mail, label: 'Կապ' },
  ];

  const searchInput = (
    <div className="header__searchInput">
      <Search size={16} className="header__searchIcon" strokeWidth={2.4} />
      <input
        ref={searchInputRef}
        type="text"
        placeholder="Որոնել թեմա..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setIsSearchOpen(true);
        }}
        onFocus={() => {
          if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
          }
          setIsSearchOpen(true);
        }}
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
          onClick={() => navigate('/')}
          role="button"
          tabIndex={0}
        >
          <div className="header__logoMark">
            <Brain size={20} strokeWidth={2.4} />
          </div>
          <span className="header__logoText">Մաթեմատիկական տրամաբանություն</span>
        </div>

        <div className="header__search header__search--mobile" ref={searchRef}>
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
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Icon size={16} strokeWidth={2} className="header__linkIcon" />
              {label}
            </NavLink>
          ))}

          <div className="header__search header__search--desktop" ref={searchRef}>
            {searchInput}
            {searchDropdown}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
