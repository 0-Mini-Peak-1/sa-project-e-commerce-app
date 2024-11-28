import React, { useEffect, useState } from "react";
import "../styles/TopPage.css";

const TopPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.scrollY > 200) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`top-page-icon ${isVisible ? "visible" : ""}`}
      onClick={scrollToTop}
    >
      ⬆
    </div>
  );
};

export default TopPage;
