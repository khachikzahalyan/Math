import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import topics from '../../data/topics';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);
  const searchInputRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const filteredTopics = searchQuery.trim()
    ? topics.filter((topic) =>
        topic.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

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
        document.documentElement.style.position = 'fixed';
        document.documentElement.style.width = '100%';
        document.documentElement.style.overflow = 'hidden';
      }
    };

    const handleBlur = () => {
      document.documentElement.style.position = '';
      document.documentElement.style.width = '';
      document.documentElement.style.overflow = '';
    };

    window.addEventListener('focusin', handleFocus);
    window.addEventListener('focusout', handleBlur);

    return () => {
      window.removeEventListener('focusin', handleFocus);
      window.removeEventListener('focusout', handleBlur);
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

  return (
    <header className="header">
      <div className="header__inner">
        <div
          className="header__logo"
          onClick={() => navigate('/')}
          role="button"
          tabIndex={0}
        >
          <img className="header__logoImg" src="/logoimg.png" alt="Մաթեմատիկա" />
          <span className="header__logoText">Մաթեմատիկական տրամաբանություն</span>
        </div>

        <div className="header__search header__search--mobile" ref={searchRef}>
          <div className="header__searchInput">
            <svg
              className="header__searchIcon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>

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

          {isSearchOpen && filteredTopics.length > 0 && (
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
          )}
        </div>

        <button
          className={`header__burger ${isMobileMenuOpen ? 'is-open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Меню"
          type="button"
        >
          <span className="header__burgerLine"></span>
          <span className="header__burgerLine"></span>
          <span className="header__burgerLine"></span>
        </button>

        <nav className={`header__nav ${isMobileMenuOpen ? 'is-open' : ''}`}>
          <NavLink
            className={({ isActive }) => (isActive ? 'header__link is-active' : 'header__link')}
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Գլխավոր
          </NavLink>
          
          <NavLink
            className={({ isActive }) => (isActive ? 'header__link is-active' : 'header__link')}
            to="/lessons"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Դասեր
          </NavLink>

          <NavLink
            className={({ isActive }) => (isActive ? 'header__link is-active' : 'header__link')}
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Մեր մասին
          </NavLink>

          <NavLink
            className={({ isActive }) => (isActive ? 'header__link is-active' : 'header__link')}
            to="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Կապ
          </NavLink>


          <div className="header__search header__search--desktop" ref={searchRef}>
            <div className="header__searchInput">
              <svg
                className="header__searchIcon"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>

              <input
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

            {isSearchOpen && filteredTopics.length > 0 && (
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
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
