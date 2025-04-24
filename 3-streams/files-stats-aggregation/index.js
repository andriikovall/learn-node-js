import fs from "node:fs";
import { StatsAggregator } from "./stats-aggregator.js";
import { watchDirectory } from "./directory-watcher.js";

const statsAggregator = new StatsAggregator();

async function main() {
  const directoryToWatch = "./logs";

  if (!fs.existsSync(directoryToWatch)) {
    fs.mkdirSync(directoryToWatch, { recursive: true });
  }

  const stopWatching = watchDirectory(directoryToWatch, statsAggregator);

  const statsInterval = setInterval(() => {
    console.log("📊 Current Statistics:");
    console.log(JSON.stringify(statsAggregator.stats, null, 2));
  }, 5000);

  console.log(`Monitoring directory ${directoryToWatch} started...`);
  console.log(`For testing, create or add .txt files to this directory.`);

  // Setup graceful shutdown
  process.on("SIGINT", () => {
    console.log("\nShutting down...");
    clearInterval(statsInterval);
    stopWatching();
    statsAggregator.end(() => {
      console.log("Stats aggregator closed");
      process.exit(0);
    });
  });
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});