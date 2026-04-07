import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import './MainLayout.css';

function MainLayout() {
  const { pathname } = useLocation();
  /** Ֆուտեր միայն Գլխավոր և Մեր մասին էջերում */
  const showFooter = pathname === '/' || pathname === '/about';
  const hideFooter = !showFooter;

  return (
    <div className={`mainLayout${hideFooter ? ' mainLayout--noFooter' : ''}`}>
      <Header />
      <main className="mainLayout__content">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export default MainLayout;
