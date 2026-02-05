import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import topics from '../../data/topics';
import './Lessons.css';

function Lessons() {
  const [selectedLevel, setSelectedLevel] = useState(null);

  const levels = useMemo(() => {
    return [...new Set(topics.map(t => t.grade))]
      .filter((level) => Number.isFinite(level))
      .sort((a, b) => a - b);
  }, []);

  const filteredTopics = useMemo(() => {
    if (selectedLevel == null) return [];
    return topics.filter(t => t.grade === selectedLevel);
  }, [selectedLevel]);

  if (selectedLevel === null) {
    return (
      <div className="lessons">
        <h1 className="lessons__title">Դասեր</h1>
        <p className="lessons__subtitle">Ընտրեք մակարդակը սկսելու համար։</p>
        <div className="lessons__categoriesContainer">
          {levels.map((level) => (
            <button
              key={level}
              type="button"
              className="lessons__categoryBtn"
              onClick={() => setSelectedLevel(level)}
            >
              <span className="lessons__categoryNumber">{level}</span>
              <span className="lessons__categoryLabel">Մակարդակ</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="lessons">
      <button 
        className="lessons__backBtn" 
        onClick={() => setSelectedLevel(null)}
        type="button"
      >
        ← Վերադառնալ
      </button>
      <h1 className="lessons__title">Մակարդակ {selectedLevel}</h1>
      <p className="lessons__subtitle">Ընտրեք թեմա ուսումնասիրելու համար։</p>
      <div className="lessons__grid">
        {filteredTopics.map((t) => (
          <div className="lessons__card" key={t.id}>
            <h3 className="lessons__cardTitle">{t.title}</h3>
            <p className="lessons__cardText">{t.description}</p>
            <div className="lessons__cardFooter">
              <Link className="lessons__cardLink" to={t.id}>
                Բացել
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Lessons;
