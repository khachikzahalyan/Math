import { useEffect, useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, GraduationCap, BookOpen, Percent } from 'lucide-react';
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

  const students = useMemo(() => {
    return [...progress]
      .map((s) => {
        const byTopic = s.byTopic || {};
        const attempted = Object.entries(byTopic)
          .filter(([, v]) => (v?.attemptsCount || 0) > 0)
          .map(([id, v]) => ({ id, ...v, topic: topicById.get(id) }));
        const validAttempted = attempted.filter((a) => a.topic);

        const topicsDone = validAttempted.length;
        const totalTopics = topics.length;

        const sumBest = validAttempted.reduce((acc, a) => acc + (a.bestScore10 || 0), 0);
        const percent = topicsDone > 0 ? Math.round((sumBest / topicsDone) * 10) : 0;

        const currentLevel = validAttempted.reduce(
          (max, a) => Math.max(max, a.topic?.level || 0),
          0,
        );

        return {
          uid: s.uid,
          displayName: s.displayName || s.email?.split('@')[0] || '—',
          email: s.email,
          photoURL: s.photoURL,
          topicsDone,
          totalTopics,
          percent,
          currentLevel,
          attempted: validAttempted,
        };
      })
      .sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));
  }, [progress, topics, topicById]);

  if (loading) return <div className="grades-page"><p>Բեռնում...</p></div>;
  if (error) return <div className="grades-page"><p style={{ color: '#dc2626' }}>{error}</p></div>;

  return (
    <div className="grades-page">
      <h1 className="grades-title">Մատյան</h1>
      <p className="grades-subtitle">
        {students.length} աշակերտ • {topics.length} թեմա
      </p>

      {students.length === 0 ? (
        <p className="grades-empty">
          Աշակերտներ դեռ չկան։ Աշակերտները կհայտնվեն մուտքից հետո։
        </p>
      ) : (
        <div className="grades-cards">
          {students.map((s) => {
            const isOpen = expanded === s.uid;
            const tier = gradeTier(s.percent);

            return (
              <div key={s.uid} className="grades-card">
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

                  <div className="grades-stats">
                    <div className="grades-stat">
                      <GraduationCap size={15} className="grades-statIcon" />
                      <span className="grades-statLabel">Մակարդակ</span>
                      <span className="grades-statValue">{s.currentLevel || '—'}</span>
                    </div>
                    <div className="grades-stat">
                      <BookOpen size={15} className="grades-statIcon" />
                      <span className="grades-statLabel">Թեմաներ</span>
                      <span className="grades-statValue">
                        {s.topicsDone}<span className="grades-statTotal">/{s.totalTopics}</span>
                      </span>
                    </div>
                    <div className={`grades-stat grades-stat--grade grades-stat--${tier}`}>
                      <Percent size={15} className="grades-statIcon" />
                      <span className="grades-statLabel">Գնահատական</span>
                      <span className="grades-statValue">{s.percent}%</span>
                    </div>
                  </div>

                  <span className="grades-toggle" aria-hidden>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </button>

                {isOpen && (
                  <div className="grades-cardBody">
                    {s.attempted.length === 0 ? (
                      <p className="grades-noAttempts">Դեռ չի կատարել ոչ մի թեմա։</p>
                    ) : (
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
                          {s.attempted
                            .sort((a, b) => (a.topic.level - b.topic.level) || (a.topic.order - b.topic.order))
                            .map((a) => (
                              <tr key={a.id} className="grades-detailRow">
                                <td className="grades-detailTopic">{a.topic.title}</td>
                                <td>{a.topic.level}</td>
                                <td><strong>{a.bestScore10}</strong>/10</td>
                                <td>{a.lastScore10}/10</td>
                                <td>{a.attemptsCount}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
