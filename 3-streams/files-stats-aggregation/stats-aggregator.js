import { Duplex } from "node:stream";

const MAX_CONCURRENT_FILES = 3;

const KEYWORDS = ["error", "warning", "debug", "info"];

class StatsAggregator extends Duplex {
  constructor(options = {}) {
    super({ allowHalfOpen: true, ...options });
    
    this.stats = {
      totalFiles: 0,
      totalWords: 0,
      keywordCounts: Object.fromEntries(KEYWORDS.map((kw) => [kw, 0])),
    };

    this._fileNames = new Set();
    
    this._queue = [];
    this._currentlyProcessing = 0;
    
    this._setupQueueProcessing();
  }

  _setupQueueProcessing() {
    this.intervalID = setInterval(() => {
      if (!this._queue.length) {
        return;
      }
      const chunk = this._queue.shift();
      this._processChunk(chunk);
    }, 2000);
  }

  _processChunk(chunk) {
    this._currentlyProcessing += 1;
    
    // simulate processing delay
    setTimeout(() => {
      console.log(`Currently processing: ${this._currentlyProcessing} files`);

      const parsedChunk = JSON.parse(chunk);
      if (!this._fileNames.has(parsedChunk.filename)) {
        this._fileNames.add(parsedChunk.filename);
      }

      this.stats.totalFiles = this._fileNames.size;
      this.stats.totalWords += parsedChunk.totalWords;
      
      for (const [keyword, count] of Object.entries(parsedChunk.keywordsCounts)) {
        this.stats.keywordCounts[keyword] += count;
      }
      
      this._currentlyProcessing -= 1;
    }, PROCESSING_DELAY_MS);
  }

  _write(chunk, encoding, next) {
    if (this._currentlyProcessing >= MAX_CONCURRENT_FILES) {
      console.log('Queuing file for later processing');
      this._queue.push(chunk);
      next();
      return;
    }
    
    this._processChunk(chunk);
    console.log("✅ Processing file data");
    next();
  }

  _read(size) {
    // Not used in this implementation but required for Duplex streams
  }

  _final(next) {
    console.log('📋 Finalizing stats aggregation');
    clearInterval(this.intervalID);
    next();
  }
}

export { StatsAggregator, KEYWORDS };