import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <h1 className="home__title">Մաթեմատիկայի ուսումնական կայք</h1>
      <p className="home__text">Ընտրեք թեմա, կարդացեք տեսությունը և ստուգեք ձեր գիտելիքները փոքր առաջադրանքներով։</p>

      <div className="home__actions">
        <Link className="home__button" to="/lessons">
          Անցնել դասերին
        </Link>
      </div>
    </div>
  );
}

export default Home;
