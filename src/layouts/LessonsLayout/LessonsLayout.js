import { Outlet } from 'react-router-dom';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import './LessonsLayout.css';

function LessonsLayout() {
  return (
    <div className="lessonsLayout">
      <Header />
      <div className="lessonsLayout__body">
        <Sidebar />
        <main className="lessonsLayout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default LessonsLayout;
