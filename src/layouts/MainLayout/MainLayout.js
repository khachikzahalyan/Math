import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './MainLayout.css';

function MainLayout() {
  const { pathname } = useLocation();
  const hideFooter = pathname === '/contact';

  return (
    <div className={`mainLayout${hideFooter ? ' mainLayout--noFooter' : ''}`}>
      <Header />
      <main className="mainLayout__content">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}

export default MainLayout;
