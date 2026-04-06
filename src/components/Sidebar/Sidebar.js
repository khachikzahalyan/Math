import { NavLink } from 'react-router-dom';
import { getLevels, getTopicsByLevel } from '../../data/topicsUtils';
import './Sidebar.css';

function Sidebar() {
  const levels = getLevels();
  const topicsByLevel = getTopicsByLevel();

  return (
    <aside className="sidebar">
      <div className="sidebar__title">Թեմաներ</div>

      {levels.every((level) => (topicsByLevel.get(level) || []).length === 0) ? (
        <div className="sidebar__empty">Դեռ թեմաներ չկան</div>
      ) : (
        <div className="sidebar__scroll">
          {levels.map((level) => {
            const levelTopics = topicsByLevel.get(level) || [];
            if (levelTopics.length === 0) return null;

            return (
              <div key={level} className="sidebar__group">
                <div className="sidebar__groupTitle">Մակարդակ {level}</div>
                <ul className="sidebar__list">
                  {levelTopics.map((t) => (
                    <li key={t.id}>
                      <NavLink
                        className={({ isActive }) => (isActive ? 'sidebar__link is-active' : 'sidebar__link')}
                        to={t.id}
                      >
                        <span className="sidebar__linkText">{t.title}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
