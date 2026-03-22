package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"math"
	"os"
	"runtime"
	"sync"
)

type Stats struct {
	Min   float64
	Max   float64
	Sum   float64
	Count int64
}

func main() {
	filePath := "../measurements/measurements-1B.txt"
	file, err := os.Open(filePath)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	numWorkers := runtime.NumCPU()
	chunkChan := make(chan []byte, numWorkers)
	resultChan := make(chan map[string]*Stats, numWorkers)
	var wg sync.WaitGroup

	for i := 0; i < numWorkers; i++ {
		wg.Add(1)
		go worker(chunkChan, resultChan, &wg)
	}

	globalMap := make(map[string]*Stats)
	aggDone := make(chan bool)
	go func() {
		for partialMap := range resultChan {
			for station, pStats := range partialMap {
				if gStats, ok := globalMap[station]; ok {
					gStats.Min = math.Min(gStats.Min, pStats.Min)
					gStats.Max = math.Max(gStats.Max, pStats.Max)
					gStats.Sum += pStats.Sum
					gStats.Count += pStats.Count
				} else {
					globalMap[station] = pStats
				}
			}
		}
		aggDone <- true
	}()

	bufSize := 25 * 1024 * 1024 // 25MB Chunks
	buf := make([]byte, bufSize)
	leftover := make([]byte, 0)

	for {
		n, err := file.Read(buf)
		if n > 0 {
			data := append(leftover, buf[:n]...)
			lastNewline := bytes.LastIndexByte(data, '\n')

			if lastNewline != -1 {
				chunk := make([]byte, lastNewline)
				copy(chunk, data[:lastNewline])
				chunkChan <- chunk
				leftover = append([]byte(nil), data[lastNewline+1:]...)
			} else {
				leftover = data
			}
		}
		if err == io.EOF {
			break
		}
	}

	close(chunkChan)
	wg.Wait()
	close(resultChan)
	<-aggDone

	fmt.Printf("Processed %d unique stations.\n", len(globalMap))
}

func worker(chunks <-chan []byte, results chan<- map[string]*Stats, wg *sync.WaitGroup) {
	defer wg.Done()
	for chunk := range chunks {
		m := make(map[string]*Stats)

		lines := bytes.Split(chunk, []byte("\n"))
		for _, line := range lines {
			if len(line) == 0 {
				continue
			}

			sepIdx := bytes.IndexByte(line, ';')
			station := string(line[:sepIdx])
			temp := parseRawIntToFloat(line[sepIdx+1:])

			if s, ok := m[station]; ok {
				if temp < s.Min {
					s.Min = temp
				}
				if temp > s.Max {
					s.Max = temp
				}
				s.Sum += temp
				s.Count++
			} else {
				m[station] = &Stats{Min: temp, Max: temp, Sum: temp, Count: 1}
			}
		}
		results <- m
	}
}

func parseRawIntToFloat(raw []byte) float64 {
	var neg bool
	if raw[0] == '-' {
		neg = true
		raw = raw[1:]
	}

	var val int
	for _, b := range raw {
		if b >= '0' && b <= '9' {
			val = val*10 + int(b-'0')
		}
	}

	res := float64(val) / 10.0
	if neg {
		return -res
	}
	return res
}
