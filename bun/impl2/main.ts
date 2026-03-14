const file = Bun.file("../measurements/measurements.txt");

console.time("impl2");

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

let lastChunkPart: string | undefined = "";

// let chunkNumber = 0;

for await (const chunk of stream) {
  // const t0 = performance.now();
  processChuck(chunk);
  // const t1 = performance.now();
  // console.log(`Chunck ${chunkNumber} processed in ${(t1 - t0).toFixed(3)}ms`);
  // chunkNumber++;
}

function processChuck(chunk: string) {
  const rows = (lastChunkPart + chunk).split("\n");
  lastChunkPart = rows.pop();

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

console.timeEnd("impl2");
