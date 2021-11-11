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
  "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/ockovani-rezervace.min.json"
).then((data) => {
  const mista = JSON.parse(data)
    .data.filter(
      (misto) =>
        misto.kalendar_ockovani === "V3" && misto.maximalni_kapacita > 0 //místa s kapacitou na třetí dávku
    )
    .map((misto) => ({
      ...misto,
      date: Date.parse(misto.datum),
      week: ISO8601_week_no(new Date(misto.datum)),
    }))
    .sort((a, b) => a.date - b.date);

  const tydny = mista.reduce((acc, curr) => {
    if (acc[curr.week]) {
      acc[curr.week].volna_kapacita += curr.volna_kapacita;
      acc[curr.week].maximalni_kapacita += curr.maximalni_kapacita;
    } else {
      acc[curr.week] = {
        volna_kapacita: curr.volna_kapacita,
        maximalni_kapacita: curr.maximalni_kapacita,
      };
    }
    new Date(curr.date + 15778800000).getDay() === 1
      ? (acc[curr.week] = { ...acc[curr.week], timestamp: curr.date })
      : null;
    return acc;
  }, {});

  const result1 = Object.keys(tydny)
    .filter((key) => tydny[key].timestamp)
    .map((key) => [tydny[key].timestamp, tydny[key].volna_kapacita])
    .sort((a, b) => a[0] - b[0]);

  const result2 = Object.keys(tydny)
    .filter((key) => tydny[key].timestamp)
    .map((key) => [tydny[key].timestamp, tydny[key].maximalni_kapacita])
    .sort((a, b) => a[0] - b[0]);

  // write data to file
  fs.writeFileSync(
    "./data/volnaKapacita.json",
    JSON.stringify(result1, null, 2),
    "utf8"
  );

  fs.writeFileSync(
    "./data/maxKapacita.json",
    JSON.stringify(result2, null, 2),
    "utf8"
  );
});
