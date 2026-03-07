# 1 Billion Rows Challenge (1BRC)

The 1 Billion Rows Challenge (1BRC) is a focused exploration of how modern software stacks process massive amounts of data. The goal is simple: read a text file containing temperature measurements from various weather stations and calculate the minimum, maximum, and average temperature per station.

The catch? The file contains 1,000,000,000 (one billion) rows.

## About my implementation tries

1º With Bun, use File I/O API to open the entire file and do the calculations  
2º With Bun, use Streams API to process the file with chunks  
3º With Go, ... i need read the golang doc

## Objective

1º Less than 1 minute  
2º Less than 10 seconds  
3º Less than 5 seconds

## Results

#### With the 1º implementation (using Bun File I/O API)

- 6ms to process 10k lines
- 33ms to process 100k lines
- 300ms to process 1M lines
- 28s to process 100M lines
- process killed (out of mem, 24gb in my WSL Ubuntu) with 1B lines

## Others

Original repository: [The One Billion Row Challenge](https://github.com/gunnarmorling/1brc)
