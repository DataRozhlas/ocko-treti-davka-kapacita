import React, { useState, useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

const colors = {
  default: "#aaa",
  2020: "#e63946",
  2018: "#009FB8",
  2019: "#3E80B6",
  avg: "#e63946",
  avg: "#333",
  "uhrn-highlight": "#30638e",
};

function ChartProockovanost({ data }) {
  const maxDate = Math.max(
    ...Object.keys(data.davka3).map((key) => Number(key))
  );

  const [options, setOptions] = useState({
    chart: {
      type: "area",
    },
    title: {
      useHTML: true,
      text:
        data.name !== "Všechny věkové skupiny"
          ? `Věková skupina ${data.name} let`
          : `${data.name} (včetně malých dětí)`,
    },
    credits: {
      href: "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19",
      text: "Zdroj: Ministerstvo zdravotnictví ČR (výpočty iROZHLAS.CZ)",
    },
    exporting: {
      enabled: false,
    },
    xAxis: {
      type: "datetime",
      max: maxDate,
      tickmarkPlacement: "on",
      plotBands: [
        {
          color: "#f2f2f2",
          from: 1632096000000,
          to: maxDate,
          label: {
            text: "oficiálně probíhá<br>očkování 3. dávkou",
            style: {
              color: "#444",
            },
          },
        },
      ],
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
    tooltip: {
      //valueSuffix: " mm",
      shared: true,
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: true,
        color: colors.default,
        lineWidth: 0.5,
        dataLabels: {
          enabled: false,
        },
        marker: false,
        // marker: {
        //   symbol: 'circle',
        //   radius: 2
        // }
        pointPlacement: "on",
      },
    },
    series: [
      {
        name: "1. dávka",
        color: colors[2018],
        data: Object.keys(data.davka1)
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => [Number(k), (data.davka1[k] / (data.Z + data.M)) * 100]),
      },
      {
        name: "2. dávka",
        color: colors[2019],
        data: Object.keys(data.davka2)
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => [Number(k), (data.davka2[k] / (data.Z + data.M)) * 100]),
      },
      {
        name: "nárok na 3. dávku",
        type: "line",
        lineWidth: 2,
        dashStyle: "ShortDash",
        color: colors[2020],
        data: Object.keys(data.narok)
          .sort((a, b) => Number(a) - Number(b))
          .map((k) => {
            const timestamp = Number(k);
            // if (timestamp < 1632009600000) {
            //   return [timestamp, null];
            // } else {
            return [
              timestamp + 15778800000,
              (data.narok[k] / (data.Z + data.M)) * 100,
            ];
            // }
          }),
      },
      {
        name: "3. dávka",
        color: colors[2020],
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
