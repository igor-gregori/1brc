const file = Bun.file("../measurements/measurements.txt");

const content = await file.text();

type Stats = {
  min: number;
  max: number;
  sum: number;
  totalSamples: number;
};

const globalStats: Map<string, Stats> = new Map();

for (const row of content.split("\n")) {
  if (row === "") continue;

  const [station, strMeasurement] = row.split(";");

  if (!station || !strMeasurement) {
    throw new Error("Invalid data");
  }

  const measurement = Number(strMeasurement);

  let stats = globalStats.get(station);
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
