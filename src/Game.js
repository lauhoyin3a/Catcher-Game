import { useEffect, useState } from "react";
import boat from "./assets/boat.png";
import p1 from "./assets/p_image/p1.png";
import p2 from "./assets/p_image/p2.png";
import p3 from "./assets/p_image/p3.png";
import p4 from "./assets/p_image/p4.png";
import e1 from "./assets/e_image/e1.png";
import e2 from "./assets/e_image/e2.png";
import "./Game.css";
import ShowUserRank from "./ShowUserRank";

const Game = ({ mode, setMode }) => {
  const [gameStarted, setGameStarted] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [catcherPosition, setCatcherPosition] = useState(0);
  const [dropPosition, setDropPosition] = useState(0);
  const [dropImage, setDropImage] = useState(p1);
  const [userName, setUserName] = useState("");
  const [userRank, setUserRank] = useState();
  const [userExists, setUserExists] = useState(false);
  const [DropItemOffSet, setDropItemOffSet] = useState("-50%");
  const screenHeight = window.innerHeight;
  const screenWidth = window.innerWidth;
  const dropUnit = screenHeight * 0.01;
  const dropItemXOffset = Math.floor(Math.random() * 101);
  const requestUrl = "http://localhost:8080";
  const pImageArray = [p1, p2, p3, p4];
  const eImageArray = [e1, e2];

  useEffect(() => {
    let interval = null;

    if (gameStarted && !gameEnded && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 0.1);
      }, 100);

      if (dropPosition + dropUnit < screenHeight) {
        dropAction();
      }
    }

    if (Math.ceil(timer) === 0) {
      setGameEnded(true);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [gameStarted, gameEnded, timer]);

  useEffect(() => {
    if (gameEnded) {
      return;
    }
    const handleKeyDown = (event) => {
      const catcherRect = document
        .querySelector(".catcher")
        .getBoundingClientRect();
      if (event.key === "ArrowLeft" && catcherRect.left - 20 > 0) {
        handleMove("left");
      } else if (
        event.key === "ArrowRight" &&
        catcherRect.right + 20 < screenWidth
      ) {
        handleMove("right");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  const getRandomOffset = () => {
    const random = Math.floor(Math.random() * 101);
    setDropItemOffSet("-" + random + "%");
  };

  const getRandomXOffset = () => {
    const screenWidth = window.innerWidth;
    const maxOffset = screenWidth * 0.3; // Adjust this value to control the maximum horizontal offset
    return (Math.random() * 2 * maxOffset) - maxOffset; // Generate a random value between -maxOffset and maxOffset
  };

  const randomImage = () => {
    const randomIndex = Math.floor(
      Math.random() * (pImageArray.length + eImageArray.length - 1)
    );

    let image;
    if (randomIndex >= pImageArray.length) {
      image = eImageArray[randomIndex - pImageArray.length];
    } else {
      image = pImageArray[randomIndex];
    }
    setDropImage(image);
  };

  const handleMove = (direction) => {
    if (direction === "left") {
      setCatcherPosition((catcherPosition) => catcherPosition - 20);
    } else if (direction === "right") {
      setCatcherPosition((catcherPosition) => catcherPosition + 20);
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const endGame = () => {
    setGameEnded(true);
  };

  const resetDrop = (dropElement) => {
    dropElement.classList.add("no-transition");
    setDropPosition(-100); // Move the p4 image off-screen to visually remove it
    setTimeout(() => {
      dropElement.classList.remove("no-transition");
      randomImage();
    }, 30);
  };

  const dropAction = () => {
    const newDropPosition = dropPosition + dropUnit;
    const dropElement = document.querySelector(".drop_item");
    const dropContainer = document.querySelector(".drop_container");
  
    // Generate a random horizontal offset
    const randomXOffset = getRandomXOffset();
  
    // Check if the p4 image touches the catcher image
    const catcherRect = document.querySelector(".catcher").getBoundingClientRect();
    const dropRect = dropElement.getBoundingClientRect();
    const isDropImageVisible = dropRect.bottom < screenHeight;
  
    if (
      dropRect.bottom >= catcherRect.top &&
      dropRect.top <= catcherRect.bottom &&
      dropRect.right >= catcherRect.left &&
      dropRect.left <= catcherRect.right
    ) {
      // Collision occurred, update score and remove the p4 image
      handleCatchItem(dropImage);
      resetDrop(dropElement);
      dropContainer.style.transform = `translateX(${randomXOffset}px)`;
      dropElement.style.transform = `translateY(${newDropPosition}%)`;
      
    } else if (isDropImageVisible) {
      // No collision, update the drop position and apply the random horizontal offset
      setDropPosition(newDropPosition);
      
    } else {
      
      resetDrop(dropElement);
      dropContainer.style.transform = `translateX(${randomXOffset}px)`;
      dropElement.style.transform = `translateY(${newDropPosition}%)`;
    }
  };

  const handleCatchItem = (dropImage) => {
    if (pImageArray.includes(dropImage)) {
      setScore((prevScore) => prevScore + 50);
    } else if (eImageArray.includes(dropImage)) {
      setScore((prevScore) => prevScore + 100);
    }
  };

  const changeUserName = (event) => {
    setUserName(event.target.value);
  };

  const getUserRank = (userName) => {
    fetch(`${requestUrl}/game_record/user_rank?username=${userName}`)
      .then((response) => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error("Failed with status" + response.status);
        }
      })
      .then((responseData) => {
        setUserRank(parseInt(responseData));
        console.log("User Rank: " + userRank);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Post to backend
    fetch(`${requestUrl}/game_record`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        score: score,
      }),
    })
      .then((response) => {
        if (response.status === 409) {
          setUserExists(true);
        } else if (response.ok) {
          console.log("Success Add Record");
          getUserRank(userName);
        } else {
          throw new Error("Failed with status" + response.status);
        }
      })
      .then((responseData) => {
        console.log(responseData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="Game">
      {gameStarted && !gameEnded && (
        <div>
          <h2>Score: {score}</h2>
          <h2>Time Left: {Math.ceil(timer)}</h2>
          {
            /* Game elements */
            <div className="catcher_container">
              <img
                className="catcher"
                src={boat}
                alt="catcher"
                style={{ 
                  transform: `translateX(${catcherPosition}px)`,
                  transition: `transform 0.05s ease`,
               }}
              />
            </div>
          }
          {
            <div className="drop_container">
              <img
                className="drop_item"
                src={dropImage}
                alt="drop_item"
                style={{
                  transform: `translateY(${dropPosition}%)`,
                  transition: `transform 0.2s ease`,
                }}
              ></img>
            </div>
          }
        </div>
      )}

      {gameEnded && !userRank && (
        <div className="game_over_container">
          <h1 className="game_over">Game Over!</h1>
          <h2 className="final_score">Final Score: {score}</h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={changeUserName}
            className="input_name"
          />
          <button className="submit_button" onClick={handleSubmit}>Submit</button>
        </div>
      )}
      {gameEnded && !userRank && userExists && (
        <div className="user_exist">
          <h2>User Name Exists, Please Enter Again!</h2>
        </div>
      )}
      {gameEnded && userRank && (
        <ShowUserRank userRank={userRank} mode={mode} setMode={setMode} />
      )}
    </div>
  );
};

export default Game;
