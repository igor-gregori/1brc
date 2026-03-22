package main

import (
	"bytes"
	"fmt"
	"log"
	"math"
	"os"
	"strconv"
	"strings"
)

type Stats struct {
	min          float64
	max          float64
	sum          float64
	totalSamples int64
}

func main() {
	file, err := os.Open("../measurements/measurements-1B.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	buf := make([]byte, 1024*1024) // 1MB buffer
	leftover := make([]byte, 0)

	m := make(map[string]Stats)

	for {
		n, _ := file.Read(buf)
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
				m[station] = Stats{
					min:          math.Min(result.min, measurement),
					max:          math.Max(result.max, measurement),
					sum:          result.sum + measurement,
					totalSamples: result.totalSamples + 1,
				}
			} else {
				m[station] = Stats{
					min:          measurement,
					max:          measurement,
					sum:          measurement,
					totalSamples: 1,
				}
			}
		}

		leftover = data[lastNewline+1:]
	}
}
