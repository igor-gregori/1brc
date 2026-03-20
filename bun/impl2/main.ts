const file = Bun.file("../measurements/measurements.txt");

const stream = file.stream().pipeThrough(new TextDecoderStream());

type Stats = {
  [key: string]: {
    min: number;
    max: number;
    sum: number;
    totalSamples: number;
  };
};

let stats: Stats = {};

let lastChunkPart: string | undefined = "";

for await (const chunk of stream) {
  processChunck(chunk);
}

function processChunck(chunk: string) {
  const rows = (lastChunkPart + chunk).split("\n");
  lastChunkPart = rows.pop();

  for (const row of rows) {
    if (row === "") continue;

    const [station, strMeasurement] = row.split(";");

    if (!station || !strMeasurement) {
      throw new Error("Invalid row");
    }

    const measurement = Number(strMeasurement);

    if (stats[station] === undefined) {
      stats[station] = {
        min: measurement,
        max: measurement,
        sum: measurement,
        totalSamples: 1,
      };
    } else {
      stats[station].min = Math.min(stats[station].min, measurement);
      stats[station].max = Math.max(stats[station].max, measurement);
      stats[station].sum += measurement;
      stats[station].totalSamples++;
    }
  }
}
