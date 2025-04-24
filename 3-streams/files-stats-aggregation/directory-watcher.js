import path from "node:path";
import { DirectoryObserver } from "./directory-observer.js";
import { processTextFile, isTextFile } from "./file-processor.js";

export function watchDirectory(directory, statsAggregator) {
  const watcher = new DirectoryObserver(directory);

  watcher.addListener("added", (filename) => {
    if (!isTextFile(filename)) {
      return;
    }
    const filePath = path.join(directory, filename);
    console.log(`New file detected: ${filename}`);
    processTextFile(filePath, statsAggregator);
  });

  watcher.addListener("change", (filename) => {
    if (!isTextFile(filename)) {
      return;
    }
    const filePath = path.join(directory, filename);
    console.log(`File changed: ${filename}`);
    processTextFile(filePath, statsAggregator);
  });

  return () => {
    watcher.removeAllListeners();
  };
}