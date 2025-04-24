import { EventEmitter } from "node:events";
import fs from "node:fs";
import path from "node:path";

export class DirectoryObserver extends EventEmitter {
  constructor(dirPath) {
    super();
    const stat = fs.statSync(dirPath, {
      throwIfNoEntry: false,
    });

    if (!stat?.isDirectory()) {
      throw new Error(`Not a directory: ${dirPath}`);
    }

    fs.watch(dirPath, "utf-8", (ev, filename) => {
      const fullPath = path.join(dirPath, filename);
      if (ev === "change") {
        this.emit("change", filename);
      } else if (ev === "rename") {
        if (fs.existsSync(fullPath)) {
          this.emit("added", filename);
        } else {
          this.emit("deleted", filename);
        }
      }
    });
  }
}
