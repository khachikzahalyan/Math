import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <div className="home__content">
        <h1 className="home__title animate-title">
          Մաթեմատիկան՝<br /> մտածելու արվեստ
        </h1>

        <p className="home__subtitle animate-subtitle">
          Այստեղ մաթեմատիկան դառնում է պարզ, հետաքրքիր և հասկանալի։
          Սովորիր քայլ առ քայլ, զարգացրու տրամաբանական մտածողությունդ
          և վստահորեն առաջ շարժվիր։
        </p>

        <div className="home__features">
          <div className="home__feature animate-card animate-delay-1">
            📘 Պարզ և հստակ տեսություն
          </div>
          <div className="home__feature animate-card animate-delay-2">
            🧠 Տրամաբանական մտածողության զարգացում
          </div>
          <div className="home__feature animate-card animate-delay-3">
            ✏️ Փոքր առաջադրանքներ ինքնաստուգման համար
          </div>
        </div>

        <div className="home__actions animate-actions">
          <Link className="home__button" to="/lessons">
            Սկսել ուսուցումը
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
