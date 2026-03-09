const file = Bun.file("../measurements/measurements.txt");

console.time("File I/O API");

const content = await file.text();

type Results = {
  [key: string]: {
    min: number;
    max: number;
    sum: number;
    totalSamples: number;
  };
};

let results: Results = {};

for (const row of content.split("\n")) {
  if (row === "") continue;

  const [station, strMeasurement] = row.split(";");

  if (!station || !strMeasurement) {
    throw new Error("Invalid data");
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

console.timeEnd("File I/O API");
