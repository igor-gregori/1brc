declare var self: Worker;

let chunkCounter = 0;

self.onmessage = (event: MessageEvent<string[]>) => {
  if (event.data[0] === "return-summary") {
    postMessage(results);
  } else {
    console.log(`Processing chunk n${chunkCounter}`);
    // processChuck(event.data);
    chunkCounter++;
  }
};

type Results = {
  [key: string]: {
    min: number;
    max: number;
    sum: number;
    totalSamples: number;
  };
};

let results: Results = {};

function processChuck(rows: string[]) {
  for (const row of rows) {
    if (row === "") continue;

    const [station, strMeasurement] = row.split(";");

    if (!station || !strMeasurement) {
      throw new Error("Invalid row");
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
