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

  const handleSelectTopic = (topicId) => {
    setSearchQuery('');
    setIsSearchOpen(false);
    navigate(`/lessons/${topicId}`);
  };
  // Закрыть мобильное меню при клике вне него
  useEffect(() => {
    const handleClickOutsideMenu = (e) => {
      if (isMobileMenuOpen && !e.target.closest('.header__nav') && !e.target.closest('.header__burger')) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideMenu);
    return () => document.removeEventListener('mousedown', handleClickOutsideMenu);
  }, [isMobileMenuOpen]);

  // Закрыть меню при изменении размера экрана
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img className="header__logoImg" src="/logoimg.png" alt="Մաթեմատիկա" />
          <span className="header__logoText">Մաթեմատիկա</span>
        </div>

        {/* Бургер-кнопка */}
        <button className={`header__burger ${isMobileMenuOpen ? 'is-open' : ''}`} onClick={toggleMobileMenu} aria-label="Меню">
          <span className="header__burgerLine"></span>
          <span className="header__burgerLine"></span>
          <span className="header__burgerLine"></span>
        </button>

        <nav className={`header__nav ${isMobileMenuOpen ? 'is-open' : ''}`}>
          <NavLink className={({ isActive }) => (isActive ? 'header__link is-active' : 'header__link')} to="/" onClick={closeMobileMenu}>
            Գլխավոր
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'header__link is-active' : 'header__link')} to="/about" onClick={closeMobileMenu}>
            Մեր մասին
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'header__link is-active' : 'header__link')} to="/contact" onClick={closeMobileMenu}>
            Կապ
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'header__link is-active' : 'header__link')} to="/lessons" onClick={closeMobileMenu}>
            Դասեր
          </NavLink>

          <div className="header__search" ref={searchRef}>
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
                onFocus={() => setIsSearchOpen(true)}
              />
            </div>

            {isSearchOpen && filteredTopics.length > 0 && (
              <div className="header__searchDropdown">
                {filteredTopics.map((topic) => (
                  <button
                    key={topic.id}
                    className="header__searchItem"
                    onClick={() => handleSelectTopic(topic.id)}
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
