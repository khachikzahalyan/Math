# План реализации: Auth + Firebase + CRUD уроков + журнал оценок

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Добавить Google Auth (Firebase), две роли (учитель/ученик по email), CRUD тем и вопросов учителем на `/lessons`, сохранение прогресса учеников в Firestore и журнал `/grades` для учителя.

**Architecture:** React 18 + Firebase v10 SDK (Auth + Firestore). Один React Context для auth. Темы/вопросы — `topics/{id}` и подколлекция `questions`. Прогресс — `progress/{uid}` + подколлекция `attempts`. Маршруты защищены гардами `<RequireAuth>` и `<RequireTeacher>`. Real-time через `onSnapshot` для тем; разовые `getDocs` для журнала.

**Tech Stack:** React 18, react-router-dom 6, framer-motion, lucide-react, **firebase 10+** (новое). UI на армянском. Тестов в проекте нет — добавим минимальные unit-тесты только для чистых функций (формула 10-балльной и валидация вопроса).

**Spec:** `docs/superpowers/specs/2026-05-25-auth-firebase-design.md`

---

## ⚠️ Жёсткое правило

**Claude НЕ выполняет git-команды.** Все шаги «Коммит» — это памятка пользователю. Пользователь сам делает `git add`/`git commit` после ревью диффа. В шагах коммита Claude должен ОСТАНОВИТЬСЯ и попросить пользователя закоммитить вручную.

---

## Этап 1 — Firebase setup

### Task 1: Установить Firebase SDK

**Files:**
- Modify: `package.json` (через npm — автоматически)

- [ ] **Step 1.1: Установить пакет**

Run: `npm install firebase`

Expected: добавлен `"firebase": "^10.x.x"` в `dependencies` `package.json`, обновлён `package-lock.json`.

- [ ] **Step 1.2: Проверить, что dev-сервер всё ещё стартует**

Run: `npm start`
Expected: приложение открывается на `http://localhost:3000` без ошибок в консоли. Закрыть `Ctrl+C`.

- [ ] **Step 1.3: КОММИТ (вручную пользователем)**

Сообщить пользователю: «Firebase SDK установлен. Закоммитьте `package.json` и `package-lock.json`. Сообщение: `chore: install firebase sdk`».

### Task 2: Создать `.env.local` и обновить `.gitignore`

**Files:**
- Create: `.env.local`
- Verify: `.gitignore` (уже содержит `.env.local`)

- [ ] **Step 2.1: Создать `.env.local` в корне проекта**

Файл `.env.local` (НЕ коммитится — уже в `.gitignore`):

```
REACT_APP_FIREBASE_API_KEY=AIzaSyAcJpBXECyjs5kMoMFheUnim52YuLNlbyI
REACT_APP_FIREBASE_AUTH_DOMAIN=diplom-a1897.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=diplom-a1897
REACT_APP_FIREBASE_STORAGE_BUCKET=diplom-a1897.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=98585399453
REACT_APP_FIREBASE_APP_ID=1:98585399453:web:ed55c0b972d0bcdc22c474
```

- [ ] **Step 2.2: Проверить, что `.gitignore` уже содержит `.env.local`**

Run: `git status --short`
Expected: `.env.local` НЕ в списке (значит игнорируется). Если виден — добавить строку `.env.local` в `.gitignore`.

- [ ] **Step 2.3: Создать `.env.example` (для документации)**

Файл `.env.example`:

```
REACT_APP_FIREBASE_API_KEY=
REACT_APP_FIREBASE_AUTH_DOMAIN=
REACT_APP_FIREBASE_PROJECT_ID=
REACT_APP_FIREBASE_STORAGE_BUCKET=
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=
REACT_APP_FIREBASE_APP_ID=
```

- [ ] **Step 2.4: КОММИТ (вручную пользователем)**

Сообщить пользователю: «Закоммитьте `.env.example` (но НЕ `.env.local`!). Сообщение: `chore: add env example for firebase`».

### Task 3: Создать `src/firebase.js`

**Files:**
- Create: `src/firebase.js`

- [ ] **Step 3.1: Создать `src/firebase.js`**

```js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export const TEACHER_EMAIL = 'zahalyankhachik-2@aspu.am';
export const isTeacherEmail = (email) => email === TEACHER_EMAIL;
```

- [ ] **Step 3.2: Smoke-тест: загрузить страницу и проверить, что нет ошибок**

Run: `npm start`
В браузере открыть `http://localhost:3000`, открыть DevTools → Console.
Expected: НЕТ ошибок типа `Firebase: Error (auth/invalid-api-key)` или `FirebaseError`. Закрыть `Ctrl+C`.

- [ ] **Step 3.3: КОММИТ (вручную пользователем)**

Сообщить пользователю: «Закоммитьте `src/firebase.js`. Сообщение: `feat: add firebase config (auth + firestore)`».

### Task 4: Создать `firestore.rules` (как документация в репо)

**Files:**
- Create: `firestore.rules`

- [ ] **Step 4.1: Создать `firestore.rules` в корне проекта**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {

    function isSignedIn() { return request.auth != null; }
    function isTeacher()  {
      return isSignedIn() && request.auth.token.email == 'zahalyankhachik-2@aspu.am';
    }

    match /topics/{topicId} {
      allow read:  if isSignedIn();
      allow write: if isTeacher();

      match /questions/{qId} {
        allow read:  if isSignedIn();
        allow write: if isTeacher();
      }
    }

    match /progress/{userId} {
      allow read:   if isSignedIn() && (request.auth.uid == userId || isTeacher());
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update: if isSignedIn() && request.auth.uid == userId;
      allow delete: if isTeacher();

      match /attempts/{attemptId} {
        allow read:   if isSignedIn() && (request.auth.uid == userId || isTeacher());
        allow create: if isSignedIn() && request.auth.uid == userId;
        allow update, delete: if false;
      }
    }
  }
}
```

- [ ] **Step 4.2: ВРУЧНУЮ — пользователь публикует правила в Firebase Console**

Сообщить пользователю: «Откройте https://console.firebase.google.com/project/diplom-a1897/firestore/rules, скопируйте содержимое `firestore.rules` → Publish. Также включите Google провайдер: Authentication → Sign-in method → Google → Enable. И добавьте `localhost` в Authorized domains (обычно уже есть)».

- [ ] **Step 4.3: КОММИТ (вручную пользователем)**

Сообщить пользователю: «Закоммитьте `firestore.rules`. Сообщение: `docs: add firestore security rules`».

---

## Этап 2 — Аутентификация

### Task 5: Создать `AuthContext`

**Files:**
- Create: `src/auth/AuthContext.js`

- [ ] **Step 5.1: Создать `src/auth/AuthContext.js`**

```js
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut as fbSignOut,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, isTeacherEmail } from '../firebase';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setLoading(false);
      if (u && !isTeacherEmail(u.email)) {
        await setDoc(
          doc(db, 'progress', u.uid),
          {
            email: u.email,
            displayName: u.displayName || '',
            photoURL: u.photoURL || '',
            lastActiveAt: serverTimestamp(),
          },
          { merge: true },
        );
      }
    });
  }, []);

  const signIn = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      if (e?.code === 'auth/popup-blocked' || e?.code === 'auth/popup-closed-by-user') {
        if (e.code === 'auth/popup-blocked') {
          await signInWithRedirect(auth, googleProvider);
        }
        return;
      }
      throw e;
    }
  }, []);

  const signOut = useCallback(() => fbSignOut(auth), []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isTeacher: !!user && isTeacherEmail(user.email),
      signIn,
      signOut,
    }),
    [user, loading, signIn, signOut],
  );

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
```

- [ ] **Step 5.2: КОММИТ (вручную пользователем)**

Сообщение: `feat(auth): add AuthContext with Google sign-in`.

### Task 6: Создать гарды маршрутов

**Files:**
- Create: `src/auth/RequireAuth.js`
- Create: `src/auth/RequireTeacher.js`

- [ ] **Step 6.1: Создать `src/auth/RequireAuth.js`**

```js
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Loader from '../components/Loader/Loader';

export default function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
```

- [ ] **Step 6.2: Создать `src/auth/RequireTeacher.js`**

```js
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Loader from '../components/Loader/Loader';

export default function RequireTeacher({ children }) {
  const { user, isTeacher, loading } = useAuth();
  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isTeacher) return <Navigate to="/lessons" replace />;
  return children;
}
```

- [ ] **Step 6.3: Проверить, что компонент `Loader` существует**

Run: посмотреть `src/components/Loader/Loader.js`. Если экспорта `default` нет — поправить импорт в гардах. Если компонента нет вообще — создать минимальный:

```js
// src/components/Loader/Loader.js (только если файла нет)
export default function Loader() {
  return <div style={{ padding: 40, textAlign: 'center' }}>Բեռնում...</div>;
}
```

- [ ] **Step 6.4: КОММИТ (вручную пользователем)**

Сообщение: `feat(auth): add route guards RequireAuth and RequireTeacher`.

### Task 7: Создать страницу `/login`

**Files:**
- Create: `src/pages/Login/Login.js`
- Create: `src/pages/Login/Login.css`

- [ ] **Step 7.1: Создать `src/pages/Login/Login.js`**

```js
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import './Login.css';

export default function Login() {
  const { user, signIn, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && user) {
      const to = location.state?.from?.pathname || '/lessons';
      navigate(to, { replace: true });
    }
  }, [user, loading, navigate, location]);

  const onClick = async () => {
    setBusy(true);
    setError('');
    try {
      await signIn();
    } catch (e) {
      setError('Մուտքը չստացվեց։ Փորձեք կրկին։');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Մուտք գործել</h1>
        <p className="login-subtitle">
          Մուտք գործեք Google հաշվով՝ դասերին և թեստերին հասանելիություն ստանալու համար։
        </p>
        <button className="login-btn" onClick={onClick} disabled={busy} type="button">
          {busy ? 'Բեռնում...' : 'Մտնել Google-ով'}
        </button>
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}
```

- [ ] **Step 7.2: Создать `src/pages/Login/Login.css`**

```css
.login-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%);
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 20px;
  padding: 40px 32px;
  box-shadow: 0 20px 50px -20px rgba(15, 23, 42, 0.2);
  text-align: center;
}

.login-title {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 12px;
}

.login-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0 0 28px;
  line-height: 1.5;
}

.login-btn {
  width: 100%;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  padding: 14px 20px;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 10px 24px -8px rgba(59, 130, 246, 0.45);
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 14px 28px -8px rgba(59, 130, 246, 0.55);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-error {
  margin-top: 16px;
  color: #dc2626;
  font-size: 14px;
}
```

- [ ] **Step 7.3: КОММИТ (вручную пользователем)**

Сообщение: `feat(auth): add /login page with Google sign-in`.

### Task 8: Подключить `AuthProvider` и обновить маршруты

**Files:**
- Modify: `src/index.js`
- Modify: `src/App.js`

- [ ] **Step 8.1: Обновить `src/index.js`**

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './auth/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

- [ ] **Step 8.2: Обновить `src/App.js` — добавить `/login`, `/grades`, гарды**

```js
import { Route, Routes } from 'react-router-dom';

import BackToTopFab from './components/BackToTopFab/BackToTopFab';
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
      <ScrollToTop />
      <BackToTopFab />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/grades"
            element={
              <RequireTeacher>
                <Grades />
              </RequireTeacher>
            }
          />
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
      </Routes>
    </>
  );
}

export default App;
```

- [ ] **Step 8.3: Создать заглушку `src/pages/Grades/Grades.js` (чтоб импорт не падал)**

```js
export default function Grades() {
  return <div style={{ padding: 40 }}>Շուտով...</div>;
}
```

- [ ] **Step 8.4: Smoke-тест**

Run: `npm start`
- Открыть `http://localhost:3000/lessons` в инкогнито (или после logout) → должен редиректнуть на `/login`.
- На `/login` нажать «Մտնել Google-ով» → popup Google → войти под учительским gmail → редирект на `/lessons` (страница пока статическая, неважно).
- Открыть `http://localhost:3000/grades` под учителем → видна заглушка «Շուտով...».
- Выйти (пока выхода нет — очистить cookies или открыть инкогнито), войти под ученическим gmail → `/grades` редиректит на `/lessons`.

- [ ] **Step 8.5: КОММИТ (вручную пользователем)**

Сообщение: `feat(auth): wire AuthProvider, add /login and protected routes`.

### Task 9: Добавить `UserMenu` в Header

**Files:**
- Create: `src/components/Header/UserMenu.js`
- Modify: `src/components/Header/Header.js`
- Modify: `src/components/Header/Header.css` (добавить стили)

- [ ] **Step 9.1: Создать `src/components/Header/UserMenu.js`**

```js
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, ClipboardList, ChevronDown } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';

export default function UserMenu() {
  const { user, isTeacher, signIn, signOut, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <button className="userMenu__signIn" onClick={signIn} type="button">
        <LogIn size={16} />
        Մտնել
      </button>
    );
  }

  return (
    <div className="userMenu" ref={ref}>
      <button
        className="userMenu__trigger"
        onClick={() => setOpen((p) => !p)}
        type="button"
      >
        {user.photoURL ? (
          <img className="userMenu__avatar" src={user.photoURL} alt="" />
        ) : (
          <span className="userMenu__avatar userMenu__avatar--fallback">
            {(user.displayName || user.email || '?').charAt(0).toUpperCase()}
          </span>
        )}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="userMenu__dropdown">
          <div className="userMenu__name">{user.displayName || user.email}</div>
          {isTeacher && (
            <Link
              to="/grades"
              className="userMenu__item"
              onClick={() => setOpen(false)}
            >
              <ClipboardList size={15} />
              Մատյան
            </Link>
          )}
          <button
            className="userMenu__item"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            type="button"
          >
            <LogOut size={15} />
            Դուրս գալ
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 9.2: Добавить стили в `src/components/Header/Header.css`**

В конец файла дописать:

```css
.userMenu { position: relative; }

.userMenu__signIn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 10px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: #fff; border: none; cursor: pointer;
  font-weight: 600; font-size: 14px;
}

.userMenu__trigger {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 8px 4px 4px; border-radius: 999px;
  background: #fff; border: 1px solid #e2e8f0; cursor: pointer;
}

.userMenu__avatar {
  width: 30px; height: 30px; border-radius: 50%;
  object-fit: cover; display: inline-flex;
  align-items: center; justify-content: center;
  background: #e2e8f0; color: #475569; font-weight: 700;
}

.userMenu__avatar--fallback { font-size: 14px; }

.userMenu__dropdown {
  position: absolute; top: calc(100% + 8px); right: 0;
  min-width: 200px; background: #fff;
  border: 1px solid #e2e8f0; border-radius: 12px;
  box-shadow: 0 12px 32px -8px rgba(15,23,42,0.18);
  padding: 6px; z-index: 50;
}

.userMenu__name {
  padding: 8px 12px; font-size: 13px; color: #64748b;
  border-bottom: 1px solid #f1f5f9; margin-bottom: 4px;
}

.userMenu__item {
  display: flex; align-items: center; gap: 8px;
  width: 100%; padding: 8px 12px; border-radius: 8px;
  background: transparent; border: none; cursor: pointer;
  font-size: 14px; color: #0f172a; text-decoration: none;
}

.userMenu__item:hover { background: #f1f5f9; }
```

- [ ] **Step 9.3: Подключить `UserMenu` в `src/components/Header/Header.js`**

В импортах добавить:
```js
import UserMenu from './UserMenu';
```

В JSX внутри `<nav className={...}>` после блока `header__search--desktop` добавить:
```jsx
<UserMenu />
```

Конкретно — найти строки `</div>\n        </nav>` в конце `<nav>` и заменить на:
```jsx
            <UserMenu />
          </div>
        </nav>
```

Если структура другая — главное чтобы `<UserMenu />` рендерился внутри `<nav>` после блока `header__search--desktop`.

- [ ] **Step 9.4: Smoke-тест**

Run: `npm start` → открыть `/` → в Header справа видна кнопка «Մտնել». Войти → видны аватар и chevron → клик → dropdown с именем, «Մատյան» (если учитель), «Դուրս գալ». Клик «Դուրս գալ» → возвращается кнопка «Մտնել».

- [ ] **Step 9.5: КОММИТ (вручную пользователем)**

Сообщение: `feat(header): add UserMenu with sign-in/out and teacher links`.

---

## Этап 3 — Темы из Firestore (read-only) + seed-импорт

### Task 10: Создать `topicsRepo` и `questionsRepo`

**Files:**
- Create: `src/data/topicsRepo.js`
- Create: `src/data/questionsRepo.js`

- [ ] **Step 10.1: Создать `src/data/topicsRepo.js`**

```js
import {
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp, writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase';

const TOPICS = 'topics';

export function subscribeTopics(callback, onError) {
  const q = query(collection(db, TOPICS), orderBy('order', 'asc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, onError);
}

export async function listTopics() {
  const snap = await getDocs(query(collection(db, TOPICS), orderBy('order', 'asc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function getTopic(topicId) {
  const snap = await getDoc(doc(db, TOPICS, topicId));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function saveTopic(topicId, data, userEmail) {
  await setDoc(
    doc(db, TOPICS, topicId),
    {
      ...data,
      updatedAt: serverTimestamp(),
      updatedBy: userEmail,
      ...(data.createdAt ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true },
  );
}

export async function deleteTopic(topicId) {
  // Удалить все вопросы подколлекции, потом саму тему
  const qSnap = await getDocs(collection(db, TOPICS, topicId, 'questions'));
  const batch = writeBatch(db);
  qSnap.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(doc(db, TOPICS, topicId));
  await batch.commit();
}

export async function isTopicsEmpty() {
  const snap = await getDocs(collection(db, TOPICS));
  return snap.empty;
}
```

- [ ] **Step 10.2: Создать `src/data/questionsRepo.js`**

```js
import {
  collection, doc, getDocs, setDoc, deleteDoc,
  onSnapshot, query, orderBy,
} from 'firebase/firestore';
import { db } from '../firebase';

const TOPICS = 'topics';
const QUESTIONS = 'questions';

export function subscribeQuestions(topicId, callback, onError) {
  const q = query(collection(db, TOPICS, topicId, QUESTIONS), orderBy('order', 'asc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  }, onError);
}

export async function listQuestions(topicId) {
  const snap = await getDocs(query(collection(db, TOPICS, topicId, QUESTIONS), orderBy('order', 'asc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveQuestion(topicId, questionId, data) {
  await setDoc(doc(db, TOPICS, topicId, QUESTIONS, questionId), data, { merge: true });
}

export async function deleteQuestion(topicId, questionId) {
  await deleteDoc(doc(db, TOPICS, topicId, QUESTIONS, questionId));
}

export function validateQuestion(q) {
  if (!q?.question?.trim()) return 'Հարցի տեքստը պարտադիր է';
  if (!Array.isArray(q.options) || q.options.length < 2) return 'Անհրաժեշտ է առնվազն 2 տարբերակ';
  if (q.options.some((o) => !String(o).trim())) return 'Տարբերակները չեն կարող դատարկ լինել';
  if (typeof q.correctOption !== 'number') return 'Ընտրեք ճիշտ տարբերակը';
  if (q.correctOption < 0 || q.correctOption >= q.options.length) return 'Ճիշտ տարբերակը անվավեր է';
  return null;
}
```

- [ ] **Step 10.3: КОММИТ (вручную пользователем)**

Сообщение: `feat(data): add topicsRepo and questionsRepo (Firestore)`.

### Task 11: Создать seed-утилиту

**Files:**
- Create: `src/utils/seedTopics.js`

- [ ] **Step 11.1: Создать `src/utils/seedTopics.js`**

```js
import { writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import seed from '../data/topics';

export async function seedTopicsFromStaticFile(userEmail) {
  const batch = writeBatch(db);
  seed.forEach((topic, i) => {
    const { questions, ...rest } = topic;
    batch.set(doc(db, 'topics', topic.id), {
      ...rest,
      order: i,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      updatedBy: userEmail,
    });
    (questions || []).forEach((q, j) => {
      batch.set(
        doc(db, 'topics', topic.id, 'questions', q.id),
        { ...q, order: j },
      );
    });
  });
  await batch.commit();
  return seed.length;
}
```

- [ ] **Step 11.2: КОММИТ (вручную пользователем)**

Сообщение: `feat(data): add seedTopics util for first-time import`.

### Task 12: Обновить `Lessons.js` — данные из Firestore + seed-кнопка

**Files:**
- Modify: `src/pages/Lessons/Lessons.js`

- [ ] **Step 12.1: Полностью переписать `src/pages/Lessons/Lessons.js`**

```js
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Compass, Layers, Zap, Target, Flame, Crown,
  ArrowLeft, ChevronRight, Download,
} from 'lucide-react';
import { subscribeTopics, isTopicsEmpty } from '../../data/topicsRepo';
import { seedTopicsFromStaticFile } from '../../utils/seedTopics';
import { recordLevelVisited } from '../../utils/progressStorage';
import { useAuth } from '../../auth/AuthContext';
import './Lessons.css';

const LEVELS = [
  { level: 1, Icon: Compass, from: '#34d399', to: '#10b981', shadow: '16,185,129', light: '#ecfdf5' },
  { level: 2, Icon: Layers, from: '#60a5fa', to: '#3b82f6', shadow: '59,130,246', light: '#eff6ff' },
  { level: 3, Icon: Zap, from: '#818cf8', to: '#6366f1', shadow: '99,102,241', light: '#eef2ff' },
  { level: 4, Icon: Target, from: '#a78bfa', to: '#8b5cf6', shadow: '139,92,246', light: '#f5f3ff' },
  { level: 5, Icon: Flame, from: '#f472b6', to: '#ec4899', shadow: '236,72,153', light: '#fdf2f8' },
  { level: 6, Icon: Crown, from: '#fbbf24', to: '#f59e0b', shadow: '245,158,11', light: '#fffbeb' },
];

function Lessons() {
  const { user, isTeacher } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [topics, setTopics] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [empty, setEmpty] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    setLoadError('');
    const unsub = subscribeTopics(
      (list) => {
        setTopics(list);
        setEmpty(list.length === 0);
      },
      () => setLoadError('Չհաջողվեց բեռնել թեմաները։'),
    );
    return unsub;
  }, []);

  const topicsByLevel = useMemo(() => {
    const m = new Map();
    topics.forEach((t) => {
      if (!m.has(t.level)) m.set(t.level, []);
      m.get(t.level).push(t);
    });
    return m;
  }, [topics]);

  const onSeed = async () => {
    setSeeding(true);
    try {
      await seedTopicsFromStaticFile(user?.email || '');
    } catch (e) {
      setLoadError('Ներմուծումը չհաջողվեց։');
    } finally {
      setSeeding(false);
    }
  };

  if (loadError) {
    return (
      <div className="lessons-page">
        <div className="lessons-page__inner" style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: '#dc2626', marginBottom: 16 }}>{loadError}</p>
          <button onClick={() => window.location.reload()} type="button">
            Կրկին փորձել
          </button>
        </div>
      </div>
    );
  }

  if (empty && isTeacher) {
    return (
      <div className="lessons-page">
        <div className="lessons-page__inner" style={{ textAlign: 'center', padding: 40 }}>
          <h2 style={{ marginBottom: 12 }}>Թեմաներ դեռ չկան</h2>
          <p style={{ color: '#64748b', marginBottom: 20 }}>
            Ներմուծեք նախնական դասերը՝ սկսելու համար։
          </p>
          <button
            onClick={onSeed}
            disabled={seeding}
            type="button"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 20px', borderRadius: 12,
              background: 'linear-gradient(135deg,#3b82f6,#6366f1)',
              color: '#fff', border: 'none', cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            <Download size={16} />
            {seeding ? 'Ներմուծվում է...' : 'Ներմուծել նախնական դասերը'}
          </button>
        </div>
      </div>
    );
  }

  if (empty && !isTeacher) {
    return (
      <div className="lessons-page">
        <div className="lessons-page__inner" style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ color: '#64748b' }}>Թեմաներ դեռ չկան։ Դիմեք ուսուցչին։</p>
        </div>
      </div>
    );
  }

  if (selectedLevel === null) {
    return (
      <div className="lessons-page">
        <div className="lessons-page__inner">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.07 }}
            className="mb-3 text-center text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl"
          >
            Դասեր
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="mx-auto mb-8 max-w-xl text-center text-base text-slate-500 md:mb-10 md:text-lg"
          >
            Ընտրեք մակարդակը սկսելու համար։
          </motion.p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {LEVELS.map(({ level, Icon, from, to, shadow, light }, idx) => {
              const topicsAtLevel = topicsByLevel.get(level) || [];
              return (
                <motion.button
                  key={level}
                  initial={{ opacity: 0, y: 34 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 + idx * 0.08, duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                  onClick={() => {
                    recordLevelVisited(level);
                    setSelectedLevel(level);
                  }}
                  className="lessons-level-card group"
                  style={{ '--l-from': from, '--l-to': to, '--l-shadow': shadow, '--l-light': light }}
                >
                  <div className="lessons-level-card__strip" />
                  <div className="lessons-level-card__icon">
                    <Icon size={24} strokeWidth={2.2} />
                  </div>
                  <span className="lessons-level-card__number">{level}</span>
                  <span className="lessons-level-card__label">Մակարդակ</span>
                  <span className="lessons-level-card__count">{topicsAtLevel.length} թեմա</span>
                  <ChevronRight size={18} className="lessons-level-card__arrow" />
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  const cfg = LEVELS.find((l) => l.level === selectedLevel) || LEVELS[0];
  const filteredTopics = topicsByLevel.get(selectedLevel) || [];

  return (
    <div key={selectedLevel} className="mx-auto w-full max-w-[1100px] px-4 pb-14 pt-6 md:px-6">
      <motion.button
        initial={{ opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="lessons-back group mb-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm"
        onClick={() => setSelectedLevel(null)}
        type="button"
      >
        <ArrowLeft size={17} className="transition group-hover:-translate-x-0.5" />
        Վերադառնալ
      </motion.button>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.06 }}
        className="mb-2 text-center text-3xl font-black tracking-tight md:text-4xl lg:text-5xl"
        style={{
          background: `linear-gradient(135deg, ${cfg.from}, ${cfg.to})`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}
      >
        Մակարդակ {selectedLevel}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12 }}
        className="mx-auto mb-10 max-w-lg text-center text-slate-500"
      >
        Ընտրեք թեմա ուսումնասիրելու համար։
      </motion.p>

      {filteredTopics.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="py-16 text-center text-slate-400"
        >
          Այս մակարդակի համար թեմաներ դեռ չկան։
        </motion.p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTopics.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 + idx * 0.05, duration: 0.45 }}
              className="lessons-topic-card group"
              style={{ '--l-from': cfg.from, '--l-to': cfg.to, '--l-shadow': cfg.shadow }}
            >
              <h3 className="mb-2 text-base font-bold text-slate-900">{t.title}</h3>
              <p className="flex-1 text-sm leading-relaxed text-slate-500">{t.description}</p>
              <div className="mt-auto pt-4">
                <Link
                  className="lessons-topic-card__link inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold text-white"
                  style={{ background: `linear-gradient(135deg, ${cfg.from}, ${cfg.to})` }}
                  to={t.id}
                >
                  Բացել
                  <ChevronRight size={15} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Lessons;
```

- [ ] **Step 12.2: Smoke-тест**

Run: `npm start`
- Войти учителем → `/lessons` → видим экран «Թեմաներ դեռ չկան» с кнопкой ներմուծել.
- Нажать «Ներմուծել» → через 1-2 сек экран сменяется на список 6 уровней.
- В Firebase Console → Firestore → коллекция `topics` появилась с 9 (или сколько в seed) документами, у каждого подколлекция `questions`.
- Зайти учеником (другой Google) → видит те же темы.

- [ ] **Step 12.3: КОММИТ (вручную пользователем)**

Сообщение: `feat(lessons): load topics from Firestore + seed import button`.

### Task 13: Обновить `LessonTopic.js` — тянуть тему и вопросы из Firestore (без сохранения)

**Files:**
- Modify: `src/pages/LessonTopic/LessonTopic.js`

- [ ] **Step 13.1: Заменить импорт `topics` и логику получения темы**

В начале файла удалить:
```js
import topics from '../../data/topics';
import { recordQuestionAnswered } from '../../utils/progressStorage';
```

Добавить:
```js
import { getTopic, listTopics } from '../../data/topicsRepo';
import { listQuestions } from '../../data/questionsRepo';
```

Удалить (внутри `LessonTopic`):
```js
const topic = useMemo(() => topics.find((t) => t.id === topicId), [topicId]);
```

И добавить вместо этого useState + useEffect:

```js
const [topic, setTopic] = useState(null);
const [questions, setQuestions] = useState([]);
const [topicLoading, setTopicLoading] = useState(true);
const [allTopicsIds, setAllTopicsIds] = useState([]);

useEffect(() => {
  let cancel = false;
  setTopicLoading(true);
  (async () => {
    try {
      const [t, qs, all] = await Promise.all([
        getTopic(topicId),
        listQuestions(topicId),
        listTopics(),
      ]);
      if (cancel) return;
      setTopic(t);
      setQuestions(qs);
      setAllTopicsIds(all.map((x) => x.id));
    } finally {
      if (!cancel) setTopicLoading(false);
    }
  })();
  return () => { cancel = true; };
}, [topicId]);
```

Удалить старую строку:
```js
const questions = topic?.questions || [];
```

(теперь `questions` — state, выше).

Удалить вызов:
```js
recordQuestionAnswered(`${topic.id}-${currentQuestion.id}`);
```

в `handleSubmitAnswer` — он опирался на удалённый импорт.

Удалить `isLastTopic` через старый `topics` и заменить:
```js
const isLastTopic = useMemo(
  () => allTopicsIds.length > 0 && allTopicsIds[allTopicsIds.length - 1] === topicId,
  [allTopicsIds, topicId],
);
```

В `handleNextTopic` заменить:
```js
const handleNextTopic = useCallback(() => {
  const idx = allTopicsIds.indexOf(topicId);
  if (idx >= 0 && idx < allTopicsIds.length - 1) {
    navigate(`/lessons/${allTopicsIds[idx + 1]}`);
  } else {
    navigate('/lessons');
  }
}, [navigate, topicId, allTopicsIds]);
```

В блоке early-return перед `if (!topic)` добавить:
```js
if (topicLoading) {
  return <Card title="Բեռնում..." text="" />;
}
```

- [ ] **Step 13.2: Smoke-тест**

Run: `npm start`
- Зайти учеником → /lessons/proposition → видим теорию, вопросы, проходим тест → видим «3/5» (или сколько).
- Кнопка «Հաջորդ թեմա» переходит к следующей теме по `order`.

- [ ] **Step 13.3: КОММИТ (вручную пользователем)**

Сообщение: `feat(lesson-topic): load topic and questions from Firestore`.

### Task 14: Обновить поиск в Header — данные из Firestore

**Files:**
- Modify: `src/components/Header/Header.js`

- [ ] **Step 14.1: Заменить `import topics from '../../data/topics';` на real-time подписку**

Удалить:
```js
import topics from '../../data/topics';
```

Добавить:
```js
import { subscribeTopics } from '../../data/topicsRepo';
```

Внутри компонента добавить state + useEffect:
```js
const [allTopics, setAllTopics] = useState([]);
useEffect(() => subscribeTopics(setAllTopics, () => setAllTopics([])), []);
```

Заменить:
```js
const filteredTopics = useMemo(() => {
  const q = searchQuery.trim().toLowerCase();
  if (!q) return [];
  return topics.filter((topic) => topic.title.toLowerCase().includes(q));
}, [searchQuery]);
```

на:
```js
const filteredTopics = useMemo(() => {
  const qStr = searchQuery.trim().toLowerCase();
  if (!qStr) return [];
  return allTopics.filter((topic) => topic.title.toLowerCase().includes(qStr));
}, [searchQuery, allTopics]);
```

- [ ] **Step 14.2: Smoke-тест**

В Header набрать «Ասույթ» → дропдаун показывает темы. Поиск работает даже для гостя? Здесь нюанс: гость не имеет доступа к Firestore по rules → подписка молча вернёт пустой массив (мы передаём `() => setAllTopics([])` в onError). Поиск для гостя не работает — это OK, потому что гость и так не может зайти на `/lessons/*`.

- [ ] **Step 14.3: КОММИТ (вручную пользователем)**

Сообщение: `feat(header): search topics from Firestore`.

---

## Этап 4 — Прогресс ученика в Firestore

### Task 15: Создать `progressRepo` и тест формулы 10-балльной

**Files:**
- Create: `src/data/progressRepo.js`
- Create: `src/data/progressRepo.test.js`

- [ ] **Step 15.1: Создать `src/data/progressRepo.js`**

```js
import {
  collection, doc, getDoc, getDocs, addDoc, query, where, orderBy,
  runTransaction, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

export function score10From(correct, total) {
  if (!total || total <= 0) return 0;
  return Math.round((correct / total) * 10);
}

export async function saveAttempt(uid, attempt) {
  const { topicId, totalQuestions, correctAnswers, answers, startedAt } = attempt;
  const score10 = score10From(correctAnswers, totalQuestions);

  const attemptsCol = collection(db, 'progress', uid, 'attempts');
  const attemptRef = doc(attemptsCol);

  await runTransaction(db, async (tx) => {
    const userRef = doc(db, 'progress', uid);
    const userSnap = await tx.get(userRef);
    const prev = userSnap.exists() ? (userSnap.data().byTopic || {}) : {};
    const prevTopic = prev[topicId] || { bestScore10: 0, lastScore10: 0, attemptsCount: 0 };

    tx.set(attemptRef, {
      topicId,
      totalQuestions,
      correctAnswers,
      score10,
      answers,
      startedAt: startedAt ? Timestamp.fromDate(new Date(startedAt)) : serverTimestamp(),
      finishedAt: serverTimestamp(),
    });

    tx.set(userRef, {
      lastActiveAt: serverTimestamp(),
      byTopic: {
        ...prev,
        [topicId]: {
          bestScore10: Math.max(prevTopic.bestScore10 || 0, score10),
          lastScore10: score10,
          attemptsCount: (prevTopic.attemptsCount || 0) + 1,
        },
      },
    }, { merge: true });
  });

  return { score10, attemptId: attemptRef.id };
}

export async function getMyProgress(uid) {
  const snap = await getDoc(doc(db, 'progress', uid));
  return snap.exists() ? snap.data() : null;
}

export async function listAllProgress() {
  const snap = await getDocs(collection(db, 'progress'));
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
}

export async function listAttempts(uid, topicId) {
  const snap = await getDocs(
    query(
      collection(db, 'progress', uid, 'attempts'),
      where('topicId', '==', topicId),
      orderBy('finishedAt', 'desc'),
    ),
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
```

- [ ] **Step 15.2: Создать unit-тест формулы `src/data/progressRepo.test.js`**

```js
import { score10From } from './progressRepo';

describe('score10From', () => {
  it('возвращает 10 при 5/5', () => {
    expect(score10From(5, 5)).toBe(10);
  });
  it('возвращает 8 при 4/5', () => {
    expect(score10From(4, 5)).toBe(8);
  });
  it('возвращает 6 при 3/5', () => {
    expect(score10From(3, 5)).toBe(6);
  });
  it('возвращает 0 при 0/5', () => {
    expect(score10From(0, 5)).toBe(0);
  });
  it('возвращает 0 при total=0 (защита от деления на 0)', () => {
    expect(score10From(0, 0)).toBe(0);
  });
  it('округляет: 7 правильных из 10 → 7', () => {
    expect(score10From(7, 10)).toBe(7);
  });
  it('округляет: 1 из 3 → 3 (Math.round(3.33))', () => {
    expect(score10From(1, 3)).toBe(3);
  });
});
```

- [ ] **Step 15.3: Запустить тест**

Run: `npm test -- --watchAll=false src/data/progressRepo.test.js`
Expected: 7 тестов прошли.

- [ ] **Step 15.4: КОММИТ (вручную пользователем)**

Сообщение: `feat(progress): add progressRepo with score10 formula and tests`.

### Task 16: Подключить `saveAttempt` в `LessonTopic.js`

**Files:**
- Modify: `src/pages/LessonTopic/LessonTopic.js`

- [ ] **Step 16.1: Добавить импорты и сохранение в финале квиза**

В начале файла добавить:
```js
import { saveAttempt } from '../../data/progressRepo';
import { useAuth } from '../../auth/AuthContext';
```

Внутри `LessonTopic`:
```js
const { user } = useAuth();
const [saveError, setSaveError] = useState('');
const [savedScore10, setSavedScore10] = useState(null);
const [startedAt] = useState(() => Date.now());
```

Изменить `handleSubmitAnswer` — добавить блок сохранения, когда квиз заканчивается. Текущий код:
```js
} else {
  setQuizCompleted(true);
}
```

Заменить на:
```js
} else {
  setQuizCompleted(true);
  if (user) {
    const finalScore = score + (correct ? 1 : 0);
    const answers = newAnswers.map((sel, i) => {
      const qq = questions[i];
      return {
        questionId: qq.id,
        selectedOption: sel,
        correctOption: qq.correctOption,
        isCorrect: sel === qq.correctOption,
      };
    });
    saveAttempt(user.uid, {
      topicId: topic.id,
      totalQuestions: questions.length,
      correctAnswers: finalScore,
      answers,
      startedAt,
    })
      .then(({ score10 }) => setSavedScore10(score10))
      .catch(() => setSaveError('Արդյունքը չպահպանվեց։'));
  }
}
```

Обновить зависимости `useCallback`:
```js
}, [
  selectedOption, currentQuestion, currentQuestionIdx, userAnswers,
  topic, questions, user, score, startedAt,
]);
```

- [ ] **Step 16.2: Показать 10-балльную оценку в финальном экране**

Найти блок где `<QuizScoreSummary score={score} questionCount={questions.length} />` (две штуки — в `quizCompleted && showReview` и в `quizCompleted`).

Под каждым добавить:
```jsx
{savedScore10 !== null && (
  <div style={{
    textAlign: 'center', fontSize: 22, fontWeight: 800,
    color: '#0f172a', marginTop: 12,
  }}>
    Գնահատական՝ {savedScore10}/10
  </div>
)}
{saveError && (
  <div style={{ textAlign: 'center', color: '#dc2626', marginTop: 8 }}>
    {saveError}
  </div>
)}
```

- [ ] **Step 16.3: Сбросить `savedScore10` и `saveError` при retry**

В `handleRetry` добавить:
```js
setSavedScore10(null);
setSaveError('');
```

Также сбросить в `useEffect` который реагирует на `topicId`.

- [ ] **Step 16.4: Smoke-тест**

- Войти учеником → пройти тест по теме → видим «Գնահատական՝ N/10».
- В Firestore Console → `progress/{uid}` есть `byTopic[topicId]`, в `progress/{uid}/attempts` появилась запись с `answers`, `score10`, `finishedAt`.
- Пройти тест второй раз с другим результатом → `byTopic[topicId].attemptsCount = 2`, `bestScore10 = max`.

- [ ] **Step 16.5: КОММИТ (вручную пользователем)**

Сообщение: `feat(lesson-topic): save attempt to Firestore with 10-point score`.

### Task 17: Решение по `progressStorage.js` (документ-комментарий)

**Files:**
- Modify: `src/utils/progressStorage.js` (только добавить шапку-комментарий)

- [ ] **Step 17.1: Добавить шапку-комментарий в `progressStorage.js`**

В самом верху файла добавить:
```js
// Guest progress storage (localStorage).
// Используется ТОЛЬКО для маркетинговых виджетов на главной странице
// (CTASection, AchievementsSection, DailyChallenge), чтобы гости видели
// какой-то прогресс без авторизации. Реальный учебный прогресс ученика
// после теста хранится в Firestore через progressRepo.
```

(Это единственная правка — мы НЕ удаляем файл, потому что Home для гостей не должен ломаться. Удалили только вызов `recordQuestionAnswered` из `LessonTopic.js` в Task 13.)

- [ ] **Step 17.2: КОММИТ (вручную пользователем)**

Сообщение: `docs(progress): clarify progressStorage scope (guest widgets only)`.

---

## Этап 5 — CRUD для учителя

### Task 18: Кнопки управления темами на `/lessons` (только учителю)

**Files:**
- Modify: `src/pages/Lessons/Lessons.js`

- [ ] **Step 18.1: Добавить состояние редактора и обработчики**

В импортах добавить:
```js
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { deleteTopic } from '../../data/topicsRepo';
import TopicEditor from '../../components/TopicEditor/TopicEditor';
```

В компоненте `Lessons` добавить state:
```js
const [editingTopic, setEditingTopic] = useState(null); // null | 'new' | {topic object}
```

Добавить хендлеры:
```js
const openCreate = () => setEditingTopic('new');
const openEdit = (t) => setEditingTopic(t);
const closeEditor = () => setEditingTopic(null);

const onDelete = async (t) => {
  if (!window.confirm(`Ջնջե՞լ թեման «${t.title}»։ Բոլոր հարցերն ու աշակերտների փորձերը կկորչեն։`)) return;
  try {
    await deleteTopic(t.id);
  } catch {
    alert('Ջնջումը չհաջողվեց։');
  }
};
```

- [ ] **Step 18.2: Добавить кнопки в JSX**

На экране списка уровней (selectedLevel === null) в самом верху, ПОСЛЕ `<motion.p>...</motion.p>` (перед `<div className="grid ...">`) добавить:

```jsx
{isTeacher && (
  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
    <button
      onClick={openCreate}
      type="button"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '10px 18px', borderRadius: 12,
        background: 'linear-gradient(135deg,#10b981,#059669)',
        color: '#fff', border: 'none', cursor: 'pointer',
        fontWeight: 700,
      }}
    >
      <Plus size={16} />
      Ավելացնել թեմա
    </button>
  </div>
)}
```

На экране тем уровня (после `Մակարդակ N` подзаголовка) в `filteredTopics.map(...)` ПОСЛЕ блока `<div className="mt-auto pt-4">...</div>` добавить:

```jsx
{isTeacher && (
  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
    <button
      onClick={() => openEdit(t)} type="button"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '6px 10px', borderRadius: 8,
        background: '#fff', border: '1px solid #e2e8f0', cursor: 'pointer',
        fontSize: 13 }}
    >
      <Pencil size={13} /> Խմբագրել
    </button>
    <button
      onClick={() => onDelete(t)} type="button"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '6px 10px', borderRadius: 8,
        background: '#fff', border: '1px solid #fecaca', color: '#dc2626',
        cursor: 'pointer', fontSize: 13 }}
    >
      <Trash2 size={13} /> Ջնջել
    </button>
  </div>
)}
```

В самом конце JSX компонента (перед `</div>` верхнего враппера) добавить:

```jsx
{editingTopic && (
  <TopicEditor
    topic={editingTopic === 'new' ? null : editingTopic}
    onClose={closeEditor}
  />
)}
```

- [ ] **Step 18.3: КОММИТ (вручную пользователем) — после создания TopicEditor (Task 19)**

(Откладываем коммит до Task 19, иначе `Lessons.js` будет ссылаться на несуществующий компонент.)

### Task 19: `TopicEditor` модалка

**Files:**
- Create: `src/components/TopicEditor/TopicEditor.js`
- Create: `src/components/TopicEditor/TopicEditor.css`

- [ ] **Step 19.1: Создать `src/components/TopicEditor/TopicEditor.js`**

```js
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { saveTopic } from '../../data/topicsRepo';
import { useAuth } from '../../auth/AuthContext';
import QuestionsEditor from './QuestionsEditor';
import './TopicEditor.css';

export default function TopicEditor({ topic, onClose }) {
  const { user } = useAuth();
  const isNew = !topic;
  const [tab, setTab] = useState('topic');
  const [form, setForm] = useState({
    id: topic?.id || '',
    level: topic?.level || 1,
    title: topic?.title || '',
    description: topic?.description || '',
    text: topic?.text || '',
    examples: (topic?.examples || []).join('\n'),
    order: topic?.order || 0,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onSave = async () => {
    setError('');
    if (!form.id.trim()) return setError('ID-ն պարտադիր է (լատինական, օր. proposition)');
    if (!/^[a-z0-9_-]+$/.test(form.id)) return setError('ID՝ միայն լատինական տառեր/թվեր/_-');
    if (!form.title.trim()) return setError('Վերնագիրը պարտադիր է');
    if (!form.text.trim()) return setError('Տեսության տեքստը պարտադիր է');
    setSaving(true);
    try {
      await saveTopic(form.id, {
        level: Number(form.level),
        title: form.title.trim(),
        description: form.description.trim(),
        text: form.text,
        examples: form.examples.split('\n').map((s) => s.trim()).filter(Boolean),
        order: Number(form.order),
        ...(topic?.createdAt ? { createdAt: topic.createdAt } : {}),
      }, user?.email || '');
      if (isNew) {
        // Перейти к вкладке вопросов, чтобы сразу добавить
        setTab('questions');
      } else {
        onClose();
      }
    } catch (e) {
      setError('Չհաջողվեց պահպանել։');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="topicEditor__backdrop" onClick={onClose}>
      <div className="topicEditor" onClick={(e) => e.stopPropagation()}>
        <div className="topicEditor__head">
          <h2 className="topicEditor__title">
            {isNew ? 'Նոր թեմա' : `Խմբագրել՝ ${topic.title}`}
          </h2>
          <button onClick={onClose} type="button" className="topicEditor__close">
            <X size={20} />
          </button>
        </div>

        <div className="topicEditor__tabs">
          <button
            type="button"
            className={`topicEditor__tab ${tab === 'topic' ? 'is-active' : ''}`}
            onClick={() => setTab('topic')}
          >
            Թեմա
          </button>
          <button
            type="button"
            className={`topicEditor__tab ${tab === 'questions' ? 'is-active' : ''}`}
            onClick={() => setTab('questions')}
            disabled={isNew && !topic}
            title={isNew ? 'Նախ պահպանեք թեման' : ''}
          >
            Հարցեր
          </button>
        </div>

        {tab === 'topic' && (
          <div className="topicEditor__body">
            <label className="topicEditor__label">
              ID
              <input
                className="topicEditor__input"
                value={form.id}
                disabled={!isNew}
                onChange={(e) => setForm({ ...form, id: e.target.value })}
                placeholder="proposition"
              />
            </label>
            <label className="topicEditor__label">
              Մակարդակ (1-6)
              <input
                className="topicEditor__input"
                type="number" min="1" max="6"
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
              />
            </label>
            <label className="topicEditor__label">
              Հերթականություն
              <input
                className="topicEditor__input"
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
              />
            </label>
            <label className="topicEditor__label">
              Վերնագիր
              <input
                className="topicEditor__input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </label>
            <label className="topicEditor__label">
              Կարճ նկարագրություն
              <input
                className="topicEditor__input"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>
            <label className="topicEditor__label">
              Տեսության տեքստ
              <textarea
                className="topicEditor__textarea"
                rows={10}
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
              />
            </label>
            <label className="topicEditor__label">
              Օրինակներ (մեկ տողում մեկ օրինակ)
              <textarea
                className="topicEditor__textarea"
                rows={4}
                value={form.examples}
                onChange={(e) => setForm({ ...form, examples: e.target.value })}
              />
            </label>

            {error && <div className="topicEditor__error">{error}</div>}

            <div className="topicEditor__actions">
              <button onClick={onClose} type="button" className="topicEditor__btn topicEditor__btn--ghost">
                Չեղարկել
              </button>
              <button onClick={onSave} type="button" disabled={saving} className="topicEditor__btn topicEditor__btn--primary">
                {saving ? 'Պահպանվում է...' : 'Պահպանել'}
              </button>
            </div>
          </div>
        )}

        {tab === 'questions' && form.id && (
          <QuestionsEditor topicId={form.id} />
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 19.2: Создать `src/components/TopicEditor/TopicEditor.css`**

```css
.topicEditor__backdrop {
  position: fixed; inset: 0; z-index: 100;
  background: rgba(15, 23, 42, 0.5);
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
}

.topicEditor {
  background: #fff; border-radius: 16px;
  width: 100%; max-width: 720px; max-height: 90vh;
  display: flex; flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 64px -16px rgba(15,23,42,0.4);
}

.topicEditor__head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px 20px; border-bottom: 1px solid #f1f5f9;
}

.topicEditor__title { margin: 0; font-size: 18px; font-weight: 800; color: #0f172a; }

.topicEditor__close {
  background: transparent; border: none; cursor: pointer; padding: 6px;
  border-radius: 8px; color: #64748b;
}
.topicEditor__close:hover { background: #f1f5f9; }

.topicEditor__tabs {
  display: flex; gap: 4px; padding: 8px 12px;
  border-bottom: 1px solid #f1f5f9;
}

.topicEditor__tab {
  padding: 8px 16px; border: none; background: transparent; cursor: pointer;
  font-weight: 600; color: #64748b; border-radius: 8px;
}
.topicEditor__tab:hover:not(:disabled) { color: #0f172a; background: #f1f5f9; }
.topicEditor__tab.is-active { color: #3b82f6; background: #eff6ff; }
.topicEditor__tab:disabled { opacity: 0.4; cursor: not-allowed; }

.topicEditor__body {
  padding: 20px;
  overflow-y: auto;
  display: flex; flex-direction: column; gap: 12px;
}

.topicEditor__label {
  display: flex; flex-direction: column; gap: 4px;
  font-size: 13px; font-weight: 600; color: #475569;
}

.topicEditor__input,
.topicEditor__textarea {
  font: inherit;
  padding: 10px 12px; border: 1px solid #e2e8f0; border-radius: 10px;
  background: #fff; color: #0f172a;
  font-weight: 400;
}

.topicEditor__textarea { resize: vertical; min-height: 80px; font-family: inherit; }

.topicEditor__input:focus, .topicEditor__textarea:focus {
  outline: none; border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,0.15);
}

.topicEditor__error {
  background: #fef2f2; color: #b91c1c; padding: 10px 14px; border-radius: 10px;
  font-size: 14px; font-weight: 500;
}

.topicEditor__actions {
  display: flex; gap: 8px; justify-content: flex-end; margin-top: 8px;
}

.topicEditor__btn {
  padding: 10px 18px; border-radius: 10px; border: none; cursor: pointer;
  font-weight: 700; font-size: 14px;
}

.topicEditor__btn--ghost {
  background: #fff; color: #475569; border: 1px solid #e2e8f0;
}

.topicEditor__btn--primary {
  background: linear-gradient(135deg, #3b82f6, #6366f1); color: #fff;
}

.topicEditor__btn:disabled { opacity: 0.6; cursor: not-allowed; }
```

- [ ] **Step 19.3: КОММИТ (вручную пользователем) — после создания QuestionsEditor (Task 20)**

(Откладываем до Task 20.)

### Task 20: `QuestionsEditor` и `QuestionForm`

**Files:**
- Create: `src/components/TopicEditor/QuestionsEditor.js`
- Create: `src/components/TopicEditor/QuestionForm.js`

- [ ] **Step 20.1: Создать `src/components/TopicEditor/QuestionsEditor.js`**

```js
import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { subscribeQuestions, deleteQuestion } from '../../data/questionsRepo';
import QuestionForm from './QuestionForm';

export default function QuestionsEditor({ topicId }) {
  const [questions, setQuestions] = useState([]);
  const [editingId, setEditingId] = useState(null); // null | 'new' | questionId

  useEffect(() => subscribeQuestions(topicId, setQuestions), [topicId]);

  const onDelete = async (qid) => {
    if (!window.confirm('Ջնջե՞լ այս հարցը։')) return;
    await deleteQuestion(topicId, qid);
  };

  return (
    <div style={{ padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>
          Հարցեր ({questions.length})
        </h3>
        <button
          onClick={() => setEditingId('new')}
          type="button"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 10,
            background: 'linear-gradient(135deg,#10b981,#059669)',
            color: '#fff', border: 'none', cursor: 'pointer',
            fontWeight: 700, fontSize: 13,
          }}
        >
          <Plus size={14} />
          Ավելացնել հարց
        </button>
      </div>

      {questions.map((q, i) => (
        <div key={q.id} style={{
          border: '1px solid #e2e8f0', borderRadius: 12, padding: 12,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>#{i + 1}</div>
            <div style={{ fontWeight: 600, marginBottom: 6 }}>{q.question}</div>
            <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: '#475569' }}>
              {q.options.map((opt, j) => (
                <li key={j} style={{
                  fontWeight: j === q.correctOption ? 700 : 400,
                  color: j === q.correctOption ? '#10b981' : '#475569',
                }}>
                  {opt} {j === q.correctOption && '✓'}
                </li>
              ))}
            </ol>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setEditingId(q.id)} type="button" style={btnStyle}>
              Խմբագրել
            </button>
            <button onClick={() => onDelete(q.id)} type="button" style={{ ...btnStyle, color: '#dc2626', borderColor: '#fecaca' }}>
              Ջնջել
            </button>
          </div>
        </div>
      ))}

      {questions.length === 0 && (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: 20 }}>
          Հարցեր դեռ չկան։ Ավելացրեք առաջինը։
        </p>
      )}

      {editingId !== null && (
        <QuestionForm
          topicId={topicId}
          existing={editingId === 'new' ? null : questions.find((q) => q.id === editingId)}
          nextOrder={questions.length}
          onClose={() => setEditingId(null)}
        />
      )}
    </div>
  );
}

const btnStyle = {
  padding: '6px 10px', borderRadius: 8,
  background: '#fff', border: '1px solid #e2e8f0',
  cursor: 'pointer', fontSize: 12, fontWeight: 600,
};
```

- [ ] **Step 20.2: Создать `src/components/TopicEditor/QuestionForm.js`**

```js
import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { saveQuestion, validateQuestion } from '../../data/questionsRepo';

export default function QuestionForm({ topicId, existing, nextOrder, onClose }) {
  const isNew = !existing;
  const [form, setForm] = useState({
    id: existing?.id || `q${Date.now()}`,
    type: 'radio',
    question: existing?.question || '',
    options: existing?.options || ['', ''],
    correctOption: existing?.correctOption ?? 0,
    order: existing?.order ?? nextOrder,
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const setOption = (i, v) => {
    const next = [...form.options];
    next[i] = v;
    setForm({ ...form, options: next });
  };

  const addOption = () => setForm({ ...form, options: [...form.options, ''] });

  const removeOption = (i) => {
    if (form.options.length <= 2) return;
    const next = form.options.filter((_, idx) => idx !== i);
    let nextCorrect = form.correctOption;
    if (i === form.correctOption) nextCorrect = 0;
    else if (i < form.correctOption) nextCorrect = form.correctOption - 1;
    setForm({ ...form, options: next, correctOption: nextCorrect });
  };

  const onSave = async () => {
    setError('');
    const err = validateQuestion(form);
    if (err) return setError(err);
    setSaving(true);
    try {
      await saveQuestion(topicId, form.id, {
        type: form.type,
        question: form.question.trim(),
        options: form.options.map((o) => o.trim()),
        correctOption: Number(form.correctOption),
        order: Number(form.order),
      });
      onClose();
    } catch {
      setError('Չհաջողվեց պահպանել։');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        zIndex: 110,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 16, width: '100%', maxWidth: 560,
          maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ margin: 0, fontWeight: 700 }}>{isNew ? 'Նոր հարց' : 'Խմբագրել հարցը'}</h3>
          <button onClick={onClose} type="button" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }}>
          <label style={lbl}>
            Հարց
            <textarea
              rows={3}
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
              style={inp}
            />
          </label>

          <div>
            <div style={{ ...lbl, marginBottom: 8 }}>Տարբերակներ (նշեք ճիշտը)</div>
            {form.options.map((opt, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <input
                  type="radio"
                  name="correct"
                  checked={form.correctOption === i}
                  onChange={() => setForm({ ...form, correctOption: i })}
                />
                <input
                  value={opt}
                  onChange={(e) => setOption(i, e.target.value)}
                  style={{ ...inp, flex: 1 }}
                  placeholder={`Տարբերակ ${i + 1}`}
                />
                <button
                  onClick={() => removeOption(i)}
                  type="button"
                  disabled={form.options.length <= 2}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#dc2626' }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={addOption} type="button"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', borderRadius: 8,
                background: '#fff', border: '1px dashed #94a3b8', cursor: 'pointer',
                fontSize: 13, color: '#475569',
              }}
            >
              <Plus size={13} />
              Տարբերակ
            </button>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', color: '#b91c1c', padding: 10, borderRadius: 10, fontSize: 14 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <button onClick={onClose} type="button" style={btnGhost}>Չեղարկել</button>
            <button onClick={onSave} type="button" disabled={saving} style={btnPrimary}>
              {saving ? 'Պահպանվում է...' : 'Պահպանել'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const lbl = { fontSize: 13, fontWeight: 600, color: '#475569', display: 'flex', flexDirection: 'column', gap: 4 };
const inp = { font: 'inherit', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 10, fontFamily: 'inherit' };
const btnPrimary = { padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff' };
const btnGhost = { padding: '10px 18px', borderRadius: 10, cursor: 'pointer', fontWeight: 700, background: '#fff', color: '#475569', border: '1px solid #e2e8f0' };
```

- [ ] **Step 20.3: Smoke-тест CRUD**

Run: `npm start`
Под учителем:
- `/lessons` → на экране уровней видна кнопка «Ավելացնել թեմա». Клик → модалка с пустой формой.
- Заполнить ID (например `test1`), level=1, title, description, text=«тестовая теория» → «Պահպանել». Переход на вкладку «Հարցեր».
- «Ավելացնել հարց» → модалка вопроса. Ввести вопрос «2+2=?», тарбер «3», «4», «5» → выбрать ճիշտ=«4» → Պահպանել.
- Закрыть редактор. На `/lessons` → Մակարդակ 1 → видна новая тема «test1».
- Открыть «Խմբագրել» → изменить title → видим в списке обновлённый.
- Открыть в другой вкладке как ученик → темы видны (real-time через onSnapshot).
- «Ջնջել» → confirm → тема и вопросы удаляются.
- В Firebase Console подколлекция `questions` тоже пустая для удалённой темы.

- [ ] **Step 20.4: КОММИТ (вручную пользователем)**

Сообщение: `feat(crud): topic and question editors for teacher`.

### Task 21: Кнопка «Խմբագրել» на странице темы (для учителя)

**Files:**
- Modify: `src/pages/LessonTopic/LessonTopic.js`

- [ ] **Step 21.1: Добавить иконку «Խմբագրել»**

В импорты добавить:
```js
import { Pencil } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import TopicEditor from '../../components/TopicEditor/TopicEditor';
```

(`useAuth` уже импортирован в Task 16.)

Внутри компонента state:
```js
const { isTeacher } = useAuth(); // user уже из Task 16
const [showEditor, setShowEditor] = useState(false);
```

В JSX рядом с `<h1 className="topic__title">{topic.title}</h1>` обернуть в flex и добавить кнопку:

```jsx
<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
  <h1 className="topic__title" style={{ margin: 0 }}>{topic.title}</h1>
  {isTeacher && (
    <button
      onClick={() => setShowEditor(true)}
      type="button"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '6px 12px', borderRadius: 10,
        background: '#fff', border: '1px solid #e2e8f0', cursor: 'pointer',
        fontSize: 13, fontWeight: 600,
      }}
    >
      <Pencil size={13} /> Խմբագրել
    </button>
  )}
</div>
```

В конец компонента (перед `</div>` корня) добавить:
```jsx
{showEditor && (
  <TopicEditor topic={topic} onClose={() => {
    setShowEditor(false);
    // Перезагрузить тему, чтобы увидеть свежие данные
    window.location.reload();
  }} />
)}
```

(Простой `window.location.reload()` достаточно — учитель редактирует редко.)

- [ ] **Step 21.2: Smoke-тест**

Зайти учителем на `/lessons/proposition` → видна кнопка «Խմբագրել». Клик → редактор → правка → close → страница перезагружается с новыми данными.

- [ ] **Step 21.3: КОММИТ (вручную пользователем)**

Сообщение: `feat(lesson-topic): add edit button for teacher`.

---

## Этап 6 — Журнал оценок `/grades`

### Task 22: Реализовать `Grades.js` — таблица «ученик × тема»

**Files:**
- Modify: `src/pages/Grades/Grades.js`
- Create: `src/pages/Grades/Grades.css`

- [ ] **Step 22.1: Полностью переписать `src/pages/Grades/Grades.js`**

```js
import { useEffect, useState, useMemo } from 'react';
import { listAllProgress } from '../../data/progressRepo';
import { listTopics } from '../../data/topicsRepo';
import AttemptsModal from './AttemptsModal';
import './Grades.css';

export default function Grades() {
  const [progress, setProgress] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null); // {uid, displayName, topicId, topicTitle}

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([listAllProgress(), listTopics()])
      .then(([p, t]) => {
        setProgress(p);
        setTopics(t);
      })
      .catch(() => setError('Չհաջողվեց բեռնել տվյալները։'))
      .finally(() => setLoading(false));
  }, []);

  const sortedStudents = useMemo(
    () => [...progress].sort((a, b) => (a.displayName || a.email || '').localeCompare(b.displayName || b.email || '')),
    [progress],
  );

  if (loading) return <div className="grades-page"><p>Բեռնում...</p></div>;
  if (error) return <div className="grades-page"><p style={{ color: '#dc2626' }}>{error}</p></div>;

  return (
    <div className="grades-page">
      <h1 className="grades-title">Մատյան</h1>
      <p className="grades-subtitle">{sortedStudents.length} աշակերտ • {topics.length} թեմա</p>

      {sortedStudents.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>
          Աշակերտներ դեռ չկան։ Աշակերտները կհայտնվեն մուտքից հետո։
        </p>
      ) : (
        <div className="grades-tableWrap">
          <table className="grades-table">
            <thead>
              <tr>
                <th className="grades-stickyCol">Աշակերտ</th>
                {topics.map((t) => (
                  <th key={t.id} title={t.title}>{t.title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedStudents.map((s) => (
                <tr key={s.uid}>
                  <td className="grades-stickyCol grades-student">
                    <div className="grades-studentName">{s.displayName || '—'}</div>
                    <div className="grades-studentEmail">{s.email}</div>
                  </td>
                  {topics.map((t) => {
                    const cell = s.byTopic?.[t.id];
                    return (
                      <td
                        key={t.id}
                        className={cell ? 'grades-cell grades-cell--hasData' : 'grades-cell'}
                        onClick={() => cell && setSelected({
                          uid: s.uid,
                          displayName: s.displayName || s.email,
                          topicId: t.id,
                          topicTitle: t.title,
                        })}
                      >
                        {cell ? (
                          <>
                            <strong>{cell.bestScore10}</strong>
                            <span className="grades-cellMeta">
                              վերջին՝ {cell.lastScore10} • {cell.attemptsCount} փորձ
                            </span>
                          </>
                        ) : '—'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <AttemptsModal
          {...selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 22.2: Создать `src/pages/Grades/Grades.css`**

```css
.grades-page {
  max-width: 1400px; margin: 0 auto; padding: 32px 24px;
}

.grades-title {
  font-size: 32px; font-weight: 800; color: #0f172a; margin: 0 0 8px;
}

.grades-subtitle {
  color: #64748b; margin: 0 0 24px;
}

.grades-tableWrap {
  overflow-x: auto;
  border: 1px solid #e2e8f0; border-radius: 14px; background: #fff;
}

.grades-table {
  width: 100%; border-collapse: separate; border-spacing: 0;
  font-size: 14px;
}

.grades-table th, .grades-table td {
  padding: 10px 14px; text-align: center;
  border-bottom: 1px solid #f1f5f9;
}

.grades-table th {
  background: #f8fafc; font-weight: 700; color: #475569;
  font-size: 13px; position: sticky; top: 0; z-index: 2;
  max-width: 160px; white-space: normal;
}

.grades-stickyCol {
  position: sticky; left: 0; background: #fff; z-index: 3;
  text-align: left; min-width: 200px;
  border-right: 1px solid #f1f5f9;
}

.grades-table thead .grades-stickyCol { background: #f8fafc; z-index: 4; }

.grades-student { padding: 12px 14px; }
.grades-studentName { font-weight: 600; color: #0f172a; }
.grades-studentEmail { font-size: 12px; color: #94a3b8; }

.grades-cell {
  font-weight: 600; color: #94a3b8;
}

.grades-cell--hasData {
  cursor: pointer; color: #0f172a;
  display: flex; flex-direction: column; gap: 2px; align-items: center;
}

.grades-cell--hasData strong { font-size: 18px; font-weight: 800; color: #3b82f6; }

.grades-cellMeta {
  font-size: 11px; font-weight: 500; color: #94a3b8;
}

.grades-cell--hasData:hover { background: #eff6ff; }
```

- [ ] **Step 22.3: КОММИТ (вручную пользователем) — после AttemptsModal**

(Откладываем коммит до Task 23.)

### Task 23: `AttemptsModal` — попытки конкретного ученика по теме

**Files:**
- Create: `src/pages/Grades/AttemptsModal.js`

- [ ] **Step 23.1: Создать `src/pages/Grades/AttemptsModal.js`**

```js
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { listAttempts } from '../../data/progressRepo';

function fmtDate(ts) {
  if (!ts) return '—';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString('hy-AM');
  } catch {
    return '—';
  }
}

export default function AttemptsModal({ uid, displayName, topicId, topicTitle, onClose }) {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    listAttempts(uid, topicId)
      .then(setAttempts)
      .catch(() => setError('Չհաջողվեց բեռնել փորձերը։'))
      .finally(() => setLoading(false));
  }, [uid, topicId]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff', borderRadius: 16, width: '100%', maxWidth: 640,
          maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #f1f5f9' }}>
          <div>
            <div style={{ fontSize: 13, color: '#64748b' }}>{displayName}</div>
            <h3 style={{ margin: 0, fontWeight: 700 }}>{topicTitle}</h3>
          </div>
          <button onClick={onClose} type="button" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: 20, overflowY: 'auto' }}>
          {loading && <p>Բեռնում...</p>}
          {error && <p style={{ color: '#dc2626' }}>{error}</p>}
          {!loading && !error && attempts.length === 0 && (
            <p style={{ color: '#94a3b8', textAlign: 'center' }}>Փորձեր չկան։</p>
          )}
          {!loading && !error && attempts.map((a) => (
            <div key={a.id} style={{
              border: '1px solid #e2e8f0', borderRadius: 12, padding: 14, marginBottom: 10,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#3b82f6' }}>{a.score10}/10</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{fmtDate(a.finishedAt)}</div>
              </div>
              <div style={{ fontSize: 13, color: '#475569' }}>
                {a.correctAnswers}/{a.totalQuestions} ճիշտ պատասխան
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 23.2: Smoke-тест**

Под учителем:
- Открыть `/grades` через UserMenu → «Մատյան».
- Если есть хотя бы один ученик с попыткой — видна таблица, ячейка с числом подсвечена.
- Клик по ячейке → модалка с попытками этого ученика по этой теме (сортировка по дате убывания).

Если учеников нет — попросить ученика войти и пройти один тест, перезагрузить `/grades`.

- [ ] **Step 23.3: КОММИТ (вручную пользователем)**

Сообщение: `feat(grades): teacher gradebook with attempts modal`.

---

## Финальные шаги

### Task 24: Cleanup — убрать неиспользуемые импорты

**Files:**
- Review: все файлы из этого плана

- [ ] **Step 24.1: Запустить линтер**

Run: `npm start`
Смотреть warnings в терминале и в браузерной консоли. Найти строки вида `Line X:Y: 'foo' is defined but never used` и удалить ненужные импорты.

Главные кандидаты:
- `src/pages/LessonTopic/LessonTopic.js` — после Task 13 может остаться неиспользуемый `useMemo` или `topics`.
- `src/pages/Lessons/Lessons.js` — `topicsByLevel` теперь зависит от state, проверить.

- [ ] **Step 24.2: КОММИТ (вручную пользователем)**

Сообщение: `chore: remove unused imports`.

### Task 25: README — инструкция учителю

**Files:**
- Create or Modify: `README.md`

- [ ] **Step 25.1: Добавить раздел в README**

Если `README.md` уже есть — добавить в конец секцию:

```markdown
## Firebase Setup (one-time)

1. Создайте `.env.local` в корне с переменными `REACT_APP_FIREBASE_*` (см. `.env.example`).
2. Firebase Console → Authentication → Sign-in method → включить **Google**.
3. Authentication → Settings → Authorized domains → убедиться что есть `localhost`.
4. Firestore → Rules → вставить содержимое `firestore.rules` → Publish.
5. `npm install` и `npm start`.
6. Войти как учитель (`zahalyankhachik-2@aspu.am`), на `/lessons` нажать «Ներմուծել նախնական դասերը».

## Роли

- Учитель — хардкод email `zahalyankhachik-2@aspu.am`. CRUD тем/вопросов на `/lessons`, журнал `/grades`.
- Ученик — любой другой Google email. Проходит тесты, оценки сохраняются в Firestore.
```

- [ ] **Step 25.2: КОММИТ (вручную пользователем)**

Сообщение: `docs: add Firebase setup instructions to README`.

---

## Self-Review (Claude — проверка плана)

**Spec coverage:**

| Раздел спеки | Задача |
|---|---|
| 3.2 Роли | Task 3 (`TEACHER_EMAIL`, `isTeacherEmail`) |
| 3.3 Маршруты | Task 8 (`App.js`), Task 7 (`/login`), Task 22 (`/grades`) |
| 3.4 Файлы | Все задачи покрывают |
| 4.1 `topics` | Task 10 (`saveTopic`), 11 (seed), 12 (read) |
| 4.2 `questions` подколлекция | Task 10, 20 |
| 4.3 `progress` + attempts | Task 15, 16 |
| 5. Security Rules | Task 4 |
| 6.1 Вход | Task 5 (signIn), 7 (страница) |
| 6.2 CRUD темы | Task 18, 19 |
| 6.3 CRUD вопросов | Task 20 |
| 6.4 Прохождение теста | Task 16 |
| 6.5 Журнал | Task 22, 23 |
| 6.6 Seed | Task 11, 12 (баннер) |
| 7. Edge-cases | Покрыто в коде задач (валидация, confirm, loader, error toast) |
| 8. Этапы | Группировка задач 1–25 по 6 этапам |

**Placeholder scan:** проверено — placeholder'ов вида «TBD», «implement later» нет. Все код-шаги содержат полный код.

**Type consistency:**
- `score10From(correct, total)` — везде та же сигнатура.
- `saveAttempt(uid, attempt)` — attempt содержит `{topicId, totalQuestions, correctAnswers, answers, startedAt}` — везде одинаково.
- `subscribeTopics(callback, onError)` — в `Lessons.js` и `Header.js` используется консистентно.
- `saveTopic(topicId, data, userEmail)` — в `TopicEditor.js` вызывается с этими аргументами.
- `validateQuestion(q)` — экспортируется в `questionsRepo.js`, используется в `QuestionForm.js`.

**Decision на отложенные пункты:**
- `progressStorage.js` — НЕ удаляем (Home для гостей зависит). Document-comment в Task 17.
- Real-time для журнала — НЕ делаем (используем разовый `getDocs`), потому что учитель открывает страницу периодически.

Self-review пройден.

---

## Execution Handoff

План сохранён в `docs/superpowers/plans/2026-05-25-auth-firebase-implementation.md`. Этап-задачи готовы для пошагового выполнения.

После каждой задачи — пользователь сам ревьюит дифф и коммитит вручную. **Claude НЕ выполняет git-команды.**
