import { useEffect, useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { subscribeTopics } from '../../data/topicsRepo';
import './Sidebar.css';

const LEVELS = [1, 2, 3, 4, 5, 6];

function Sidebar() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeTopics(
      (list) => {
        setTopics(list);
        setLoading(false);
      },
      () => setLoading(false),
    );
    return unsub;
  }, []);

  const topicsByLevel = useMemo(() => {
    const m = new Map();
    LEVELS.forEach((l) => m.set(l, []));
    topics.forEach((t) => {
      if (m.has(t.level)) m.get(t.level).push(t);
    });
    return m;
  }, [topics]);

  const isEmpty = !loading && topics.length === 0;

  return (
    <aside className="sidebar">
      <div className="sidebar__title">Թեմաներ</div>

      {loading ? (
        <div className="sidebar__empty">Բեռնում...</div>
      ) : isEmpty ? (
        <div className="sidebar__empty">Դեռ թեմաներ չկան</div>
      ) : (
        <div className="sidebar__scroll">
          {LEVELS.map((level) => {
            const levelTopics = topicsByLevel.get(level) || [];
            if (levelTopics.length === 0) return null;

            return (
              <div key={level} className="sidebar__group">
                <div className="sidebar__groupTitle">Մակարդակ {level}</div>
                <ul className="sidebar__list">
                  {levelTopics.map((t, i) => (
                    <li key={t.id}>
                      <NavLink
                        className={({ isActive }) =>
                          isActive ? 'sidebar__link is-active' : 'sidebar__link'
                        }
                        to={t.id}
                      >
                        <span className="sidebar__linkNum">{level}.{i + 1}</span>
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
