import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

function ChartProockovanost({ data }) {
  const [options, setOptions] = useState({
    chart: {
      type: "area",
    },
    title: {
      text:
        data.name !== "Všechny věkové skupiny"
          ? `Věková skupina ${data.name} let`
          : data.name,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
    },
    series: [
      {
        name: "1. dávka",
        data: Object.keys(data.davka1)
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => [Number(k), data.davka1[k]]),
      },
      {
        name: "2. dávka",
        data: Object.keys(data.davka2)
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => [Number(k), data.davka2[k]]),
      },
      {
        name: "3. dávka",
        data: Object.keys(data.davka3)
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => [Number(k), data.davka3[k]]),
      },
    ],
  });

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default ChartProockovanost;
