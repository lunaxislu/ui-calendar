import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Calendar } from "./components/Calendar";
import { Calendar as TestCalendar } from "./components/calendar-module-css/calendar-module";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <div className="flex">
          <div className="flex gap-3 flex-col">
            <Calendar size="lg" />
            <p>CSS MODULE</p>
          </div>
          <div className="flex gap-3 flex-col">
            <TestCalendar size="lg" />
            <TestCalendar />
            <p>tailwind</p>
          </div>
          <div className="flex gap-3 flex-col"></div>
        </div>

        {/* TEST END */}
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
