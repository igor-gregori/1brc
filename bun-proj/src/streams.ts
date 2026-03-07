const file = Bun.file("../measurements/measurements-1M.txt");

console.time("Streams API method v1");

const stream = file.stream().pipeThrough(new TextDecoderStream());

type Results = {
  [key: string]: {
    min: number;
    max: number;
    sum: number;
    totalSamples: number;
  };
};

let results: Results = {};

let brokenRow: string | null = null;

for await (const chunk of stream) {
  processChuck(chunk);
}

function processChuck(chunk: string) {
  for (let row of chunk.split("\n")) {
    if (row === "") continue;

    if (brokenRow !== null) {
      row = brokenRow + row;
      console.log("weld", row);
      brokenRow = null;
    }

    const [station, strMeasurement] = row.split(";");

    if (!station || !strMeasurement) {
      // 1º Think
      // I need handle broken rows here
      // Maybe I can save the number of the chunk and try to join with the next
      // ...
      // throw new Error("Invalid data");
      // brokenRows.push(row);

      // 2º Think
      // If i take a broken row, i save this broken row and join with the next row.

      // 🚧 WIP:
      // I'm having a problem to identify broken rows
      // See this output:
      //  weld Madīnat Zāyid;36.0
      //  weld Uracoa;-54.2
      //  weld .0Archdale;-28.4 <- 🟡 This is wrong, can cause invalid results
      //  weld Morpará;27.0
      //  weld Bourne;79.7
      //  weld Ghal Kalān;-5.
      // I need a better way to identify broken rows

      brokenRow = row;
      continue;
    }

    const measurement = Number(strMeasurement);

    if (results[station] === undefined) {
      results[station] = {
        min: measurement,
        max: measurement,
        sum: measurement,
        totalSamples: 1,
      };
    } else {
      if (results[station].min > measurement) {
        results[station].min = measurement;
      }
      if (results[station].max < measurement) {
        results[station].max = measurement;
      }
      results[station].sum += measurement;
      results[station].totalSamples++;
    }
  }
}

console.timeEnd("Streams API method v1");
