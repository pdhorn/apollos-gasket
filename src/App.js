import React from "react";
import "./App.css";
import { Game } from "./Classes.js";

function App() {
  var g = new Game();
  const colors = ["black", "red", "blue"];
  return (
    <svg id="svg" height="220" width="220">
      {g.circles.map((c, i) => (
        <circle
          transform="translate(110,110)"
          key={i}
          r={c.radius}
          cx={c.xTarget}
          cy={c.yTarget}
          stroke={colors[i]}
          fill="none"
        />
      ))}
    </svg>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
