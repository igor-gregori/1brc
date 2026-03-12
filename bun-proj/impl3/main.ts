const workerOne = new Worker(new URL("worker.ts", import.meta.url).href);
const workerTwo = new Worker(new URL("worker.ts", import.meta.url).href);

const file = Bun.file("../measurements/measurements-100M.txt");

console.time("impl3");

const stream = file.stream().pipeThrough(new TextDecoderStream());

let lastChunkPart: string | undefined = "";
let lastWorkCalled = 1;

let chunkNumber = 0;

for await (const chunk of stream) {
  const t0 = performance.now();
  const rows: string[] = (lastChunkPart + chunk).split("\n");
  lastChunkPart = rows.pop();

  workerOne.postMessage(chunk);
  // if (lastWorkCalled === 1) {
  //   lastWorkCalled = 2;
  // } else {
  //   workerTwo.postMessage(rows);
  //   lastWorkCalled = 1;
  // }
  const t1 = performance.now();
  console.log(`Spending ${(t1 - t0).toFixed(4)}ms for chunk number ${chunkNumber}`);
  chunkNumber++;
}

async function getWorkerOneSummary(): Promise<string> {
  return new Promise<string>((res) => {
    workerOne.postMessage(["return-summary"]);
    workerOne.onmessage = (event) => {
      res(event.data);
    };
  });
}

await getWorkerOneSummary();

async function getWorkerTwoSummary(): Promise<string> {
  return new Promise<string>((res) => {
    workerTwo.postMessage(["return-summary"]);
    workerTwo.onmessage = (event) => {
      res(event.data);
    };
  });
}

await getWorkerTwoSummary();

workerOne.terminate();
workerTwo.terminate();

console.timeEnd("impl3");
