# 1 Billion Rows Challenge (1BRC)

The 1 Billion Rows Challenge (1BRC) is a focused exploration of how modern software stacks process massive amounts of data. The goal is simple: read a text file containing temperature measurements from various weather stations and calculate the minimum, maximum, and average temperature per station.

The catch? The file contains 1,000,000,000 (one billion) rows.

## About my implementation tries

Implementation 1 - With Bun, use [File I/O API](https://bun.com/docs/runtime/file-io) to open the entire file and do the calculations  
Implementation 2 - With Bun, use [Streams API](https://bun.com/docs/runtime/streams) to process the file with chunks  
Implementation 3 - With Go, ... i need read the golang doc ([bufio](https://pkg.go.dev/bufio) maybe)

## Objectives

1B lines  
1º Less than 1 minute  
2º Less than 10 seconds  
3º Less than 5 seconds

## Results

#### Implementation 1

| Nº of lines |           Time spent |
| :---------- | -------------------: |
| 10k         |                  6ms |
| 100k        |                 33ms |
| 1M          |                300ms |
| 100M        |                  28s |
| 1B          | Process killed (OOM) |

#### Implementation 2

| Nº of lines | Script version | Time spent |
| :---------- | :------------- | ---------: |
| 10k         | v1             |        8ms |
| 100k        | v1             |       38ms |
| 1M          | v1             |      260ms |
| 100M        | v1             |        24s |
| 1B          | v1             |      3m50s |

## Others

Original repository: [The One Billion Row Challenge](https://github.com/gunnarmorling/1brc)  
Golang inspiration: [Reading 16GB File in Seconds](https://medium.com/swlh/processing-16gb-file-in-seconds-go-lang-3982c235dfa2)
Bun workers: [Bun Workers](https://bun.com/docs/runtime/workers)

I ran this tests in my WSL Ubuntu with 16 CPU's and 24GB of RAM
