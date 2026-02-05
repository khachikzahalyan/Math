import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import './LessonsLayout.css';

function LessonsLayout() {
  const contentRef = useRef(null);
  const { pathname } = useLocation();

  // Ստուգել թե արդյո՞ք մենք /lessons-ի վրա ենք (առանց topic ID-ի)
  const isLessonsCategory = pathname === '/lessons';

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <div className="lessonsLayout">
      <Header />
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
