import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import kapacita from "./../data/kapacita.json";
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
      text: "Zdroj: Ministerstvo zdravotnictví ČR (výpočty iROZHLAS.CZ)",
    },
    xAxis: {
      type: "datetime",
      tickmarkPlacement: "on",
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
        data: Object.keys(ukoncenych).map((key) => [
          Number(key) + 15778800000,
          ukoncenych[key].dokoncenych,
        ]),
      },
      {
        name: "volná kapacita na 3. dávku",
        data: Object.keys(kapacita).map((key) => [
          Number(key),
          kapacita[key].volna_kapacita,
        ]),
      },
      {
        name: "celková kapacita na 3. dávku",
        data: Object.keys(kapacita).map((key) => [
          Number(key),
          kapacita[key].maximalni_kapacita,
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

export default ChartKapacita;
