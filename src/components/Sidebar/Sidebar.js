import { NavLink } from 'react-router-dom';
import topics from '../../data/topics';
import './Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__title">Թեմաներ</div>

      {topics.length === 0 ? (
        <div className="sidebar__empty">Դեռ թեմաներ չկան</div>
      ) : (
        <div className="sidebar__scroll">
          <ul className="sidebar__list">
            {topics.map((t) => (
              <li key={t.id}>
                <NavLink
                  className={({ isActive }) => (isActive ? 'sidebar__link is-active' : 'sidebar__link')}
                  to={t.id}
                >
                  <span className="sidebar__dot" aria-hidden="true" />
                  <span className="sidebar__linkText">{t.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
