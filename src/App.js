import { Route, Routes } from 'react-router-dom';
import './App.css';

import MainLayout from './layouts/MainLayout/MainLayout';
import LessonsLayout from './layouts/LessonsLayout/LessonsLayout';

import Home from './pages/Home/Home';
import About from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Lessons from './pages/Lessons/Lessons';
import LessonTopic from './pages/LessonTopic/LessonTopic';
import NotFound from './pages/NotFound/NotFound';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/lessons" element={<LessonsLayout />}>
        <Route index element={<Lessons />} />
        <Route path=":topicId" element={<LessonTopic />} />
      </Route>

      <Route path="/topics" element={<LessonsLayout />}>
        <Route index element={<Lessons />} />
        <Route path=":topicId" element={<LessonTopic />} />
      </Route>
    </Routes>
  );
}

export default App;
