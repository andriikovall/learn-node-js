import { Blob } from "node:buffer";
import fs from "node:fs";

const BUF_SIZE = 20;
const byteLengthUtf8 = (str) => new Blob([str]).size;
const logFileStream = fs.createWriteStream("log.txt", {
  autoClose: false,
});

const drainCheckWrite = (data, cb) => {
  if (!logFileStream.write(data)) {
    logFileStream.once("drain", cb);
  } else {
    process.nextTick(cb);
  }
};

export class Logger {
  #buffersQ = [this.#allocBuffer()];
  #isWriting = false;
  #offset = 0;

  log(str) {
    const numBytesToWrite = byteLengthUtf8(str);
    if (this.#isWriting || this.#hasBufferSpace(numBytesToWrite)) {
      this.#enqueueLog(str);
    } else {
      this.#dumpToDisk();
      this.#enqueueLog(str);
    }
  }

  #hasBufferSpace(numOfBytesToWrite) {
    return this.#offset + numOfBytesToWrite < BUF_SIZE;
  }

  #allocBuffer() {
    return Buffer.alloc(BUF_SIZE, "\0", "utf-8");
  }

  #enqueueLog(val) {
    const numOfBytesToWrite = byteLengthUtf8(val);
    if (!this.#hasBufferSpace(numOfBytesToWrite)) {
      this.#buffersQ.push(this.#allocBuffer());
      this.#offset = 0;
    }
    const buf = this.#buffersQ.at(-1);
    buf.write(val, this.#offset);
    this.#offset += numOfBytesToWrite;
  }

  #dumpToDisk(cb) {
    this.#isWriting = true;
    const bufsToWrite = Buffer.concat(this.#buffersQ);
    this.#cleanBuffers();

    drainCheckWrite(bufsToWrite, (err) => {
      if (err) {
        console.error("Failed writing to log file", err.message);
        process.exit(1);
      }
      this.#isWriting = false;
      if (this.#offset > 0 || this.#buffersQ.length > 1) {
        this.#dumpToDisk();
      }
      cb?.();
    });
  }

  #cleanBuffers() {
    this.#buffersQ.length = 1;
    if (this.#buffersQ[0]) {
      this.#buffersQ[0].fill("\0");
    } else {
      this.#buffersQ = [this.#allocBuffer()];
    }
    this.#offset = 0;
  }

  dispose() {
    this.#dumpToDisk(() => {
      logFileStream.end();
    });
  }
}
