declare var self: Worker;

self.onmessage = (event: MessageEvent<string>) => {
  if (event.data === "return-summary") {
    postMessage(results);
  } else {
    processChunk(event.data);
  }
};

type Results = {
  min: number;
  max: number;
  sum: number;
  count: number;
};

const results: Map<string, Results> = new Map();
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
    const val = parseFloat(line.slice(sepIndex + 1));

    const entry = results.get(station);

    if (entry) {
      if (val < entry.min) entry.min = val;
      if (val > entry.max) entry.max = val;
      entry.sum += val;
      entry.count++;
    } else {
      results.set(station, {
        min: val,
        max: val,
        sum: val,
        count: 1,
      });
    }
  }

  remainder = data.slice(lineStart);
}
