import { Link } from 'react-router-dom';
import { BookOpen, Brain, PencilLine } from 'lucide-react';
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
            <BookOpen className="home__icon" size={28} />
            <span>Պարզ և հստակ տեսություն</span>
          </div>

          <div className="home__feature animate-card animate-delay-2">
            <Brain className="home__icon" size={28} />
            <span>Տրամաբանական մտածողության զարգացում</span>
          </div>

          <div className="home__feature animate-card animate-delay-3">
            <PencilLine className="home__icon" size={28} />
            <span>Փոքր առաջադրանքներ ինքնաստուգման համար</span>
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