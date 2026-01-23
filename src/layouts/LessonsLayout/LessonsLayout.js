import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import './LessonsLayout.css';

function LessonsLayout() {
  const contentRef = useRef(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <div className="lessonsLayout">
      <Header />
      <div className="lessonsLayout__body">
        <Sidebar />
        <main className="lessonsLayout__content" ref={contentRef}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default LessonsLayout;
