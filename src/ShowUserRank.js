import './ShowUserRank.css'

const ShowUserRank = ({ userRank, mode, setMode }) => {
  const backToMainMenu = () => {
    setMode("default");
  };

  return (
    <div className='rank_container'>
      <h1 className="thank_you_heading">Thank You For Playing!</h1>
      <h3 className="rank_text">Your Rank : {userRank}</h3>
      <button className="home_button" onClick={backToMainMenu}>Return to Main Menu</button>
    </div>
  );
};

export default ShowUserRank;
