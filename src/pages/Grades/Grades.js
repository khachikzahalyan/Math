import { useEffect, useState, useMemo } from 'react';
import {
  ChevronDown,
  ChevronUp,
  GraduationCap,
  BookOpen,
  Zap,
  Hourglass,
  Trophy,
  Sparkles,
} from 'lucide-react';
import { listAllProgress } from '../../data/progressRepo';
import { listTopics } from '../../data/topicsRepo';
import { STUDENT_AVATAR } from '../../utils/defaultAvatar';
import './Grades.css';

function gradeTier(percent) {
  if (percent >= 70) return 'good';
  if (percent >= 60) return 'mid';
  return 'low';
}

export default function Grades() {
  const [progress, setProgress] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([listAllProgress(), listTopics()])
      .then(([p, t]) => {
        setProgress(p);
        setTopics(t);
      })
      .catch(() => setError('Չհաջողվեց բեռնել տվյալները։'))
      .finally(() => setLoading(false));
  }, []);

  const topicById = useMemo(() => {
    const m = new Map();
    topics.forEach((t) => m.set(t.id, t));
    return m;
  }, [topics]);

  const { activeStudents, inactiveStudents } = useMemo(() => {
    const sortByName = (a, b) => (a.displayName || '').localeCompare(b.displayName || '');
    const totalTopics = topics.length;
    const active = [];
    const inactive = [];

    for (const s of progress) {
      const base = {
        uid: s.uid,
        displayName: s.displayName || s.email?.split('@')[0] || '—',
        email: s.email,
        photoURL: s.photoURL,
      };

      const byTopic = s.byTopic || {};
      const validAttempted = Object.entries(byTopic)
        .filter(([, v]) => (v?.attemptsCount || 0) > 0)
        .map(([id, v]) => ({ id, ...v, topic: topicById.get(id) }))
        .filter((a) => a.topic);

      if (validAttempted.length === 0) {
        inactive.push(base);
        continue;
      }

      validAttempted.sort(
        (a, b) =>
          a.topic.level - b.topic.level ||
          (a.topic.order || 0) - (b.topic.order || 0),
      );

      const topicsDone = validAttempted.length;
      const totalAttempts = validAttempted.reduce((acc, a) => acc + (a.attemptsCount || 0), 0);
      const sumBest = validAttempted.reduce((acc, a) => acc + (a.bestScore10 || 0), 0);
      const percent = Math.round((sumBest / topicsDone) * 10);
      const completion = totalTopics > 0 ? Math.round((topicsDone / totalTopics) * 100) : 0;
      const currentLevel = validAttempted.reduce(
        (max, a) => Math.max(max, a.topic?.level || 0),
        0,
      );

      active.push({
        ...base,
        topicsDone,
        totalTopics,
        totalAttempts,
        percent,
        completion,
        currentLevel,
        tier: gradeTier(percent),
        attempted: validAttempted.map((a) => ({
          ...a,
          bestTier: gradeTier((a.bestScore10 || 0) * 10),
        })),
      });
    }

    return {
      activeStudents: active.sort(sortByName),
      inactiveStudents: inactive.sort(sortByName),
    };
  }, [progress, topics, topicById]);

  if (loading) {
    return (
      <div className="grades-page" aria-hidden>
        <div className="grades-skel__titleBar" />
        <div className="grades-skel__subtitle" />
        <div className="grades-cards">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="grades-skel__card">
              <div className="grades-skel__user">
                <span className="grades-skel__avatar" />
                <div className="grades-skel__userText">
                  <span className="grades-skel__lineL" />
                  <span className="grades-skel__lineS" />
                </div>
              </div>
              <div className="grades-skel__stats">
                <span className="grades-skel__stat" />
                <span className="grades-skel__stat" />
                <span className="grades-skel__stat" />
              </div>
              <span className="grades-skel__toggle" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (error) return <div className="grades-page"><p style={{ color: '#dc2626' }}>{error}</p></div>;

  const totalStudents = activeStudents.length + inactiveStudents.length;

  return (
    <div className="grades-page">
      <div className="grades-header">
        <h1 className="grades-title">Մատյան</h1>
        <div className="grades-headStats">
          <span className="grades-headStat">
            <Sparkles size={14} className="grades-headStatIcon" />
            <strong>{activeStudents.length}</strong> ակտիվ
          </span>
          <span className="grades-headStat">
            <GraduationCap size={14} className="grades-headStatIcon" />
            <strong>{totalStudents}</strong> աշակերտ
          </span>
          <span className="grades-headStat">
            <BookOpen size={14} className="grades-headStatIcon" />
            <strong>{topics.length}</strong> թեմա
          </span>
        </div>
      </div>

      {totalStudents === 0 ? (
        <p className="grades-empty">
          Աշակերտներ դեռ չկան։ Աշակերտները կհայտնվեն մուտքից հետո։
        </p>
      ) : (
        <>
          {activeStudents.length > 0 ? (
            <div className="grades-cards">
              {activeStudents.map((s) => {
                const isOpen = expanded === s.uid;
                const { tier } = s;

                return (
                  <div key={s.uid} className={`grades-card grades-card--${tier}`}>
                    <button
                      type="button"
                      className="grades-cardHead"
                      onClick={() => setExpanded(isOpen ? null : s.uid)}
                    >
                      <div className="grades-cardUser">
                        <img
                          src={s.photoURL || STUDENT_AVATAR}
                          alt=""
                          className="grades-avatar"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = STUDENT_AVATAR;
                          }}
                        />
                        <div className="grades-userInfo">
                          <div className="grades-userName">{s.displayName}</div>
                          <div className="grades-userEmail">{s.email}</div>
                        </div>
                      </div>

                      <div className="grades-cardMid">
                        <div className="grades-progressRow">
                          <span className="grades-progressLabel">
                            <BookOpen size={13} />
                            Թեմաներ
                          </span>
                          <span className="grades-progressCount">
                            <strong>{s.topicsDone}</strong>
                            <span className="grades-progressTotal">/{s.totalTopics}</span>
                          </span>
                        </div>
                        <div className="grades-progressBar">
                          <div
                            className={`grades-progressFill grades-progressFill--${tier}`}
                            style={{ width: `${Math.max(s.completion, 3)}%` }}
                          />
                        </div>
                        <div className="grades-miniStats">
                          <span className="grades-miniStat">
                            <GraduationCap size={13} />
                            Մակարդակ {s.currentLevel || '—'}
                          </span>
                          <span className="grades-miniDot" aria-hidden>·</span>
                          <span className="grades-miniStat">
                            <Zap size={13} />
                            {s.totalAttempts} փորձ
                          </span>
                        </div>
                      </div>

                      <div className="grades-cardRight">
                        <div className={`grades-gradeChip grades-gradeChip--${tier}`}>
                          <Trophy size={14} className="grades-gradeChipIcon" />
                          <span className="grades-gradeChipValue">{s.percent}%</span>
                        </div>
                        <span className="grades-toggle" aria-hidden>
                          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="grades-cardBody">
                        <table className="grades-detailTable">
                          <thead>
                            <tr>
                              <th>Թեմա</th>
                              <th>Մակ.</th>
                              <th>Լավագույն</th>
                              <th>Վերջին</th>
                              <th>Փորձեր</th>
                            </tr>
                          </thead>
                          <tbody>
                            {s.attempted.map((a) => (
                              <tr key={a.id} className="grades-detailRow">
                                <td className="grades-detailTopic">{a.topic.title}</td>
                                <td>{a.topic.level}</td>
                                <td>
                                  <span className={`grades-scorePill grades-scorePill--${a.bestTier}`}>
                                    {a.bestScore10}/10
                                  </span>
                                </td>
                                <td>{a.lastScore10}/10</td>
                                <td>{a.attemptsCount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="grades-empty">
              Ակտիվ աշակերտներ դեռ չկան։
            </p>
          )}

          {inactiveStudents.length > 0 && (
            <section className="grades-inactive">
              <header className="grades-inactiveHead">
                <Hourglass size={14} className="grades-inactiveIcon" />
                <span className="grades-inactiveTitle">Չի սկսել</span>
                <span className="grades-inactiveCount">{inactiveStudents.length}</span>
              </header>
              <ul className="grades-inactiveList">
                {inactiveStudents.map((s) => (
                  <li key={s.uid} className="grades-inactivePill">
                    <img
                      src={s.photoURL || STUDENT_AVATAR}
                      alt=""
                      className="grades-inactiveAvatar"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = STUDENT_AVATAR;
                      }}
                    />
                    <div className="grades-inactiveInfo">
                      <span className="grades-inactiveName">{s.displayName}</span>
                      <span className="grades-inactiveEmail">{s.email}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
