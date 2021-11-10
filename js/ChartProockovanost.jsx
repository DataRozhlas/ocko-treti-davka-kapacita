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
          : `${data.name} (včetně malých dětí)`,
    },
    credits: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      max: 100,
      title: {
        text: "procento z dané věkové skupuiny",
      },
      labels: {
        format: "{value} %",
      },
    },

    series: [
      {
        name: "1. dávka",
        data: Object.keys(data.davka1)
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => [Number(k), (data.davka1[k] / (data.Z + data.M)) * 100]),
      },
      {
        name: "2. dávka",
        data: Object.keys(data.davka2)
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => [Number(k), (data.davka2[k] / (data.Z + data.M)) * 100]),
      },
      {
        name: "nárok na 3. dávku",
        data: Object.keys(data.narok)
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => [
            Number(k) + 15778800000,
            (data.narok[k] / (data.Z + data.M)) * 100,
          ]),
      },
      {
        name: "3. dávka",
        data: Object.keys(data.davka3)
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => [Number(k), (data.davka3[k] / (data.Z + data.M)) * 100]),
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
