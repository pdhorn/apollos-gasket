import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { Game } from "./Classes.js";
import Beep from "./Beep.js";

function App() {
  const [activeCircle, setActiveCircle] = useState();
  const [game, setGame] = useState(new Game());
  const [xp, setXP] = useState(0);
  const [yp, setYP] = useState(0);
  const inputRef = useRef();

  useEffect(() => setActiveCircle(game.giveNextPlay()), []);

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const rect = inputRef.current.getBoundingClientRect();
    setXP(clientX - rect.x);
    setYP(clientY - rect.y);
  };

  const handleClick = (e) => {
    const { clientX, clientY } = e;
    const rect = inputRef.current.getBoundingClientRect();
    if (
      Math.abs(clientX - rect.x - activeCircle.xTarget - 110) < 1 &&
      Math.abs(clientY - rect.y - activeCircle.yTarget - 110) < 1
    ) {
      game.executePlay();
      setActiveCircle(game.play.circle);
    } else {
      Beep();
    }
  };

  const autoPlay = (e) => {
    game.executePlay();
    setActiveCircle(game.play.circle);
  };

  return (
    <svg
      id="svg"
      height="220"
      width="220"
      ref={inputRef}
      onMouseMove={handleMouse}
      onClick={handleClick}
    >
      {game.circles.map((c, i) =>
        c.render ? (
          <circle
            transform="translate(110,110)"
            key={i}
            r={c.radius}
            cx={c.xTarget}
            cy={c.yTarget}
            stroke="black"
            fill="none"
          />
        ) : null
      )}
      {activeCircle ? (
        <circle
          key={activeCircle.id}
          r={activeCircle.radius}
          cx={xp}
          cy={yp}
          stroke="pink"
          fill="none"
        />
      ) : null}
    </svg>
  );
}

export default App;
