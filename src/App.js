import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import TopicsPage from './pages/TopicsPage';
import TopicPage from './pages/TopicPage';
import AllLessonsPage from './pages/AllLessonsPage';
import LessonPage from './pages/LessonPage';
import PracticePage from './pages/PracticePage';
import ReferencePage from './pages/ReferencePage';
import MyProgressPage from './pages/MyProgressPage';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <div className="app-container">
          <Sidebar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/topics" element={<TopicsPage />} />
              <Route path="/topic/:topicSlug" element={<TopicPage />} />
              <Route path="/lessons" element={<AllLessonsPage />} />
              <Route path="/lesson/:lessonSlug" element={<LessonPage />} />
              <Route path="/practice" element={<PracticePage />} />
              <Route path="/reference" element={<ReferencePage />} />
              <Route path="/progress" element={<MyProgressPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
