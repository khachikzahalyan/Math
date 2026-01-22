import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LANGUAGE_KEY = 'language';

const LANGUAGES = [
  { code: 'hy', short: 'ARM', label: 'Հայերեն' },
  { code: 'ru', short: 'РУСС', label: 'Русский' },
  { code: 'en', short: 'ENG', label: 'English' },
];

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'hy';
  const stored = window.localStorage.getItem(LANGUAGE_KEY);
  if (stored && LANGUAGES.some((l) => l.code === stored)) {
    return stored;
  }
  return 'hy';
}

function applyLanguage(lang) {
  const root = document.documentElement;
  root.setAttribute('lang', lang);
  window.localStorage.setItem(LANGUAGE_KEY, lang);
}

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    applyLanguage(language);
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const handleChange = (code) => {
    setLanguage(code);
  };

  return (
    <div className="language-switcher" aria-label="Select language">
      {LANGUAGES.map((lang) => (
        <button
          key={lang.code}
          type="button"
          className={
            'language-pill' + (language === lang.code ? ' language-pill-active' : '')
          }
          onClick={() => handleChange(lang.code)}
          title={lang.label}
        >
          {lang.short}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
