import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import volnaKapacita from "./../data/volnaKapacita.json";
import maxKapacita from "./../data/maxKapacita.json";
import ukoncenych from "./../data/ukoncenych.json";

const colors = {
  default: "#aaa",
  2020: "#e63946",
  2018: "#009FB8",
  2019: "#3E80B6",
  avg: "#e63946",
  avg: "#333",
  "uhrn-highlight": "#30638e",
};

function ChartKapacita() {
  const [options, setOptions] = useState({
    chart: { type: "column" },
    title: {
      useHTML: true,
      text: "Jak dlouhé budou fronty na třetí dávku?",
    },
    credits: {
      href: "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19",
      text: "Zdroj dat: Ministerstvo zdravotnictví ČR (výpočty iROZHLAS.CZ)",
    },
    xAxis: {
      type: "datetime",
      tickmarkPlacement: "on",
      min: 1632096000000,
    },
    yAxis: {
      title: {
        enabled: false,
      },
    },
    plotOptions: {
      column: {
        dataLabels: {
          enabled: false,
        },
        enableMouseTracking: true,
        pointPadding: 0.1,
        groupPadding: 0.15,
        borderWidth: 0,
      },
    },
    series: [
      {
        name: "nárok na 3. dávku",
        color: colors[2020],
        data: ukoncenych.map((item) => [item[0] + 15778800000, item[1]]),
      },
      {
        name: "volná kapacita na 3. dávku",
        color: colors[2019],
        data: volnaKapacita.map((item) => [item[0], item[1]]),
        type: "line",
      },
      {
        name: "celková kapacita na 3. dávku",
        color: colors[2018],
        data: maxKapacita.map((item) => [item[0], item[1]]),
        type: "line",
      },
    ],
  });

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default ChartKapacita;
