const fs = require("fs");
const request = require("request");

// read JSON data in node.js

const getData = (url) => {
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};

function ISO8601_week_no(dt) {
  var tdt = new Date(dt.valueOf());
  var dayn = (dt.getDay() + 6) % 7;
  tdt.setDate(tdt.getDate() - dayn + 3);
  var firstThursday = tdt.valueOf();
  tdt.setMonth(0, 1);
  if (tdt.getDay() !== 4) {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - tdt) / 604800000);
}

getData(
  "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/ockovani.min.json"
).then((data) => {
  const skupiny = JSON.parse(data)
    .data.map((skupina) => ({
      ...skupina,
      date: Date.parse(skupina.datum),
      week: ISO8601_week_no(new Date(skupina.datum)),
    }))
    .sort((a, b) => a.date - b.date);
  const tydny = skupiny.reduce((acc, curr) => {
    if (acc[curr.week]) {
      curr.vakcina === "COVID-19 Vaccine Janssen"
        ? (acc[curr.week].value += curr.prvnich_davek)
        : (acc[curr.week].value += curr.druhych_davek);
    } else {
      curr.vakcina === "COVID-19 Vaccine Janssen"
        ? (acc[curr.week] = {
            value: curr.prvnich_davek,
          })
        : (acc[curr.week] = {
            value: curr.druhych_davek,
          });
    }
    new Date(curr.date + 15778800000).getDay() === 1
      ? (acc[curr.week] = { ...acc[curr.week], timestamp: curr.date })
      : null;
    return acc;
  }, {});

  const result = Object.keys(tydny)
    .filter((key) => tydny[key].timestamp)
    .map((key) => [tydny[key].timestamp, tydny[key].value])
    .sort((a, b) => a[0] - b[0]);

  // const zdrcniNaTydny = (denniData) => {
  //   const dny = Object.keys(denniData)
  //     .map((k) => Number(k))
  //     .sort((a, b) => a - b);
  //   const dnyTydny = dny.map((d) => {
  //     return {
  //       timestamp: d,
  //       value: denniData[String(d)].dokoncenych,
  //       week: ISO8601_week_no(new Date(d)),
  //     };
  //   });
  //   const tydny = dnyTydny.reduce((acc, curr) => {
  //     acc[curr.week]
  //       ? (acc[curr.week].value += curr.value)
  //       : (acc[curr.week] = { value: curr.value });
  //     new Date(curr.timestamp + 2629800000).getDay() === 1
  //       ? (acc[curr.week] = { ...acc[curr.week], timestamp: curr.timestamp })
  //       : null;
  //     return acc;
  //   }, {});
  //   return tydny;
  // };

  // write data to file
  fs.writeFileSync(
    "./data/ukoncenych.json",
    JSON.stringify(result, null, 2),
    "utf8"
  );
});
