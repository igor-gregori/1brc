package main

import (
	"fmt"
	"log"
	"math"
	"os"
	"strconv"
	"strings"
)

func main() {
	content, err := os.ReadFile("../measurements/measurements-1B.txt")

	if err != nil {
		log.Fatal("Error reading file:", err)
	}

	lines := strings.Split(string(content), "\n")

	type Result struct {
		min          float64
		max          float64
		sum          float64
		totalSamples int64
	}

	m := make(map[string]Result)

	for _, line := range lines {
		if line == "" {
			break
		}

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
}
