# Auth + Firebase + CRUD уроков и журнал оценок

Дата: 2026-05-25
Проект: Math (logic-learning, React 18, React Router 6)
Firebase-проект: `diplom-a1897`

## 1. Цель

Добавить в существующее приложение по математической логике:
- Аутентификацию через Google (Firebase Auth).
- Две роли: учитель и ученик. Разграничение по email.
- Перенос тем и вопросов из статического `src/data/topics.js` в Firestore.
- CRUD для учителя (добавление/редактирование/удаление тем и вопросов) inline на `/lessons`.
- Сохранение прогресса каждого ученика в Firestore (все попытки + 10-балльная оценка).
- Журнал `/grades` для учителя — таблица «ученик × тема» с историей попыток.

Весь UI на армянском (по правилам проекта). Все git-операции — вручную пользователем (Claude не коммитит).

## 2. Контекст и ограничения

- React 18, react-router-dom 6, framer-motion, lucide-react, tailwind. Без TypeScript в существующем коде.
- Сейчас темы и вопросы лежат в `src/data/topics.js` (массив объектов). Прогресс ученика — в localStorage через `src/utils/progressStorage.js`.
- Учитель: `zahalyankhachik-2@aspu.am` (фиксированный email). Тестовый ученик: `zahalyanxcho@gmail.com`.
- Firebase web-конфиг известен (см. память `project_firebase.md`). API-ключ кладём в `.env.local` (REACT_APP_FIREBASE_*), `.env.local` в `.gitignore`.
- Firestore Console и настройку Auth provider Claude не трогает — это делает пользователь вручную по инструкции.

## 3. Архитектура

### 3.1 Стек

- **firebase** v10+ (`firebase/app`, `firebase/auth`, `firebase/firestore`).
- React Context для глобального состояния auth.
- Real-time подписки `onSnapshot` для тем/вопросов и одиночные `getDocs` для журнала.

### 3.2 Роли

```js
const TEACHER_EMAIL = 'zahalyankhachik-2@aspu.am';
const isTeacher = (user) => user?.email === TEACHER_EMAIL;
```

Роль вычисляется на клиенте и дублируется в Firestore Security Rules.

### 3.3 Маршруты

| Путь | Доступ | Описание |
|---|---|---|
| `/`, `/about`, `/contact` | публично | без изменений |
| `/login` | гости | страница входа (если зашёл по защищённой ссылке) |
| `/lessons` | вошедшие | ученик: список тем; учитель: то же + кнопки CRUD |
| `/lessons/:topicId` | вошедшие | ученик: теория + тест; учитель: то же + «Խմբագրել» |
| `/grades` | только учитель | таблица оценок |

Гарды: `<RequireAuth>` редиректит на `/login`. `<RequireTeacher>` — на `/lessons`.

### 3.4 Файловая структура

```
src/
  firebase.js                          ← initializeApp + getAuth + getFirestore
  auth/
    AuthContext.js                     ← Provider, useAuth(), useIsTeacher()
    RequireAuth.js
    RequireTeacher.js
  pages/
    Login/
      Login.js                         ← "Մտնել Google-ով"
      Login.css
    Grades/
      Grades.js                        ← таблица ученик×тема (только учителю)
      Grades.css
      AttemptsModal.js                 ← попытки конкретного ученика по теме
  components/
    Header/
      UserMenu.js                      ← аватар + dropdown
    TopicEditor/
      TopicEditor.js                   ← модалка CRUD темы
      QuestionsEditor.js               ← список вопросов в редакторе
      QuestionForm.js                  ← форма одного вопроса
  data/
    topicsRepo.js                      ← listTopics/getTopic/saveTopic/deleteTopic
    questionsRepo.js                   ← list/save/delete questions
    progressRepo.js                    ← saveAttempt, getMyProgress, getAllProgress
  utils/
    seedTopics.js                      ← одноразовый импорт src/data/topics.js
```

Удаляется: `src/utils/progressStorage.js`, вызовы `recordQuestionAnswered`.

Меняется: `src/index.js` (обёртка `<AuthProvider>`), `src/App.js` (маршруты + гарды), `src/components/Header/Header.js` (UserMenu), `src/pages/Lessons/Lessons.js` (данные из Firestore), `src/pages/LessonTopic/LessonTopic.js` (данные из Firestore, сохранение попытки).

`src/data/topics.js` остаётся как seed-источник для первичного импорта, в runtime не используется.

## 4. Модель данных Firestore

### 4.1 `topics/{topicId}`

```js
{
  id: 'proposition',
  level: 1,
  title: 'Ասույթ (պնդում)',
  description: '...',
  text: '...',
  examples: ['...'],
  order: 0,
  createdAt: Timestamp,
  updatedAt: Timestamp,
  updatedBy: 'zahalyankhachik-2@aspu.am'
}
```

### 4.2 `topics/{topicId}/questions/{questionId}` (подколлекция)

```js
{
  id: 'q1',
  type: 'radio',
  question: 'Ո՞րն է ասույթ։',
  options: ['Բացիր դուռը', 'Ինչքա՞ն է ժամը', '2+2=4', 'Վազի՛ր'],
  correctOption: 2,
  order: 0
}
```

Подколлекция, а не массив в документе темы, чтобы:
- Редактирование одного вопроса не перезаписывало всю тему.
- Каждый вопрос имел собственный docId и историю изменений.

### 4.3 `progress/{userId}` + `progress/{userId}/attempts/{attemptId}`

```js
// progress/{userId}
{
  email: 'zahalyanxcho@gmail.com',
  displayName: 'Խաչիկ',
  photoURL: '...',
  lastActiveAt: Timestamp,
  byTopic: {
    proposition: { bestScore10: 8, lastScore10: 8, attemptsCount: 2 },
    variables:   { bestScore10: 10, lastScore10: 10, attemptsCount: 1 }
  }
}

// progress/{userId}/attempts/{auto-id}
{
  topicId: 'proposition',
  startedAt: Timestamp,
  finishedAt: Timestamp,
  totalQuestions: 5,
  correctAnswers: 4,
  score10: 8,
  answers: [
    { questionId: 'q1', selectedOption: 2, correctOption: 2, isCorrect: true }
  ]
}
```

Агрегат `byTopic` в документе ученика — чтобы `/grades` рисовал всю таблицу одним запросом по коллекции `progress`. Попытки тянем по клику на ячейку.

Формула: `score10 = Math.round(correctAnswers / totalQuestions * 10)`.

Попытки иммутабельны (никто их не правит после `create`).

## 5. Firestore Security Rules

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

Правила хранятся в репо как `firestore.rules` (для документации). Публикация — вручную через Firebase Console → Firestore → Rules → Publish.

## 6. Ключевые потоки

### 6.1 Вход

1. Гость кликает «Մտնել» в Header.
2. `signInWithPopup(auth, new GoogleAuthProvider())`. Если popup заблокирован — fallback `signInWithRedirect`.
3. `onAuthStateChanged` обновляет `AuthContext`.
4. Если email = TEACHER_EMAIL → `isTeacher=true`.
5. При первом входе ученика — `setDoc(doc('progress', uid), { email, displayName, photoURL, lastActiveAt, byTopic: {} }, { merge: true })`.

### 6.2 CRUD темы (учитель)

1. На `/lessons` рядом с каждой темой — иконки «Խմբագրել» и «Ջնջել». Сверху — «+ Ավելացնել թեմա».
2. Клик «Խմբագրել» → открывается модалка `TopicEditor` с двумя вкладками: «Թեմա» (title, description, text, examples) и «Հարցեր» (список вопросов).
3. Сохранение темы → `updateDoc(doc('topics', id), { ...fields, updatedAt: serverTimestamp(), updatedBy: email })`.
4. Удаление темы → confirm с числом существующих попыток → `topicsRepo.deleteTopic` рекурсивно: batch-удаление всех `questions`, потом `deleteDoc` темы.
5. Список тем обновляется через `onSnapshot(query(collection('topics'), orderBy('order')))` — все клиенты видят изменения real-time.

### 6.3 CRUD вопросов (учитель)

1. В `TopicEditor` → вкладка «Հարցեր» → список с inline-формами.
2. Save/delete пишут в `topics/{topicId}/questions`.
3. При сохранении валидируем `correctOption < options.length` (на клиенте).

### 6.4 Прохождение теста (ученик)

1. `LessonTopic.js` тянет тему `getDoc(doc('topics', topicId))` и вопросы `getDocs(collection('topics', topicId, 'questions'))`.
2. Логика квиза не меняется — те же `currentQuestionIdx`, `selectedOption`, `userAnswers`, `score`.
3. На финале формируется `attempt`:
   ```js
   { topicId, startedAt, finishedAt: now,
     totalQuestions, correctAnswers, score10,
     answers: userAnswers.map(...) }
   ```
4. `progressRepo.saveAttempt` в `runTransaction`:
   - Создаёт документ в `progress/{uid}/attempts`.
   - Обновляет `progress/{uid}.byTopic[topicId]`: `attemptsCount + 1`, `lastScore10 = score10`, `bestScore10 = max(prev, score10)`, `lastActiveAt = now`.
5. UI показывает оценку «N/10» и кнопку «Կրկին փորձել».

### 6.5 Журнал `/grades`

1. `getDocs(collection('progress'))` — все ученики.
2. `getDocs(collection('topics'))` — все темы для заголовков колонок.
3. Рендерим таблицу: строка — ученик, колонка — тема, ячейка — `byTopic[topicId]?.bestScore10 ?? '—'`.
4. Клик по ячейке → `AttemptsModal`, тянет `getDocs(query(collection('progress', uid, 'attempts'), where('topicId', '==', topicId), orderBy('finishedAt', 'desc')))`.

### 6.6 Seed-импорт

На пустой коллекции `topics` учителю на `/lessons` показываем баннер «Ներմուծել նախնական դասերը». Клик → `seedTopics()` итерируется по импортированному из `src/data/topics.js` массиву:
- `setDoc(doc('topics', t.id), { ...без questions, order: i })`.
- Для каждого вопроса: `setDoc(doc('topics', t.id, 'questions', q.id), { ...q, order: j })`.

После импорта баннер исчезает (коллекция непустая).

## 7. Обработка ошибок и edge-cases

| Ситуация | Поведение |
|---|---|
| Нет интернета при логине | Toast «Միացում չկա, փորձեք կրկին» |
| Popup закрыт пользователем | Молча игнорируем (`auth/popup-closed-by-user`) |
| Браузер блокирует popup | Fallback на `signInWithRedirect` |
| Загрузка тем падает | Карточка «Չհաջողվեց բեռնել թեմաները» + «Կրկին փորձել» |
| Запись попытки падает | Toast «Արդյունքը չպահպանվեց» + «Կրկին պահպանել» (attempt в памяти) |
| Учитель удаляет тему с попытками | Confirm «Ջնջե՞լ թեման ՝ N փորձ կկորչի աշակերտների մոտ» |
| `AuthContext.loading=true` | Глобальный `<Loader />` пока Firebase решает, кто вошёл |
| Удалён вопрос между прохождениями | В review показываем «Հարցը հեռացված է» |
| Удалена тема, агрегат остался | Фронт игнорирует ключи `byTopic[id]` без соответствующей темы |
| `correctOption >= options.length` | Валидируем при save вопроса (клиент) |
| Пустой тест (нет вопросов) | Кнопка «Անցնել թեստը» неактивна, подпись «Հարցեր դեռ չկան» |

## 8. Этапы реализации

| # | Этап | Проверка |
|---|---|---|
| 1 | Firebase setup (npm i, `firebase.js`, `.env.local`, `.gitignore`, `firestore.rules`) | `console.log(app)` |
| 2 | Auth (`AuthContext`, гарды, `/login`, `UserMenu`) | Google-вход работает, роли разграничены |
| 3 | Темы из Firestore read-only + seed-кнопка | Учитель импортирует, ученик видит и проходит тесты (без сохранения) |
| 4 | Прогресс ученика в Firestore (удаление `progressStorage.js`, `saveAttempt` с транзакцией, 10-балльная) | Прошёл тест → «8/10» → попытка в Firestore |
| 5 | CRUD учителя (`TopicEditor`, `QuestionsEditor`, кнопки, real-time) | Учитель меняет → ученик в другой вкладке видит |
| 6 | Журнал `/grades` (таблица + `AttemptsModal`) | Учитель видит всех учеников и оценки |

Каждый этап — отдельная сессия. После каждого пользователь сам ревьюит дифф и сам коммитит.

## 9. Что не делаем (явно отложено)

- Drag-and-drop порядка тем/вопросов — используем поле `order` и кнопки «↑↓».
- Несколько учителей / админ-панель — пока хардкод одного email.
- Cloud Functions для каскадного удаления — каскад делаем с клиента в `topicsRepo.deleteTopic` (batch).
- Server-side валидация полей в Security Rules — только клиентская.

## 10. Что делает пользователь вручную (вне Claude)

1. Firebase Console → Authentication → Sign-in method → включить **Google** провайдер.
2. Firebase Console → Authentication → Settings → Authorized domains → добавить `localhost` и production-домен (когда будет).
3. Firebase Console → Firestore → создать базу (если ещё нет) в режиме production.
4. Firebase Console → Firestore → Rules → вставить содержимое `firestore.rules` → Publish.
5. (Опционально) Google Cloud Console → API Credentials → ограничить API-ключ по HTTP referrer (`localhost`, production-домен).
6. Создать `.env.local` в корне проекта со значениями из Firebase config.
7. Войти один раз учителем (`zahalyankhachik-2@aspu.am`), нажать «Ներմուծել նախնական դասերը».
8. Все коммиты после каждого этапа.
