# 1 Billion Rows Challenge (1BRC)

The 1 Billion Rows Challenge (1BRC) is a focused exploration of how modern software stacks process massive amounts of data. The goal is simple: read a text file containing temperature measurements from various weather stations and calculate the minimum, maximum, and average temperature per station.

The catch? The file contains 1,000,000,000 (one billion) rows.

## About my implementation tries

### With Bun

Implementation 1 - Open the entire file and perform the calculations.  
Implementation 2 - Process the file in chunks.  
Implementation 3 - Process the file in chunks and pass the summary job to a pool of workers.  
Implementation 4 - Same as 3, but with processChunk function improved.

### With Go

Implementation 1 - Open the entire file and perform the calculations.  
Implementation 2 - Process the file line by line.  
Implementation 3 - Process the file in chunks.  
Implementation 4 - Process the file in chunks and pass the summary job to a pool of workers.

## Objectives with 1B lines

1º - Less than 1 minute  
2º - Less than 30 seconds  
3º - Less than 10 seconds

## Results - Time spent by each implementation

|                      |  10k | 100k |    1M | 100M |    1B |
| -------------------: | ---: | ---: | ----: | ---: | ----: |
| Bun Implementation 1 | 15ms | 40ms | 250ms |  25s |   OOM |
| Bun Implementation 2 | 15ms | 40ms | 250ms |  20s | 3m20s |
| Bun Implementation 3 | 30ms | 50ms | 120ms |   3s |   30s |
| Bun Implementation 4 | 25ms | 45ms | 100ms |   2s |   25s |
|  Go Implementation 1 |  1ms | 15ms |  90ms |  10s |   OOM |
|  Go Implementation 2 |  1ms | 15ms | 100ms |  10s | 1m35s |
|  Go Implementation 3 |  1ms | 15ms |  80ms |   8s | 1m20s |
|  Go Implementation 4 |  2ms | 10ms |  60ms |   1s |    8s |

\*OOM = Process killed (Out Of Memory)

## Others

#### Observations/Reminders

- I'm running this scripts 10 times on my pc and taking the avg, the objective here is compare the implementations.
- Using bun, str.split() is 5x slower then str.slice() - Prob because we need allocate memory.
- Using bun, passing an array on `worker.postMessage(arr)` is 10x slower than using a string `worker.postMessage(str)`.
- Just for read the file with 1B lines Bun spend 5s.
- Using Map is a little bit faster than a plain Object.
- I know the problem with memory allocation, I'm spending almost 3ms for process each chunk, maybe if i pre-alocate the memory i can decrease the preassure on GC, but this is more bit brushing than i would like.
- Even with Golang, working with string and arrays it is slow for this problem.
- I'm fine with my implementations up this point, maybe i back other day and write some Rust/C code to get better times.

#### Links

Original repository: [The One Billion Row Challenge](https://github.com/gunnarmorling/1brc)  
Bun File I/O API: [Bun File I/O](https://bun.com/docs/runtime/file-io)  
Bun Streams API: [Bun Streams](https://bun.com/docs/runtime/streams)  
Bun Workers API: [Bun Workers](https://bun.com/docs/runtime/workers)  
Golang Bufio: [Go bufio](https://pkg.go.dev/bufio)  
Golang OS lib: [Go Os](https://pkg.go.dev/os#ReadFile)  
Golang Concorrency: [Go tour](https://go.dev/tour/concurrency/5)  
Golang inspiration: [Reading 16GB File in Seconds](https://medium.com/swlh/processing-16gb-file-in-seconds-go-lang-3982c235dfa2)
