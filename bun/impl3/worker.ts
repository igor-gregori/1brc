import type { Stats } from "./main";

declare var self: Worker;

self.onmessage = (event: MessageEvent<string>) => {
  if (event.data === "return-stats") {
    postMessage(partialStats);
  } else {
    processChuck(event.data);
  }
};

const partialStats: Map<string, Stats> = new Map();

function processChuck(chunk: string) {
  for (const row of chunk.split("\n")) {
    if (row === "") continue;

    const [station, strMeasurement] = row.split(";");

    if (!station || !strMeasurement) {
      throw new Error("Invalid row");
    }

    const measurement = Number(strMeasurement);

    const stats = partialStats.get(station);
    if (stats === undefined) {
      partialStats.set(station, {
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
      partialStats.set(station, stats);
    }
  }
}
