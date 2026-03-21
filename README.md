# 1 Billion Rows Challenge (1BRC)

The 1 Billion Rows Challenge (1BRC) is a focused exploration of how modern software stacks process massive amounts of data. The goal is simple: read a text file containing temperature measurements from various weather stations and calculate the minimum, maximum, and average temperature per station.

The catch? The file contains 1,000,000,000 (one billion) rows.

## About my implementation tries

### With Bun

Implementation 1 - Use File I/O to open the entire file and perform the calculations.  
Implementation 2 - Use Streams API to process the file in chunks.  
Implementation 3 - Use Streams API to process the file in chunks and pass the summary job to a pool of background workers.  
Implementation 4 - Same as 3, but with processChunk function improved.

### With Go

Implementation 1 - Use OS lib to open the entire file and perform the calculations.  
Implementation 2 - Use bufio package to process the file line by line.
Implementation 3 - Use OS lib to process the file in chunks.

## Objectives with 1B lines

1º - Less than 1 minute  
2º - Less than 10 seconds  
3º - Less than 5 seconds

## Results - Time spent by each implementation

|                      |  10k | 100k |    1M | 100M |    1B |
| -------------------: | ---: | ---: | ----: | ---: | ----: |
| Bun Implementation 1 | 15ms | 40ms | 250ms |  25s |   OOM |
| Bun Implementation 2 | 15ms | 40ms | 250ms |  20s | 3m20s |
| Bun Implementation 3 | 30ms | 50ms | 120ms |   3s |   30s |
| Bun Implementation 4 | 25ms | 45ms | 100ms |   2s |   25s |
|  Go Implementation 1 |  1ms | 15ms |  90ms |  10s |   OOM |
|  Go Implementation 2 |  1ms | 15ms | 100ms |  10s | 1m35s |
|  Go Implementation 3 |  1ms | 12ms |  87ms |   8s |   83s |

\*OOM = Process killed (Out Of Memory)

## Others

#### General observations

- I'm running this scripts 10 times on my pc and taking the avg. The objective here is compare the implementations.
- Using bun, passing an array on `worker.postMessage(arr)` is 10x slower than using a string `worker.postMessage(str)`.
- Just for read the file with 1B lines bun spend 5s.
- Using bun, str.split() is 5x slower then str.slice(), and Map is a little bit faster than a plain Object.
- Maybe I can improve more my ts/bun implementation. I know the problem with memory allocation, I'm spending 2.9ms for process each chunk, maybe if I pre-alocate the memory I can decrease the preassure on GC.
- Maybe I can implement some tricks to use less GC/allocation, but I want test some other languages and keep the code understandable.
- Some implementations are not totally complete, I need handle the results of parallel process.

#### Links

Original repository: [The One Billion Row Challenge](https://github.com/gunnarmorling/1brc)  
Bun File I/O API: [Bun File I/O](https://bun.com/docs/runtime/file-io)  
Bun Streams API: [Bun Streams](https://bun.com/docs/runtime/streams)  
Bun Workers API: [Bun Workers](https://bun.com/docs/runtime/workers)  
Golang inspiration: [Reading 16GB File in Seconds](https://medium.com/swlh/processing-16gb-file-in-seconds-go-lang-3982c235dfa2)  
Golang bufio: [Go bufio](https://pkg.go.dev/bufio)  
Golang OS lib: [Go Os](https://pkg.go.dev/os#ReadFile)
