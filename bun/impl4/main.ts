const WORKER_COUNT = 12;

const workerUrl = new URL("worker.ts", import.meta.url).href;

const workers = Array.from({ length: WORKER_COUNT }, () => new Worker(workerUrl));

const file = Bun.file("../measurements/measurements.txt");

const stream = file.stream().pipeThrough(new TextDecoderStream());

let workerIndex = 0;
let brokenChunk = "";

for await (const chunk of stream) {
  const { okChunk, koChunk } = filterChunck(brokenChunk + chunk);
  brokenChunk = koChunk;
  workers[workerIndex]!.postMessage(okChunk);
  workerIndex = (workerIndex + 1) % WORKER_COUNT;
}

function filterChunck(chunk: string): { okChunk: string; koChunk: string } {
  const indexOfLastEOL = chunk.lastIndexOf("\n");
  if (indexOfLastEOL === -1) {
    return { okChunk: "", koChunk: chunk };
  }
  return {
    okChunk: chunk.substring(0, indexOfLastEOL + 1),
    koChunk: chunk.substring(indexOfLastEOL + 1),
  };
}

export type Stats = {
  min: number;
  max: number;
  sum: number;
  totalSamples: number;
};

function getWorkerStats(worker: Worker): Promise<Map<string, Stats>> {
  return new Promise((resolve) => {
    worker.postMessage("return-stats");
    worker.addEventListener("message", (event) => resolve(event.data), { once: true });
  });
}

const globalStats: Map<string, Stats> = new Map();

const partialStats = await Promise.all(workers.map(getWorkerStats));

for (const part of partialStats) {
  for (const [key, value] of part) {
    const stats = globalStats.get(key);
    if (!stats) {
      globalStats.set(key, value);
    } else {
      globalStats.set(key, {
        min: Math.min(stats.min, value.min),
        max: Math.max(stats.max, value.max),
        sum: stats.sum + value.sum,
        totalSamples: stats.totalSamples + value.totalSamples,
      });
    }
  }
}

workers.forEach((worker) => worker.terminate());
