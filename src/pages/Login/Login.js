import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import SiteLogoMark from '../../components/SiteLogoMark/SiteLogoMark';
import './Login.css';

const HERO_FORMULAS = [
  { text: 'e^{iπ} + 1 = 0', top: '7%',  left: '4%'  },
  { text: 'a² + b² = c²',   top: '14%', left: '62%' },
  { text: '∫ f(x) dx',      top: '78%', left: '6%'  },
  { text: 'φ = (1+√5)/2',   top: '86%', left: '58%' },
];

function GoogleGlyph() {
  return (
    <svg className="login-card__btnG" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function HeroPlot() {
  return (
    <svg
      className="login-hero__plot"
      viewBox="0 0 600 380"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="loginCurveA" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#fbcfe8" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="loginCurveB" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#fde68a" stopOpacity="0.9"  />
          <stop offset="100%" stopColor="#fcd34d" stopOpacity="0.75" />
        </linearGradient>
        <radialGradient id="loginVenn" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0"    />
        </radialGradient>
      </defs>

      {/* axes */}
      <g stroke="rgba(255,255,255,0.22)" strokeWidth="1">
        <line x1="0"   y1="190" x2="600" y2="190" />
        <line x1="300" y1="0"   x2="300" y2="380" />
      </g>

      {/* ticks */}
      <g stroke="rgba(255,255,255,0.18)" strokeWidth="1">
        {[60, 120, 180, 240, 360, 420, 480, 540].map((x) => (
          <line key={`vx-${x}`} x1={x} y1="185" x2={x} y2="195" />
        ))}
        {[40, 90, 140, 240, 290, 340].map((y) => (
          <line key={`vy-${y}`} x1="295" y1={y} x2="305" y2={y} />
        ))}
      </g>

      {/* sine wave */}
      <path
        d="M0,190 C50,90 100,90 150,190 S250,290 300,190 S400,90 450,190 S550,290 600,190"
        fill="none"
        stroke="url(#loginCurveA)"
        strokeWidth="2.4"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* parabola */}
      <path
        d="M40,360 Q300,-180 560,360"
        fill="none"
        stroke="url(#loginCurveB)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* venn watermark — echoes brand logo */}
      <g opacity="0.55">
        <circle cx="220" cy="300" r="120" fill="url(#loginVenn)" stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" />
        <circle cx="320" cy="300" r="120" fill="url(#loginVenn)" stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" />
      </g>

      {/* small dots at extrema */}
      <g fill="#fff">
        <circle cx="150" cy="190" r="2.5" opacity="0.65" />
        <circle cx="300" cy="190" r="3"   opacity="0.85" />
        <circle cx="450" cy="190" r="2.5" opacity="0.65" />
      </g>
    </svg>
  );
}

export default function Login() {
  const { user, signIn, loading } = useAuth();
  const location = useLocation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from || '/lessons';

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  const handleSignIn = async () => {
    setBusy(true);
    setError('');
    try {
      await signIn();
    } catch (e) {
      const code = e?.code || '';
      let msg = 'Մուտքը չհաջողվեց։ Փորձեք կրկին։';
      if (code === 'auth/operation-not-allowed') {
        msg = 'Google մուտքը միացված չէ Firebase Console-ում։ (auth/operation-not-allowed)';
      } else if (code === 'auth/unauthorized-domain') {
        msg = 'Տվյալ դոմենը թույլատրված չէ Firebase-ում։ (auth/unauthorized-domain)';
      } else if (code === 'auth/invalid-api-key' || code === 'auth/api-key-not-valid') {
        msg = 'Firebase API key սխալ է (ստուգեք .env.local)։';
      } else if (code === 'auth/network-request-failed') {
        msg = 'Ցանցի սխալ։ Ստուգեք ինտերնետը։';
      } else if (code === 'auth/configuration-not-found') {
        msg = 'Firebase-ի կարգավորումները չեն գտնվել։ Ստուգեք .env.local և Console-ը։';
      } else if (code) {
        msg = `Մուտքի սխալ՝ ${code}`;
      }
      setError(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-page__noise" aria-hidden="true" />

      <div className="login-shell">
        <aside className="login-hero">
          <HeroPlot />

          <div className="login-hero__formulas" aria-hidden="true">
            {HERO_FORMULAS.map((f, i) => (
              <span
                key={i}
                className="login-hero__formula"
                style={{ top: f.top, left: f.left, animationDelay: `${i * 1.4}s` }}
              >
                {f.text}
              </span>
            ))}
          </div>

          <div className="login-hero__top">
            <div className="login-hero__brand">
              <span className="login-hero__logoMark">
                <SiteLogoMark />
              </span>
              <span className="login-hero__brandText">
                <span className="login-hero__brandTitle">Լոգիկա և մաթեմատիկա</span>
                <span className="login-hero__brandSub">Ուսումնական հարթակ</span>
              </span>
            </div>

            <span className="login-hero__badge">
              <Sparkles size={13} strokeWidth={2.4} />
              2025/26 ուս. տարի
            </span>
          </div>

          <div className="login-hero__center">
            <h2 className="login-hero__title">
              Սովորիր <em>մաթեմատիկա</em><br />
              <span className="login-hero__titleAccent">հստակ ու հետևողական</span>
            </h2>
            <p className="login-hero__lede">
              Դասերը, օրինակները և թեստերը՝ մեկ տեղում։ Մուտք գործիր և շարունակիր այնտեղ, որտեղ կանգ էիր առել։
            </p>

            <div className="login-hero__previews" aria-hidden="true">
              <article className="login-hero__chip login-hero__chip--lesson">
                <header>
                  <span className="login-hero__chipTag">Դաս</span>
                  <span className="login-hero__chipMeta">12/14</span>
                </header>
                <h3>Քառակուսային հավասարումներ</h3>
                <div className="login-hero__progress">
                  <span style={{ width: '86%' }} />
                </div>
                <footer><em>ax² + bx + c = 0</em></footer>
              </article>

              <article className="login-hero__chip login-hero__chip--test">
                <header>
                  <span className="login-hero__chipTag login-hero__chipTag--test">Թեստ</span>
                  <span className="login-hero__chipMeta">9 / 10</span>
                </header>
                <h3>Բազմությունների գործողություններ</h3>
                <ul className="login-hero__dots">
                  <li className="is-ok" /><li className="is-ok" /><li className="is-ok" /><li className="is-ok" />
                  <li className="is-ok" /><li className="is-ok" /><li className="is-ok" /><li className="is-ok" />
                  <li className="is-ok" /><li className="is-bad" />
                </ul>
                <footer><em>A ∪ B</em> · <em>A ∩ B</em></footer>
              </article>
            </div>
          </div>

          <div className="login-hero__foot">
            <span className="login-hero__footStat"><b>12+</b> թեմա</span>
            <span className="login-hero__footDot" />
            <span className="login-hero__footStat"><b>80+</b> թեստ</span>
            <span className="login-hero__footDot" />
            <span className="login-hero__footStat"><b>500+</b> առաջադրանք</span>
          </div>
        </aside>

        <section className="login-card" aria-labelledby="login-title">
          <div className="login-card__brandMobile">
            <span className="login-card__logoMark"><SiteLogoMark /></span>
            <span>Լոգիկա և մաթեմատիկա</span>
          </div>

          <span className="login-card__eyebrow">Մուտք</span>
          <h1 id="login-title" className="login-card__title">
            Բարի վերադարձ
          </h1>
          <p className="login-card__subtitle">
            Շարունակիր այնտեղ, որտեղ կանգ էիր առել։ Մուտքը՝ Google հաշվով։
          </p>

          <button
            type="button"
            className="login-card__btn"
            onClick={handleSignIn}
            disabled={busy || loading}
          >
            <GoogleGlyph />
            <span>{busy ? 'Մուտք…' : 'Շարունակել Google-ով'}</span>
          </button>

          {error && <p className="login-card__error" role="alert">{error}</p>}

          <div className="login-card__rule">
            <span /><i>անվտանգ մուտք</i><span />
          </div>

          <ul className="login-card__points">
            <li>
              <ShieldCheck size={15} strokeWidth={2.25} />
              <span>OAuth 2.0 — գաղտնաբառ չենք պահում</span>
            </li>
            <li>
              <Sparkles size={15} strokeWidth={2.25} />
              <span>Արդյունքները պահվում են ավտոմատ կերպով</span>
            </li>
          </ul>

          <p className="login-card__legal">
            Մուտք գործելով՝ համաձայնում ես հարթակի ուսումնական օգտագործման կանոններին։
          </p>
        </section>
      </div>
    </main>
  );
}
