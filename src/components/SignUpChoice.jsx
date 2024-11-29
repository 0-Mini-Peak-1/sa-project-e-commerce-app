import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/SignUpChoice.css";

const SignUpChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="signup-choice-container">
      <div className="header">
        <a href="#home" onClick={() => navigate("/")}>
        <h1>P&P</h1>
        <p>PAD PRINTING</p>
        </a>
      </div>
      <div className="choice-box">
        <div
          className="choice-card"
          onClick={() => navigate("/signup-individual")}
        >
          <img
            src="https://media.discordapp.net/attachments/1254965795465990234/1311866287298969660/dsdsdssdsdsdsdds.png?ex=674a6a30&is=674918b0&hm=43bf3ce78a038385652e5c74e877d2932076bb55742cd728b2fff0f460ce5b96&=&format=webp&quality=lossless"
            alt="บุคคลทั่วไป"
            className="choice-image"
          />
          <button className="choice-button">บุคคลทั่วไป</button>
        </div>
        <div
          className="choice-card"
          onClick={() => navigate("/signup-company")}
        >
          <img
            src="https://media.discordapp.net/attachments/1254965795465990234/1311846213947232338/1000039787.png?ex=674a577e&is=674905fe&hm=047daa97e10237514d20fe32c30dba65633ae41adade800ceaf59a2b3e0f86d7&=&format=webp&quality=lossless"
            alt="บริษัท"
            className="choice-image"
          />
          <button className="choice-button">บริษัท</button>
        </div>
      </div>
    </div>
  );
};

export default SignUpChoice;
