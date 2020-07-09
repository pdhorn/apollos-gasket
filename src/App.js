import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import "./App.css";
import { Game } from "./Classes.js";
import Beep from "./Beep.js";
import useModal from "./useModal";
import "./Modal.css";
import gasket from "./gasket.png";

function App() {
  const [activeCircle, setActiveCircle] = useState();
  const svgPixels = Math.min(window.innerHeight, window.innerWidth) - 80;
  const [game, setGame] = useState();
  const [xp, setXP] = useState(svgPixels / 2);
  const [yp, setYP] = useState(svgPixels / 2);
  const inputRef = useRef();
  const [rulesIsShowing, rulesToggle] = useModal();

  useEffect(() => setGame(new Game(svgPixels)), []);

  useEffect(() => {
    if (game) {
      setActiveCircle(game.giveNextPlay());
    }
  }, [game]);

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
    <div
      onClick={() => {
        if (rulesIsShowing) {
          rulesToggle();
        }
      }}
    >
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
      {game ? (
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
          <div>
            <button
              style={{
                position: "absolute",
                left: "60%",
                top: "100%",
                transform: "translate(0,-100%)",
                margin: "0",
                width: "100px",
                backgroundColor: "white",
              }}
              onClick={rulesToggle}
            >
              Rules
            </button>
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
      ) : null}
      <RulesModal isShowing={rulesIsShowing} />
    </div>
  );
}

const RulesModal = ({ isShowing }) => {
  return isShowing
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="modal-overlay" />
          <div
            className="modal-wrapper"
            aria-modal
            aria-hidden
            tabIndex={-1}
            role="dialog"
          >
            <div className="modal">
              <div className="modal-header">
                Click the pink circle so it's tangent to three black circles.
                <br />
                <br />
                You will eventually fill out an{" "}
                <a
                  href="https://en.wikipedia.org/wiki/Apollonian_gasket"
                  target="new"
                >
                  Apollonian gasket
                </a>
                <br />
                <br />
                <img src={gasket} width="100%" />
              </div>
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;
};

export default App;
