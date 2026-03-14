# 1 Billion Rows Challenge (1BRC)

The 1 Billion Rows Challenge (1BRC) is a focused exploration of how modern software stacks process massive amounts of data. The goal is simple: read a text file containing temperature measurements from various weather stations and calculate the minimum, maximum, and average temperature per station.

The catch? The file contains 1,000,000,000 (one billion) rows.

## About my implementation tries

Implementation 1 - With Bun, use File I/O to open the entire file and do the calculations.  
Implementation 2 - With Bun, use Streams API to process the file in chunks.  
Implementation 3 - With Bun, use Streams API to process the file in chunks and pass the summary job to a pool of background workers.  
Implementation ? - With Go, do something

## Objectives with 1B lines

1º - Less than 1 minute  
2º - Less than 10 seconds  
3º - Less than 5 seconds

## Results - Time spent by each implementation

| Nº of lines |     Implementation 1 | Implementation 2 | Implementation 3 |
| :---------- | -------------------: | ---------------: | ---------------: |
| 10k         |                  6ms |              8ms |             14ms |
| 100k        |                 33ms |             38ms |             25ms |
| 1M          |                300ms |            260ms |             75ms |
| 100M        |                  28s |              24s |               4s |
| 1B          | Process killed (OOM) |             230s |              35s |

## Others

#### Links

Original repository: [The One Billion Row Challenge](https://github.com/gunnarmorling/1brc)  
Bun File I/O API: [Bun File I/O](https://bun.com/docs/runtime/file-io)  
Bun Streams API: [Bun Streams](https://bun.com/docs/runtime/streams)  
Bun Workers API: [Bun Workers](https://bun.com/docs/runtime/workers)  
Golang inspiration: [Reading 16GB File in Seconds](https://medium.com/swlh/processing-16gb-file-in-seconds-go-lang-3982c235dfa2)  
Golang bufio: [go bufio](https://pkg.go.dev/bufio)

#### General observations

- I'm running this scripts 10 times on my pc and taking the avg, the objective here is comparing the implementations
- Passing an array on `worker.postMessage(arr)` is 10x slower than using a string `worker.postMessage(str)`
- Just for read the file with 1B lines, bun spend 5s
- For each chunk, if i use a plain Object i spend 3.5ms, if i use Map i spend 2.9ms
