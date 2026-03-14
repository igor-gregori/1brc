declare var self: Worker;

self.onmessage = (event: MessageEvent<string>) => {
  if (event.data === "return-summary") {
    postMessage(results);
  } else {
    processChuck(event.data);
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

function processChuck(chunk: string) {
  for (const row of chunk.split("\n")) {
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
