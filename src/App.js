import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { Game } from "./Classes.js";
import Beep from "./Beep.js";

function App() {
  const [activeCircle, setActiveCircle] = useState();
  const svgPixels = Math.min(window.innerHeight, window.innerWidth) - 80;
  const [game, setGame] = useState(new Game(svgPixels));
  const [xp, setXP] = useState(svgPixels / 2);
  const [yp, setYP] = useState(svgPixels / 2);
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
      Math.abs(clientX - rect.x - activeCircle.xTarget - svgPixels / 2) < 2 &&
      Math.abs(clientY - rect.y - activeCircle.yTarget - svgPixels / 2) < 2
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
    <div>
      <div style={{ marginTop: "5px" }}>
        <div
          style={{
            position: "absolute",
            fontSize: "11px",
            color: "white",
          }}
        >
          <i className="far fa-arrow-alt-circle-left"> </i>
          <a
            href="https://piggygames.net"
            style={{ color: "#61dafb", marginLeft: "5px" }}
          >
            piggygames.net
          </a>
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "calc(10px + 2vmin)",
            color: "white",
          }}
        >
          Apollo's Gasket
        </div>
      </div>
      <div className="App-header">
        <div
          style={{
            position: "absolute",
            top: "100%",
            transform: "translate(0,-100%)",
          }}
        >
          Score: {game.plays}
        </div>
        <svg
          id="svg"
          height={svgPixels}
          width={svgPixels}
          ref={inputRef}
          onMouseMove={handleMouse}
          onClick={handleClick}
        >
          <rect
            width="100%"
            height="100%"
            style={{ fill: "rgb(255,255,255)" }}
          />
          {game.circles.map((c, i) =>
            c.render ? (
              <circle
                transform={`translate(${svgPixels / 2},${svgPixels / 2})`}
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
      </div>
    </div>
  );
}

export default App;
