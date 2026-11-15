# Calories Tracker

[![CI](https://github.com/DAlejandroCl/Calorie-tracker/actions/workflows/ci.yml/badge.svg)](https://github.com/DAlejandroCl/Calorie-tracker/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://calorie-tracker-devacl.vercel.app)

A web application built with **React and TypeScript** to track consumed and burned calories through daily activities. It manages food and exercise entries, calculates the calorie balance, and keeps the data in the browser.

---

## 🚀 Live Demo

👉 https://calorie-tracker-devacl.vercel.app

---

## 🧩 Features
- Add activities categorized as **Food** or **Exercise**
- Calories are whole numbers from 1 to 10,000, checked in the form
- Automatic calorie calculations:
  - Total calories consumed
  - Total calories burned
  - Net calorie balance
- Edit and delete existing activities; deleting the activity being edited also leaves edit mode
- Data kept in **localStorage**; a corrupted or hand-edited value no longer stops the app: invalid entries are dropped
- Full application reset
- Edit and remove buttons have accessible names (`Edit Pasta`, `Remove Pasta`)
- Responsive interface

---

## 🛠 Tech Stack
- **React** (functional components) and **TypeScript**
- **useReducer** for the state, with the reducer as a pure function
- **Zod** to validate what is read from localStorage
- **Tailwind CSS** and **Vite**
- **Vitest**, **React Testing Library** and **jest-axe** for tests

---

## 🧠 Architecture & Concepts
- Reusable components: `Form`, `ActivityList`, `CaloriesTracker`, `CaloriesDisplay`
- All state changes go through one reducer; the new id of an activity is created there
- The initial state is built when the app starts (`createInitialState`), not when the file is imported
- Reading and writing storage live in `src/storage`, so the app code does not touch `localStorage` directly; a full or blocked storage does not stop the app

---

## 🧪 Tests

```bash
npm test            # run the suite once
npm run test:watch
npm run typecheck
```

| Layer | What it covers |
| --- | --- |
| Reducer | Every action, new ids, ending edit mode, no mutation of the previous state |
| Storage | No value, valid list, invalid JSON, wrong shapes, invalid entries, blocked storage |
| Components | Totals and the negative balance, form rules, accessible names, dispatched actions |
| App | Add, edit, remove, reload, reset, corrupted storage, all through the real UI (jsdom) |

jest-axe runs in jsdom, which does not compute colors: it does not check color contrast. Contrast was checked once by hand with axe-core in Chromium against the build; there is no browser-based test in the CI yet.

CI (`.github/workflows/ci.yml`) runs lint, the type check, the tests and the build on every push to `main` and every pull request.

## ⚠️ Known limitations

- The data lives only in the browser (`localStorage`): it is not shared across devices or browsers.
- Categories are fixed in code (Food and Exercise); the net balance treats any other category as zero.
- The list is not sorted or grouped by day.

---

## 🗂 Project Structure
```txt
src/
├── components/
│   ├── Form.tsx
│   ├── ActivityList.tsx
│   ├── CaloriesTracker.tsx
│   └── CaloriesDisplay.tsx
├── reducers/
│   └── activity-reducer.ts
├── schemas/
│   └── activity.ts
├── storage/
│   └── activities.ts
├── data/
│   └── categories.ts
├── test/               Setup and factories shared by the tests
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```
(each file with logic has a `.test` file next to it)

## ⚙️ Installation & Local Setup

1. Clone the repository and enter it:

```bash
git clone https://github.com/DAlejandroCl/Calorie-tracker.git
cd Calorie-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server and open http://localhost:5173:
```bash
npm run dev
```
