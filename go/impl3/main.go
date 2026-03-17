package main

import (
	"bytes"
	"fmt"
	"log"
	"math"
	"os"
	"strconv"
	"strings"
	"time"
)

type Result struct {
	min          float64
	max          float64
	sum          float64
	totalSamples int64
}

func main() {
	file, err := os.Open("../measurements/measurements-100k.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	start := time.Now()

	buf := make([]byte, 1024*1024) // 1MB buffer
	leftover := make([]byte, 0)

	m := make(map[string]Result)
	chunckCounter := 0

	for {
		n, err := file.Read(buf)
		if err != nil {
			fmt.Println(err)
			break
		}

		if n == 0 {
			break
		}

		data := append(leftover, buf[:n]...)

		lastNewline := bytes.LastIndexByte(data, '\n')
		if lastNewline == -1 {
			leftover = data
			continue
		}

		chunk := string(data[:lastNewline])
		lines := strings.Split(chunk, "\n")
		for _, line := range lines {
			parts := strings.Split(line, ";")
			station, strMeasurement := parts[0], parts[1]

			measurement, err := strconv.ParseFloat(strMeasurement, 64)
			if err != nil {
				fmt.Println("Error: The string is not a valid number!")
				break
			}

			result, ok := m[station]
			if ok {
				m[station] = Result{
					min:          math.Min(result.min, measurement),
					max:          math.Max(result.max, measurement),
					sum:          result.sum + measurement,
					totalSamples: result.totalSamples + 1,
				}
			} else {
				m[station] = Result{
					min:          measurement,
					max:          measurement,
					sum:          measurement,
					totalSamples: 1,
				}
			}
		}

		chunckCounter++

		leftover = data[lastNewline+1:]
	}

	fmt.Println("Chunk counter:", chunckCounter)

	end := time.Now()
	timeSpent := end.Sub(start)
	fmt.Println("Time spent", timeSpent.Milliseconds(), "ms")
}
