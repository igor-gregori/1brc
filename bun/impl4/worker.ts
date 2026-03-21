import type { Stats } from "./main";

declare var self: Worker;

self.onmessage = (event: MessageEvent<string>) => {
  if (event.data === "return-stats") {
    postMessage(partialStats);
  } else {
    processChunk(event.data);
  }
};

const partialStats: Map<string, Stats> = new Map();
let remainder = "";

function processChunk(chunk: string) {
  let lineStart = 0;
  let lineEnd = 0;

  const data = remainder + chunk;

  while ((lineEnd = data.indexOf("\n", lineStart)) !== -1) {
    const line = data.slice(lineStart, lineEnd);
    lineStart = lineEnd + 1;

    if (line.length === 0) continue;

    const sepIndex = line.indexOf(";");
    const station = line.slice(0, sepIndex);
    const measurement = parseFloat(line.slice(sepIndex + 1));

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

  remainder = data.slice(lineStart);
}
