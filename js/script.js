import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import "./byeie"; // loučíme se s IE

ReactDOM.render(<App id={"proocko"} />, document.getElementById("proocko"));
ReactDOM.render(<App id={"kapacita"} />, document.getElementById("kapacita"));

/*
// snadné načtení souboru pro každého!
fetch("https://blabla.cz/blabla.json")
  .then(response => response.json()) // nebo .text(), když to není json
  .then(data => {
    // tady jde provést s daty cokoliv
  });
*/
