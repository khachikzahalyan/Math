import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './MainLayout.css';

function MainLayout() {
  const { pathname } = useLocation();
  const showFooter = pathname === '/' || pathname === '/about';

  return (
    <div className={`mainLayout${showFooter ? '' : ' mainLayout--noFooter'}`}>
      <Header />
      <main className="mainLayout__content">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export default MainLayout;
