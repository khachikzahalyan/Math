import { Route, Routes } from 'react-router-dom';

import BackToTopFab from './components/BackToTopFab/BackToTopFab';
import GlassBg from './components/GlassBg/GlassBg';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import MainLayout from './layouts/MainLayout/MainLayout';
import LessonsLayout from './layouts/LessonsLayout/LessonsLayout';

import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Lessons from './pages/Lessons/Lessons';
import LessonTopic from './pages/LessonTopic/LessonTopic';
import Login from './pages/Login/Login';
import Grades from './pages/Grades/Grades';
import NotFound from './pages/NotFound/NotFound';

import RequireAuth from './auth/RequireAuth';
import RequireTeacher from './auth/RequireTeacher';

function App() {
  return (
    <>
      <GlassBg />
      <ScrollToTop />
      <BackToTopFab />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route
          path="/lessons"
          element={
            <RequireAuth>
              <LessonsLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Lessons />} />
          <Route path=":topicId" element={<LessonTopic />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route
            path="/grades"
            element={
              <RequireTeacher>
                <Grades />
              </RequireTeacher>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
