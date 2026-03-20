const file = Bun.file("../measurements/measurements.txt");

const stream = file.stream().pipeThrough(new TextDecoderStream());

type Stats = {
  min: number;
  max: number;
  sum: number;
  totalSamples: number;
};

const globalStats: Map<string, Stats> = new Map();

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

    const stats = globalStats.get(station);
    if (stats === undefined) {
      globalStats.set(station, {
        min: measurement,
        max: measurement,
        sum: measurement,
        totalSamples: 1,
      });
    } else {
      stats.min = Math.min(stats.min, measurement);
      stats.max = Math.max(stats.max, measurement);
      stats.sum += measurement;
      stats.totalSamples++;
      globalStats.set(station, stats);
    }
  }
}
