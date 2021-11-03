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
  "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/ockovani-rezervace.min.json"
).then((data) => {
  const mista = JSON.parse(data)
    .data.filter(
      (misto) =>
        misto.kalendar_ockovani === "V3" && misto.maximalni_kapacita > 0 //místa s kapacitou na třetí dávku
    )
    .map((misto) => ({ ...misto, date: Date.parse(misto.datum) }))
    .sort((a, b) => a.date - b.date);

  const dny = mista.reduce((acc, curr) => {
    if (acc[curr.date]) {
      acc[curr.date].volna_kapacita += curr.volna_kapacita;
      acc[curr.date].maximalni_kapacita += curr.maximalni_kapacita;
    } else {
      acc[curr.date] = {
        volna_kapacita: curr.volna_kapacita,
        maximalni_kapacita: curr.maximalni_kapacita,
      };
    }
    return acc;
  }, {});

  // write data to file
  fs.writeFileSync(
    "./data/kapacita.json",
    JSON.stringify(dny, null, 2),
    "utf8"
  );
});
