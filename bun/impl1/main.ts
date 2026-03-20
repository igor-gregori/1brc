const file = Bun.file("../measurements/measurements.txt");

const content = await file.text();

type Stats = {
  [key: string]: {
    min: number;
    max: number;
    sum: number;
    totalSamples: number;
  };
};

let stats: Stats = {};

for (const row of content.split("\n")) {
  if (row === "") continue;

  const [station, strMeasurement] = row.split(";");

  if (!station || !strMeasurement) {
    throw new Error("Invalid data");
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
