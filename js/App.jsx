import React, { useState, useEffect } from "react";
import ChartKapacita from "./ChartKapacita.jsx";
import ChartProockovanost from "./ChartProockovanost.jsx";
import davky from "./../data/davky_demo.json";

// const data = {};
// davky.forEach((skupina) => {
//   data[skupina.name] = {
//     celkem: skupina.M + skupina.Z,
//     d1: skupina.davka1,
//     d2: skupina.davka2,
//     d3: skupina.davka3,
//   };
// });

function App() {
  return (
    <>
      <h2>Kolik lidí má jednotlivé dávky?</h2>
      {davky.map((d, i) => {
        return <ChartProockovanost data={d} key={i} />;
      })}

      <ChartKapacita />
    </>
  );
}

export default App;
