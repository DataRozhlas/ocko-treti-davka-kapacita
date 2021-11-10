//stáhni ročníky
const vekoveSkupiny = require("../data/vekoveSkupiny.js");
const hranice = [
  [0, 11],
  [12, 15],
  [16, 17],
  [18, 24],
  [25, 29],
  [30, 34],
  [35, 39],
  [40, 44],
  [45, 49],
  [50, 54],
  [55, 59],
  [60, 64],
  [65, 69],
  [70, 74],
  [75, 79],
  [80, 100],
];
const request = require("request");
const fs = require("fs");

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

const zdrcniVekoveSkupiny = (vekoveSkupiny, hranice) => {
  const soucty = hranice.map((i) => {
    return {
      name: i[0] === 80 ? "80+" : `${i[0]}-${i[1]}`,

      M: vekoveSkupiny.muzi.reduce((acc, curr) => {
        if (curr[0] >= i[0] && curr[0] <= i[1]) {
          return acc + curr[1];
        } else {
          return acc;
        }
      }, 0),
      Z: vekoveSkupiny.zeny.reduce((acc, curr) => {
        if (curr[0] >= i[0] && curr[0] <= i[1]) {
          return acc + curr[1];
        } else {
          return acc;
        }
      }, 0),
    };
  });
  const result = [
    ...soucty,
    // {
    //   name: "all",

    //   M: vekoveSkupiny.muzi.reduce((acc, curr) => {
    //     return (acc += curr[1]);
    //   }, 0),
    //   Z: vekoveSkupiny.zeny.reduce((acc, curr) => {
    //     return (acc += curr[1]);
    //   }, 0),
    // },
  ];

  return result;
};

// pokud některý den některá skupina chybí, vezmi číslo z předchozího dne, aby v grafu nebyl zub
const vyhlad = (davka) => {
  const keys = Object.keys(davka);
  const min = Math.min(...keys.map((i) => parseInt(i)));
  const max = Math.max(...keys.map((i) => parseInt(i)));
  let n = min;
  while (n < max) {
    davka[String(n)] ? null : (davka[String(n)] = davka[String(n - 86400000)]);
    n += 86400000;
  }
  return davka;
};

getData(
  "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/ockovani-demografie.min.json"
).then((data) => {
  const vakcinaceDemo = JSON.parse(data)
    .data.map((i) => {
      return { ...i, date: Date.parse(i.datum) };
    })
    .sort((a, b) => a.date - b.date);
  const zdrcnuteSkupiny = zdrcniVekoveSkupiny(vekoveSkupiny, hranice);

  const ockovaniPoDnech = zdrcnuteSkupiny.map((skupina) => {
    return {
      ...skupina,
      davka1: vyhlad(
        vakcinaceDemo
          .filter((i) => {
            return i.vekova_skupina === skupina.name && i.poradi_davky === 1;
          })
          .reduce((acc, curr) => {
            if (Object.keys(acc).length > 0) {
              const keys = Object.keys(acc).map((i) => Number(i));
              const last = Math.max(...keys);
              acc[curr.date] = curr.pocet_davek + acc[String(last)];
            } else {
              acc[curr.date] = curr.pocet_davek;
            }
            return acc;
          }, {})
      ),
      davka2: vakcinaceDemo
        .filter((i) => {
          return i.vekova_skupina === skupina.name && i.poradi_davky === 2;
        })
        .reduce((acc, curr) => {
          if (Object.keys(acc).length > 0) {
            const keys = Object.keys(acc).map((i) => Number(i));
            const last = Math.max(...keys);
            acc[curr.date] = curr.pocet_davek + acc[String(last)];
          } else {
            acc[curr.date] = curr.pocet_davek;
          }
          return acc;
        }, {}),
      davka3: vakcinaceDemo
        .filter((i) => {
          return i.vekova_skupina === skupina.name && i.poradi_davky === 3;
        })
        .reduce((acc, curr) => {
          if (Object.keys(acc).length > 0) {
            const keys = Object.keys(acc).map((i) => Number(i));
            const last = Math.max(...keys);
            acc[curr.date] = curr.pocet_davek + acc[String(last)];
          } else {
            acc[curr.date] = curr.pocet_davek;
          }
          return acc;
        }, {}),
      narok: vakcinaceDemo
        .filter((i) => {
          return (
            i.vekova_skupina === skupina.name &&
            ((i.poradi_davky === 2 && i.vakcina_kod !== "CO04") ||
              (i.poradi_davky === 1 && i.vakcina_kod === "CO04"))
          );
        })
        .reduce((acc, curr) => {
          if (Object.keys(acc).length > 0) {
            const keys = Object.keys(acc).map((i) => Number(i));
            const last = Math.max(...keys);
            acc[curr.date] = curr.pocet_davek + acc[String(last)];
          } else {
            acc[curr.date] = curr.pocet_davek;
          }
          return acc;
        }, {}),
    };
  });

  //součet pro všechny věkové kategorie
  const ockovaniPoDnechAll = ockovaniPoDnech.reduce(
    (acc, curr) => {
      acc.Z = acc.Z + curr.Z;
      acc.M = acc.M + curr.M;
      const keys1 = Object.keys(curr.davka1);
      keys1.forEach((i) => {
        acc.davka1[i]
          ? (acc.davka1[i] = acc.davka1[i] + curr.davka1[i])
          : (acc.davka1[i] = curr.davka1[i]);
      });
      const keys2 = Object.keys(curr.davka2);
      keys2.forEach((i) => {
        acc.davka2[i]
          ? (acc.davka2[i] = acc.davka2[i] + curr.davka2[i])
          : (acc.davka2[i] = curr.davka2[i]);
      });
      const keys3 = Object.keys(curr.davka3);
      keys3.forEach((i) => {
        acc.davka3[i]
          ? (acc.davka3[i] = acc.davka3[i] + curr.davka3[i])
          : (acc.davka3[i] = curr.davka3[i]);
      });
      const keys4 = Object.keys(curr.narok);
      keys4.forEach((i) => {
        acc.narok[i]
          ? (acc.narok[i] = acc.narok[i] + curr.narok[i])
          : (acc.narok[i] = curr.narok[i]);
      });

      return acc;
    },
    {
      name: "Všechny věkové skupiny",
      M: 0,
      Z: 0,
      davka1: {},
      davka2: {},
      davka3: {},
      narok: {},
    }
  );

  // write data to file
  fs.writeFileSync(
    "./data/davky_demo.json",
    JSON.stringify([ockovaniPoDnechAll, ...ockovaniPoDnech], null, 2),
    "utf8"
  );

  //console.log(vyhlad(ockovaniPoDnechAll.davka1));
  //console.log(ockovaniPoDnech);

  //console.log(vakcinaceDemo);
  // console.log(zdrcnuteSkupiny);
  //console.log(all);
});
