import { useEffect, useMemo, useState } from 'react';
import { Award, Layers } from 'lucide-react';
import { getProgressStats, subscribeProgress } from '../../utils/progressStorage';

const BADGES = [
  {
    id: 'q10',
    Icon: Award,
    title: '10 հարց պատասխանված',
    description: 'Պատասխանեք տարբեր հարցերի՝ թեստերում կամ դասերում։',
    isUnlocked: (s) => s.answeredCount >= 10,
    progress: (s) => Math.min(100, Math.round((s.answeredCount / 10) * 100)),
    progressLabel: (s) => `${Math.min(s.answeredCount, 10)} / 10`,
  },
  {
    id: 'levels6',
    Icon: Layers,
    title: 'Բոլոր մակարդակները բացված',
    description: 'Բացեք բոլոր 6 մակարդակները «Դասեր» էջում։',
    isUnlocked: (s) => s.hasAllLevels,
    progress: (s) => (s.hasAllLevels ? 100 : Math.round((s.visitedLevels.length / 6) * 100)),
    progressLabel: (s) => `${s.visitedLevels.length} / 6`,
  },
];

function AchievementsSection() {
  const [tick, setTick] = useState(0);

  useEffect(() => subscribeProgress(() => setTick((n) => n + 1)), []);

  const stats = useMemo(() => {
    void tick;
    return getProgressStats();
  }, [tick]);

  return (
    <section className="achievements" aria-labelledby="achievements-heading">
      <h2 id="achievements-heading" className="achievements__title">
        Ձեր նվաճումները
      </h2>
      <p className="achievements__sub">
        Տվյալները պահվում են այս սարքում։ Շարունակեք սովորել՝ նոր նշաններ բացելու համար։
      </p>
      <ul className="achievements__grid">
        {BADGES.map((b) => {
          const unlocked = b.isUnlocked(stats);
          const Icon = b.Icon;
          return (
            <li
              key={b.id}
              className={`achievements__card ${unlocked ? 'achievements__card--open' : 'achievements__card--locked'}`}
            >
              <div className="achievements__iconWrap">
                <Icon className="achievements__icon" size={26} strokeWidth={2} aria-hidden />
              </div>
              <div className="achievements__body">
                <p className="achievements__badgeTitle">{b.title}</p>
                <p className="achievements__desc">{b.description}</p>
                <div className="achievements__meter" aria-hidden={unlocked}>
                  <div
                    className="achievements__meterFill"
                    style={{ width: `${b.progress(stats)}%` }}
                  />
                </div>
                <p className="achievements__meterLabel">{b.progressLabel(stats)}</p>
              </div>
              {unlocked && <span className="achievements__check">✓</span>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default AchievementsSection;
