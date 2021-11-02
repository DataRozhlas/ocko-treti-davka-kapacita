import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import kapacita from "./../data/kapacita.json";

function App() {
  const [options, setOptions] = useState({
    title: {
      text: "My chart",
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
    },
    series: [
      {
        name: "volná kapacita na třetí dávku",
        data: Object.keys(kapacita).map((key) => [
          Number(key),
          kapacita[key].volna_kapacita,
        ]),
      },
    ],
  });

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default App;
