import { useTranslation } from 'react-i18next';
import './Sidebar.css';

function Sidebar() {
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li>
            <a href="/">🏠 {t('nav.home')}</a>
          </li>
          <li>
            <a href="/topics">📚 {t('nav.topics')}</a>
          </li>
          <li>
            <a href="/lessons">📖 {t('nav.lessons')}</a>
          </li>
          <li>
            <a href="/practice">✍️ {t('nav.practice')}</a>
          </li>
          <li>
            <a href="/progress">📊 {t('nav.progress')}</a>
          </li>
          <li>
            <a href="/reference">📋 {t('nav.reference')}</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
