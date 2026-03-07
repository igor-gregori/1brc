# 1 Billion Rows Challenge (1BRC)

The 1 Billion Rows Challenge (1BRC) is a focused exploration of how modern software stacks process massive amounts of data. The goal is simple: read a text file containing temperature measurements from various weather stations and calculate the minimum, maximum, and average temperature per station.

The catch? The file contains 1,000,000,000 (one billion) rows.

## About my implementation tries

1º With Bun, use [File I/O API](https://bun.com/docs/runtime/file-io) to open the entire file and do the calculations  
2º With Bun, use [Streams API](https://bun.com/docs/runtime/streams) to process the file with chunks  
3º With Go, ... i need read the golang doc ([bufio](https://pkg.go.dev/bufio) maybe)

## Objectives

1B lines  
1º Less than 1 minute  
2º Less than 10 seconds  
3º Less than 5 seconds

## Results

#### With the 1º implementation (open the entire file)

| Nº of lines |           Time spent |
| :---------- | -------------------: |
| 10k         |                  6ms |
| 100k        |                 33ms |
| 1M          |                300ms |
| 100M        |                  28s |
| 1B          | Process killed (OOM) |

## Others

Original repository: [The One Billion Row Challenge](https://github.com/gunnarmorling/1brc)  
Golang inspiration: [Reading 16GB File in Seconds](https://medium.com/swlh/processing-16gb-file-in-seconds-go-lang-3982c235dfa2)

I ran this tests in my WSL Ubuntu with 16 CPU's and 24GB of RAM
