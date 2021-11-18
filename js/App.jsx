import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
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

Highcharts.setOptions({
  lang: {
    months: [
      "ledna",
      "února",
      "března",
      "dubna",
      "května",
      "června",
      "července",
      "srpna",
      "září",
      "října",
      "listopadu",
      "prosince",
    ],
    shortMonths: [
      "leden",
      "únor",
      "březen",
      "duben",
      "květen",
      "červen",
      "červenec",
      "srpen",
      "září",
      "říjen",
      "listopad",
      "prosinec",
    ],
    shortMonths: [
      "leden",
      "únor",
      "březen",
      "duben",
      "květen",
      "červen",
      "červenec",
      "srpen",
      "září",
      "říjen",
      "listopad",
      "prosinec",
    ],
    weekdays: [
      "neděle",
      "pondělí",
      "úterý",
      "středa",
      "čtvrtek",
      "pátek",
      "sobota",
    ],
    decimalPoint: ",",
    numericSymbols: [" tis.", " mil.", "mld.", "T", "P", "E"],
    rangeSelectorFrom: "od",
    rangeSelectorTo: "do",
    rangeSelectorZoom: "vyberte období:",
  },
});

const isMobile = window.innerWidth < 700;

function App({ id }) {
  if (id === "proocko") {
    return (
      <div>
        <div id="hlavni">
          <ChartProockovanost data={davky[0]} isMobile={isMobile} />
        </div>
        <div id="multipes">
          {davky
            .filter(
              (s) => s.name !== "0-11" && s.name !== "Všechny věkové skupiny"
            )
            .map((d) => {
              return (
                <div className={isMobile ? "hlavni" : "malygraf"} key={d.name}>
                  <ChartProockovanost data={d} isMobile={isMobile} />
                </div>
              );
            })}
        </div>
      </div>
    );
  } else if (id === "kapacita") {
    return <ChartKapacita />;
  }
}

export default App;
