# 1 Billion Rows Challenge (1BRC)

The 1 Billion Rows Challenge (1BRC) is a focused exploration of how modern software stacks process massive amounts of data. The goal is simple: read a text file containing temperature measurements from various weather stations and calculate the minimum, maximum, and average temperature per station.

The catch? The file contains 1,000,000,000 (one billion) rows.

## About my implementation tries

### With bun

Implementation 1 - With Bun, use File I/O to open the entire file and do the calculations.  
Implementation 2 - With Bun, use Streams API to process the file in chunks.  
Implementation 3 - With Bun, use Streams API to process the file in chunks and pass the summary job to a pool of background workers.  
Implementation 4 - Same as 3, but with processChunk function improved.

### With Go

Implementation 1 - With Go, use OS lib top open the entire file and do the calculations.

## Objectives with 1B lines

1º - Less than 1 minute  
2º - Less than 10 seconds  
3º - Less than 5 seconds

## Results - Time spent by each implementation

|                      |  10k | 100k |    1M | 100M |   1B |
| -------------------: | ---: | ---: | ----: | ---: | ---: |
| Bun Implementation 1 |  6ms | 33ms | 300ms |  28s |  OOM |
| Bun Implementation 2 |  8ms | 38ms | 260ms |  24s | 230s |
| Bun Implementation 3 | 14ms | 25ms |  75ms |   4s |  35s |
| Bun Implementation 4 | 15ms | 22ms |  68ms |   2s |  22s |
|  Go Implementation 1 |  1ms | 11ms |  84ms |  10s |  OOM |

\*OOM = Process killed (Out Of Memory)

## Others

#### Links

Original repository: [The One Billion Row Challenge](https://github.com/gunnarmorling/1brc)  
Bun File I/O API: [Bun File I/O](https://bun.com/docs/runtime/file-io)  
Bun Streams API: [Bun Streams](https://bun.com/docs/runtime/streams)  
Bun Workers API: [Bun Workers](https://bun.com/docs/runtime/workers)  
Golang inspiration: [Reading 16GB File in Seconds](https://medium.com/swlh/processing-16gb-file-in-seconds-go-lang-3982c235dfa2)  
Golang bufio: [Go bufio](https://pkg.go.dev/bufio)  
Golang OS lib: [Go Os](https://pkg.go.dev/os#ReadFile)

#### General observations

- I'm running this scripts 10 times on my pc and taking the avg. The objective here is compare the implementations
- Using bun, passing an array on `worker.postMessage(arr)` is 10x slower than using a string `worker.postMessage(str)`
- Just for read the file with 1B lines bun spend 5s
- Maybe I can improve more my ts/bun implementation. I know the problem with memory allocation, I'm spending 2.9ms for process each chunk, maybe if i pre-alocate the memory I can decrease the preassure on GC.
- If I need to improve the code to avoid garbage collector issues, I'd rather choose another language without a garbage collector, just for learning and fun.
