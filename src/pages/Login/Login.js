import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import './Login.css';

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
      <section className="login-card">
        <div className="login-card__icon">
          <LogIn size={32} aria-hidden="true" />
        </div>
        <h1 className="login-card__title">Մուտք համակարգ</h1>
        <p className="login-card__subtitle">
          Մուտք գործեք Google հաշվով՝ դասերին և թեստերին հասանելիություն ստանալու համար։
        </p>

        <button
          type="button"
          className="login-card__btn"
          onClick={handleSignIn}
          disabled={busy || loading}
        >
          {busy ? 'Մուտք…' : 'Մտնել Google-ով'}
        </button>

        {error && <p className="login-card__error" role="alert">{error}</p>}

        <p className="login-card__hint">
          Մուտքից հետո ձեր արդյունքները կպահվեն ավտոմատ կերպով։
        </p>
      </section>
    </main>
  );
}
