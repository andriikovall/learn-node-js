import fs from "fs";

const paths = process.argv.slice(2);
console.log("pathes:", paths);

for (const path of paths) {
  console.log("Started reading file", path);
  fs.readFile(path, { encoding: "utf-8" }, (err, data) => {
    if (err) {
      console.error("Error reading", path, err);
      return;
    }
    console.log("Finished reading file", path);
    console.log("Batching file to read", path);
    setImmediate(() => {
      console.log(`Batched file ${path} content`, data);
    });
  });
}
