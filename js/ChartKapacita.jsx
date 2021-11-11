import React, { useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import kapacita from "./../data/kapacita.json";
import ukoncenych from "./../data/ukoncenych.json";

function ChartKapacita() {
  const [options, setOptions] = useState({
    title: {
      useHTML: true,
      text: "Jak dlouhé budou fronty na třetí dávku",
    },
    credits: {
      href: "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19",
      text: "Zdroj: Ministerstvo zdravotnictví ČR (výpočty iROZHLAS.CZ)",
    },
    xAxis: {
      type: "datetime",
      tickmarkPlacement: "on",
    },
    series: [
      {
        name: "lidé, kterým uplyne šest měsíců od ukončeného očkování",
        data: Object.keys(ukoncenych).map((key) => [
          Number(key) + 15778800000,
          ukoncenych[key].dokoncenych,
        ]),
      },
      {
        name: "volná kapacita na třetí dávku",
        data: Object.keys(kapacita).map((key) => [
          Number(key),
          kapacita[key].volna_kapacita,
        ]),
      },
      {
        name: "maximální kapacita na třetí dávku",
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
