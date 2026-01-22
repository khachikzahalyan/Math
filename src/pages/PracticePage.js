import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { exercises } from '../data/exercises';
import { PRACTICE_MODES, ExerciseGenerator } from '../lib/exerciseGenerator';
import PracticeMode from '../components/practice/PracticeMode';
import './PracticePage.css';

function PracticePage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [activeMode, setActiveMode] = useState(null);
  const [generatedTasks, setGeneratedTasks] = useState([]);

  const categories = [
    { value: 'Տրամաբանական կապեր', label: t('practicePage.category.logicalConnectives') },
    { value: 'Տրամաբանական համարժեքություն', label: t('practicePage.category.equivalence') },
    { value: 'Տավտոլոգիա', label: t('practicePage.category.tautology') },
    { value: 'Տեքստ մեջ բանաձև', label: t('practicePage.category.textToFormula') },
  ];

  const filteredExercises = useMemo(() => {
    return exercises.filter((exercise) => {
      const categoryMatch =
        selectedCategory === 'all' || exercise.category === selectedCategory;
      const difficultyMatch =
        selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
      return categoryMatch && difficultyMatch;
    });
  }, [selectedCategory, selectedDifficulty]);

  const generateTasks = (count) => {
    const tasks = [];
    for (let i = 0; i < count; i++) {
      const type = Math.floor(Math.random() * 5);
      let task;

      switch (type) {
        case 0:
          task = ExerciseGenerator.generateEquivalenceTask();
          break;
        case 1:
          task = ExerciseGenerator.generateNormalFormTask();
          break;
        case 2:
          task = ExerciseGenerator.generateTextToFormulaTask();
          break;
        case 3:
          task = ExerciseGenerator.generateTautologyTask();
          break;
        default:
          task = {
            type: 'truthTable',
            question: t('practicePage.generateTruthTableQuestion'),
            table: ExerciseGenerator.generateTruthTable(2),
          };
      }

      tasks.push({ ...task, id: i });
    }
    return tasks;
  };

  const handleStartMode = (modeId) => {
    const mode = PRACTICE_MODES[modeId.toUpperCase()];
    const tasks = generateTasks(mode.count || 5);
    setGeneratedTasks(tasks);
    setActiveMode(modeId);
  };

  if (activeMode) {
    return (
      <PracticeMode
        mode={PRACTICE_MODES[activeMode.toUpperCase()]}
        tasks={generatedTasks}
        onExit={() => {
          setActiveMode(null);
          setGeneratedTasks([]);
        }}
      />
    );
  }

  const difficultyLabel = (diff) => {
    return t(`common.difficulty.${diff}`) || diff;
  };

  return (
    <div className="practice-page">
      <header className="practice-hero">
        <h1 className="practice-title">{t('practicePage.title')}</h1>
        <p className="practice-subtitle">
          {t('practicePage.subtitle')}
        </p>
      </header>

      <section className="practice-section">
        <div className="section-head">
          <h2 className="section-title">{t('practicePage.modesTitle')}</h2>
          <p className="section-subtitle">{t('practicePage.modesSubtitle')}</p>
        </div>

        <div className="modes-grid">
          <button
            type="button"
            className="mode-card"
            onClick={() => handleStartMode('quick')}
          >
            <div className="mode-top">
              <h3 className="mode-title">{PRACTICE_MODES.QUICK.name}</h3>
              <span className="mode-pill">{t('practicePage.quickBadge')}</span>
            </div>
            <p className="mode-info">{t('practicePage.quickInfo')}</p>
            <span className="mode-cta">{t('common.start')}</span>
          </button>

          <button
            type="button"
            className="mode-card"
            onClick={() => handleStartMode('exam')}
          >
            <div className="mode-top">
              <h3 className="mode-title">{PRACTICE_MODES.EXAM.name}</h3>
              <span className="mode-pill">{t('practicePage.examBadge')}</span>
            </div>
            <p className="mode-info">{t('practicePage.examInfo')}</p>
            <span className="mode-cta">{t('common.start')}</span>
          </button>

          <button
            type="button"
            className="mode-card"
            onClick={() => handleStartMode('errors')}
          >
            <div className="mode-top">
              <h3 className="mode-title">{PRACTICE_MODES.ERRORS.name}</h3>
              <span className="mode-pill">{t('practicePage.errorsBadge')}</span>
            </div>
            <p className="mode-info">{t('practicePage.errorsInfo')}</p>
            <span className="mode-cta">{t('common.open')}</span>
          </button>
        </div>
      </section>

      <section className="practice-section">
        <div className="section-head">
          <h2 className="section-title">{t('practicePage.labTitle')}</h2>
          <p className="section-subtitle">
            {t('practicePage.labSubtitle')}
          </p>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label htmlFor="category-filter">{t('practicePage.filterCategory')}</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">{t('practicePage.filterAll')}</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="difficulty-filter">{t('practicePage.filterDifficulty')}</label>
            <select
              id="difficulty-filter"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="all">{t('practicePage.filterAll')}</option>
              <option value="beginner">{t('common.difficulty.beginner')}</option>
              <option value="intermediate">{t('common.difficulty.intermediate')}</option>
              <option value="advanced">{t('common.difficulty.advanced')}</option>
              <option value="expert">{t('common.difficulty.expert')}</option>
            </select>
          </div>

          <div className="filter-info">
            <span className="filter-count">{filteredExercises.length}</span>
            <span className="filter-label">
              {filteredExercises.length === 1
                ? t('practicePage.exercisesOne')
                : t('practicePage.exercisesMany')}
            </span>
          </div>
        </div>

        <div className="exercises-list">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <div key={exercise.id} className="exercise-card">
                <div className="exercise-header">
                  <h3 className="exercise-title">{exercise.title}</h3>
                  <span className={`difficulty-badge diff-${exercise.difficulty}`}>
                    {difficultyLabel(exercise.difficulty)}
                  </span>
                </div>

                <p className="exercise-description">{exercise.description}</p>

                <div className="exercise-footer">
                  <span className="category-tag">{exercise.category}</span>
                  <button type="button" className="solve-btn">
                    {t('common.solve')}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>{t('common.noExercises')}</p>
            </div>
          )}
        </div>
      </section>

      <section className="practice-section">
        <div className="section-head section-head-center">
          <h2 className="section-title">{t('practicePage.tipsTitle')}</h2>
          <p className="section-subtitle">{t('practicePage.tipsSubtitle')}</p>
        </div>

        <div className="tips-grid">
          <div className="tip">
            <h4>{t('practicePage.tip1Title')}</h4>
            <p>{t('practicePage.tip1Text')}</p>
          </div>

          <div className="tip">
            <h4>{t('practicePage.tip2Title')}</h4>
            <p>{t('practicePage.tip2Text')}</p>
          </div>

          <div className="tip">
            <h4>{t('practicePage.tip3Title')}</h4>
            <p>{t('practicePage.tip3Text')}</p>
          </div>

          <div className="tip">
            <h4>{t('practicePage.tip4Title')}</h4>
            <p>{t('practicePage.tip4Text')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PracticePage;
