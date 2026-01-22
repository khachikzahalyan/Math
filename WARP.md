# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands and workflows

### Install dependencies

- `npm install`

### Run the app in development

- `npm start`
  - Starts the Create React App dev server on port 3000 using `react-scripts start`.

### Run tests

- `npm test`
  - Launches the Jest test runner in watch mode via `react-scripts test`.
  - In the interactive runner you can filter tests or run a single test using the standard Jest shortcuts (see Create React App testing docs if needed).

### Build for production

- `npm run build`
  - Builds an optimized production bundle into the `build` directory via `react-scripts build`.

### Linting

- There is no standalone `lint` script; ESLint runs as part of the Create React App toolchain.
  - Lint issues surface in the development console (`npm start`) and during builds/tests.

## High-level architecture

This is a single-page React application (Create React App, React 18, React Router v6) for learning mathematical logic in Armenian. The core structure is:

### Entry point and routing

- `src/index.js` bootstraps React and renders `<App />` into `#root`.
- `src/App.js` wraps the UI in `BrowserRouter` and defines the main routes:
  - `/` → `HomePage` (overview, high-level course structure, quick stats from user progress).
  - `/topics` → `TopicsPage` (lists all logic topics from `src/data/topics.ts`).
  - `/topic/:topicSlug` → `TopicPage` (topic details, its lessons, and a small practice section).
  - `/lessons` → `AllLessonsPage` (catalog-style listing of all lessons).
  - `/lesson/:lessonSlug` → `LessonPage` (main lesson reading and quiz experience).
  - `/practice` → `PracticePage` (configurable practice/exam modes with generated tasks).
  - `/reference` → `ReferencePage` (theory/cheatsheet-style reference material).
  - `/progress` → `MyProgressPage` (user progress dashboard).

### Layout and shared UI

- `src/components/layout/*`
  - `Header` renders the global app title.
  - `Sidebar` provides left-hand navigation links to the main routes.
  - `Breadcrumbs` (used on content pages like lessons/topics) provides contextual navigation.
- `src/components/ui/*` contains small, reusable presentational primitives:
  - `Button`, `Card`, `Input`, `Badge` encapsulate common styling and classes for controls and badges.

These layout/UI components are intentionally very thin and are used by the pages and feature components to keep markup consistent.

### Static content and domain data

All domain content for lessons, questions, topics, and named exercises is defined as static data in TypeScript modules under `src/data`:

- `src/data/topics.ts` – list of high-level topics (id, slug, title, description, lesson counts, difficulty level) used by `TopicsPage` and `TopicPage`.
- `src/data/lessons.ts` – canonical lesson metadata and text content (id, topicSlug, title, slug, level, Armenian content string, objectives). `LessonPage` looks up lessons by slug from here.
- `src/data/questions.ts` – multiple-choice questions keyed by `topicSlug`, with `options`, `correctAnswer` (as a string index), and `explanation`. Reused across topic-level practice and lesson quizzes.
- `src/data/exercises.ts` – higher-level exercise descriptors (category, title, description, difficulty) used to label and filter practice exercises.

The runtime components never fetch data from a server; they import from these modules directly and drive the UI purely from in-memory data plus localStorage progress.

### Core domain logic (lib)

- `src/lib/progressStorage.ts`
  - Defines the localStorage-backed progress model for lessons (`LessonProgress`) and aggregate user stats (`UserStats`).
  - Key functions:
    - `getProgress` / `setProgress` – read/write the full `logic-learning-progress` object from localStorage (no-op on the server).
    - `updateLessonProgress(lessonSlug, completed, answers, score, wrongQuestionIds)` – updates a single lesson entry; tracks `lastAttempt` timestamp and an `attempts` counter.
    - `getLessonProgress(lessonSlug)` – returns historic progress for a given lesson, used by `LessonPage` to show previous score and pre-filter “errors only” mode.
    - `getUserStats()` – derives global stats (completed lessons count, average score, total points, streak, achievements) from the stored progress.
    - `calculateStreak()` – computes the daily learning streak based on `lastAttempt` dates.
    - `calculateAchievements()` – unlocks a small set of named achievements such as `5_lessons`, `10_lessons`, `perfect_score`, `5_day_streak` based on completion and score.
    - `getWrongQuestions(lessonSlug)` – helper to retrieve stored wrong question IDs for a lesson.
  - This module is the single source of truth for persistence and any user-level gamification logic.

- `src/lib/quizEngine.ts`
  - Small, pure TypeScript helpers for checking answers and computing scores independent of React components.
  - `checkAnswer(question, answer)` supports single-choice, multi-choice, and fill-in question types using `correctAnswer` or `correctAnswers`.
  - `calculateScore(questions, answers)` returns a percentage score based on how many questions pass `checkAnswer`.

- `src/lib/exerciseGenerator.js`
  - Generates on-the-fly practice tasks for the Practice section.
  - Includes utilities to:
    - Build truth tables over P/Q/R/S (`generateTruthTable`).
    - Generate “simple” propositional formulas using randomly chosen variables and logical operators.
    - Produce tasks for equivalence checks, CNF/DNF transformations, tautology checks, and text-to-formula translations.
  - Also exports `PRACTICE_MODES` describing the practice modes (`QUICK`, `EXAM`, `ERRORS`) with their ids, names, counts, and time limits; this is consumed by `PracticePage` and `PracticeMode`.

- `src/lib/slug.ts`
  - `slugify(text)` – utility to turn arbitrary text into a URL-friendly slug.
  - `getSlugFromArray(slug, items)` – helper to retrieve an item by its `slug` field from an array (used where you need a lookup by slug and already have the full list in memory).

### Pages and feature flows

- `HomePage`
  - Uses `getUserStats()` and `getProgress()` from `progressStorage` to compute the next incomplete lesson and display basic stats (completed lessons, average score).
  - Acts as a “landing dashboard” with high-level course structure and clear navigation CTAs into topics/lessons/practice.

- `TopicsPage`
  - Lists topics from `topics.ts`, showing name, description, and lesson counts, each linking to `/topic/:topicSlug`.

- `TopicPage`
  - Resolves the `topicSlug` route param, finds the corresponding topic and its lessons/questions.
  - Renders:
    - A topic header (title, description, level, lesson count).
    - A list of cards for each lesson in that topic with brief description and objectives and links to `/lesson/:lessonSlug`.
    - A small “practice” section: a fixed set of topic-specific questions with interactive radio buttons and a “reveal answer” toggle managed locally via `expandedAnswers` state.

- `LessonPage`
  - Central orchestrator for the lesson reading and quiz flow.
  - Responsibilities:
    - Fetch the lesson by `lessonSlug` from `lessons.ts`.
    - Select up to 10 questions from `questions.ts` matching the lesson’s `topicSlug`.
    - Manage quiz UI state (`not-started` → `in-progress` → `completed`) and whether only previously wrong questions should be re-asked.
    - On submit:
      - Compute per-lesson score and wrong question IDs.
      - Persist via `updateLessonProgress`, marking `completed` when `score >= 70`.
      - Transition to the `QuizResults` view, passing score, user answers, and any historic `previousScore`.
  - Uses feature components under `src/components/lesson`:
    - `LessonContent` for lesson text.
    - `LessonQuiz` for step-through question answering and explanations.
    - `QuizResults` for rich, per-question feedback and actions (“repeat all” vs “repeat errors”).
    - `LessonNav` for navigation to adjacent lessons (UI scaffolded for previous/next buttons).

- `PracticePage` and `PracticeMode`
  - `PracticePage` lets the user choose between practice modes (`QUICK`, `EXAM`, `ERRORS`) and filter the list of static `exercises` by category and difficulty, showing descriptive cards.
  - Starting a mode uses `ExerciseGenerator` to generate a list of tasks; state is passed into `PracticeMode`.
  - `PracticeMode` handles:
    - Timed sessions when a `timeLimit` is set on the mode (countdown in minutes/seconds, auto-complete on timeout).
    - Per-task answer capture and per-type rendering (equivalence, text-to-formula, tautology, normal-form, simple truth-table tasks).
    - Basic scoring (number of answered tasks) and an end-of-session summary screen.

- `MyProgressPage`
  - Reads `getUserStats()` and `getProgress()` to build a dashboard of the learner’s streak, average score, total points, achievements, and completed lesson list with simple progress bars.

### Styling and assets

- Styles are organized as page-specific CSS modules imported directly into pages (e.g. `HomePage.css`, `PracticePage.css`, `LessonPage.css`, `MyProgressPage.css`, etc.) and component-specific CSS under the respective component folders (e.g. `LessonQuiz.css`, `QuizResults.css`, `PracticeMode.css`, `Header.css`, `Sidebar.css`).
- Global/reset styles live in `src/index.css` and `src/App.css`.

### Testing setup

- The project is configured for testing via Create React App:
  - `react-scripts test` (wired to `npm test`) uses Jest and React Testing Library.
  - Testing-library dependencies are present in `devDependencies`, but there are currently no substantial custom test files in the repository.
- To add tests, follow the CRA convention (`*.test.js` or `*.spec.js` under `src/`) so they are auto-discovered by `npm test`.
