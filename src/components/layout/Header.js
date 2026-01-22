import { useTranslation } from 'react-i18next';
import ThemeToggle from '../mode/ThemeToggle';
import LanguageSwitcher from '../language/LanguageSwitcher';
import './Header.css';

function Header() {
  const { t } = useTranslation();
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">
          <span className="logo-mark">λ</span>
          <div className="logo-text">
            <span className="logo-title">{t('header.logoTitle')}</span>
          </div>
        </div>

        <div className="header-actions">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

export default Header;
