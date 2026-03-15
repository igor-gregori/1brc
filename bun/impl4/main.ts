const WORKER_COUNT = 12;

const workerUrl = new URL("worker.ts", import.meta.url).href;

const workers = Array.from({ length: WORKER_COUNT }, () => new Worker(workerUrl));

const file = Bun.file("../measurements/measurements-1B.txt");

console.time("impl3");

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

function getWorkerSummary(worker: Worker): Promise<string> {
  return new Promise((resolve) => {
    worker.postMessage("return-summary");
    worker.addEventListener("message", (event) => resolve(event.data), { once: true });
  });
}

await Promise.all(workers.map(getWorkerSummary));

workers.forEach((worker) => worker.terminate());

console.timeEnd("impl3");
