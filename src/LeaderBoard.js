import { useEffect, useState } from "react";
import './LeaderBoard.css'
const LeaderBoard = ({ mode, setMode }) => {
  const [records, setRecords] = useState([]);
  const requestUrl = "http://localhost:8080";

  useEffect(() => {
    // Get the top 100 score and player name
    fetch(requestUrl + "/game_record/top_scores")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Request Records Failed");
        }
      })
      .then((data) => {
        console.log(data);
        const updatedRecords = data.map((element) => [
          element.score,
          element.userName,
        ]);
        setRecords(updatedRecords);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  useEffect(() => {
    console.log(records);
  }, [records]);

  // Function to handle returning to the main menu
  const backToMainMenu = () => {
    setMode("default");
  };

  return (
    <div className="container">
        <table class="styled-table">
    <thead>
        <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
        </tr>
    </thead>
    <tbody>
        
        {records.map((record, index) => (
          <tr>
            <th>{index + 1}</th>
            <th>{record[1]}</th>
            <th>{record[0]}</th>
          </tr>
        ))}
    </tbody>
</table>
      <button className="home_button" onClick={backToMainMenu}>Return to Main Menu</button>
    </div>
  );
};

export default LeaderBoard;
