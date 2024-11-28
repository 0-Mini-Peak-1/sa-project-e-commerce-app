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
            src="https://via.placeholder.com/150"
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
            src="https://via.placeholder.com/150"
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
