const worker = new Worker(new URL("worker.ts", import.meta.url).href);
// TODO: create more workers, (worker pool maybe?)

const file = Bun.file("../measurements/measurements-100M.txt");

console.time("impl3");

const stream = file.stream().pipeThrough(new TextDecoderStream());

let lastChunkPart: string | undefined = "";

// TODO: How much time i spent just for read the file?
for await (const chunk of stream) {
  const rows: string[] = (lastChunkPart + chunk).split("\n");
  lastChunkPart = rows.pop();
  worker.postMessage(rows);
}

async function getSummary(): Promise<string> {
  return new Promise<string>((res) => {
    worker.postMessage(["return-summary"]);
    worker.onmessage = (event) => {
      res(event.data);
    };
  });
}

await getSummary();

worker.terminate();

console.timeEnd("impl3");
