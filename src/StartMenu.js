import "./StartMenu.css";
import Game from "./Game";
import LeaderBoard from "./LeaderBoard";
import { useState } from "react";
import playButton from "./assets/button/PLAY_BUTTON.gif";
import leaderBoardButton from "./assets/button/LeaderBoard.gif";

const StartMenu = () => {
  const [mode, setMode] = useState("default");

  const startGame = () => {
    setMode("game");
  };

  const visitBoard = () => {
    setMode("board");
  };

  return (
    <div className="mode">
      {mode === "default" && (
        <div className="button_container">
          {" "}
          <button className="play_button" onClick={startGame}>
            <img src={playButton} className="button_image" alt="play"></img>
          </button>
          <button className="leader_button" onClick={visitBoard}>
            <img src={leaderBoardButton} className="button_image>" alt="leaderboard"></img>
          </button>
        </div>
      )}
      {mode === "game" && <Game mode={mode} setMode={setMode} />}
      {mode === "board" && <LeaderBoard mode={mode} setMode={setMode} />}
    </div>
  );
};

export default StartMenu;
