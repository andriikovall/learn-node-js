import fs from "node:fs";
import { pipeline } from "node:stream";
import { TextAnalyzer } from "./text-analyzer.js";

export const isTextFile = (path) => 
  [".txt", ".log", ".md"].some((ext) => path.endsWith(ext));

/**
 * Process a text file and send its statistics to the aggregator
 * 
 * @param {string} filePath - Path to the text file
 * @param {object} statsAggregator - Duplex stream to aggregate stats
 */
export function processTextFile(filePath, statsAggregator) {
  if (!isTextFile(filePath)) {
    console.error(`A text file expected for processing. Received: ${filePath}`);
    return;
  }

  const fileStream = fs.createReadStream(filePath, { encoding: "utf-8" });
  const analyzer = new TextAnalyzer(filePath);

  pipeline(fileStream, analyzer, (err) => {
    if (err) {
      console.error(`Error processing ${filePath}:`, err);
    }
  });

  analyzer.on("data", (chunk) => {
    const written = statsAggregator.write(chunk);
    if (!written) {
      analyzer.pause();
      statsAggregator.once("drain", () => {
        analyzer.resume();
      });
    }
  });
}
