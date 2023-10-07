import React from "react";
import gbLogo from "../docs/gb-logo.svg";
import "./Navbar.css";
export default function Navbar() {
  return (
    <header>
      <div>
        <div className="asp">
          <img src={gbLogo} alt="" className="gb-logo" />
          <h1>GB Intros</h1>
        </div>

        <div className="link-header-container"></div>
      </div>
    </header>
  );
}
