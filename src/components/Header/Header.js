import { NavLink } from 'react-router-dom';
import logo from '../../logo.svg';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__logo">
          <img className="header__logoImg" src={logo} alt="Մաթեմատիկա" />
          <span className="header__logoText">Մաթ</span>
        </div>

        <nav className="header__nav">
          <NavLink className={({ isActive }) => (isActive ? 'header__link is-active' : 'header__link')} to="/">
            Գլխավոր
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'header__link is-active' : 'header__link')} to="/about">
            Մեր մասին
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'header__link is-active' : 'header__link')} to="/contact">
            Կապ
          </NavLink>
          <NavLink className={({ isActive }) => (isActive ? 'header__link is-active' : 'header__link')} to="/lessons">
            Դասեր
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
