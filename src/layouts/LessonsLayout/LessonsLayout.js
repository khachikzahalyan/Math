import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import './LessonsLayout.css';

function LessonsLayout() {
  const contentRef = useRef(null);
  const { pathname } = useLocation();

  const isLessonsCategory = pathname === '/lessons';

  useEffect(() => {
    document.documentElement.classList.add('lessons-lock');
    return () => {
      document.documentElement.classList.remove('lessons-lock');
    };
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <div className="lessonsLayout">
      <div className="lessonsLayout__body">
        {!isLessonsCategory && <Sidebar />}
        <main
          className={`lessonsLayout__content ${isLessonsCategory ? 'lessonsLayout__content--fullWidth' : ''}`}
          ref={contentRef}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default LessonsLayout;
