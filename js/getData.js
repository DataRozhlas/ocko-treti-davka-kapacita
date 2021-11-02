// read JSON data in node.js

const getData = (url) => {
  return new Promise((resolve, reject) => {
    const request = require("request");
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
  const mista = JSON.parse(data).data.filter(
    (misto) => misto.kalendar_ockovani === "V3" && misto.maximalni_kapacita > 0
  );
  console.log(mista);
});
