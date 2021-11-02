import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import "./byeie"; // loučíme se s IE

ReactDOM.render(<App />, document.getElementById("app"));

/*
// snadné načtení souboru pro každého!
fetch("https://blabla.cz/blabla.json")
  .then(response => response.json()) // nebo .text(), když to není json
  .then(data => {
    // tady jde provést s daty cokoliv
  });
*/
