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

getData(
  "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/ockovani-demografie.min.json"
).then((data) => {
  const skupiny = JSON.parse(data)
    .data.map((skupina) => ({ ...skupina, date: Date.parse(skupina.datum) }))
    .sort((a, b) => a.date - b.date);

  console.log(skupiny.filter((skupina) => skupina.poradi_davky === 3));

  //   const dny = skupiny.reduce((acc, curr) => {
  //     if (acc[curr.date]) {
  //       curr.vakcina === "COVID-19 Vaccine Janssen"
  //         ? (acc[curr.date].dokoncenych += curr.prvnich_davek)
  //         : (acc[curr.date].dokoncenych += curr.druhych_davek);
  //     } else {
  //       curr.vakcina === "COVID-19 Vaccine Janssen"
  //         ? (acc[curr.date] = {
  //             dokoncenych: curr.prvnich_davek,
  //           })
  //         : (acc[curr.date] = {
  //             dokoncenych: curr.druhych_davek,
  //           });
  //     }
  //     return acc;
  //   }, {});

  // write data to file
  //   fs.writeFileSync(
  //     "./data/ukoncenych.json",
  //     JSON.stringify(dny, null, 2),
  //     "utf8"
  //   );
});
