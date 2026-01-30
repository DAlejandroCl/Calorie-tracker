# Calories Tracker

A web application built with **React and TypeScript** to track consumed and burned calories through daily activities. The app allows users to manage food and exercise entries, calculate calorie balances, and persist data locally in the browser.

## 🧩 Features
- Add activities categorized as **Food** or **Exercise**
- Automatic calorie calculations:
  - Total calories consumed
  - Total calories burned
  - Net calorie balance
- Edit and delete existing activities
- Persistent state using **localStorage**
- Full application reset
- Responsive user interface focused on usability

## 🛠 Tech Stack
- **React** (Functional Components)
- **TypeScript**
- **useReducer** for centralized state management
- **useMemo** for performance optimization
- **Tailwind CSS** for styling
- **Vite** as build tool
- **UUID / crypto.randomUUID** for unique identifiers

## 🧠 Architecture & Concepts
- Clear separation of concerns using reusable components:
  - `Form`
  - `ActivityList`
  - `CaloriesTracker`
  - `CaloriesDisplay`
- Centralized business logic handled by a reducer
- Strong typing with TypeScript interfaces
- Static configuration using data files for categories
- Side effects and persistence handled with `useEffect`

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
├── data/
│   └── categories.ts
├── types/
│   └── index.ts
├── App.tsx
├── main.tsx
└── index.css
```

## ⚙️ Installation & Local Setup

1. Clone the repository:

```bash
git clone https://github.com/DAlejandroCl/Calorie-tracker.git
```

2. Navigate to the project directory:
```bash
cd Calorie-tracker
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and visit:
```txt
http://localhost:5173
```