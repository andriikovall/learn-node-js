import { Transform } from "node:stream";
import { countWords } from "./word-counter.js";
import { KEYWORDS } from "./stats-aggregator.js";

export class TextAnalyzer extends Transform {
  constructor(filename, options = {}) {
    super(options);
    this.filename = filename;
    this.buffer = "";
  }

  _transform(chunk, encoding, next) {
    this.buffer += chunk.toString();
    next();
  }

  _flush(next) {
    const countResult = countWords(this.buffer, KEYWORDS);
    
    const transformationResult = {
      filename: this.filename,
      totalWords: countResult.totalWords,
      keywordsCounts: countResult.counts,
    };

    next(null, JSON.stringify(transformationResult));
  }
}
