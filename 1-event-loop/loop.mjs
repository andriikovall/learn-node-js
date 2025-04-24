import { readFile } from 'node:fs';

setImmediate(() => console.log('First setImmediate executed'));
Promise.resolve().then(() => console.log('Promise microtask completed'));
process.nextTick(() => console.log('nextTick callback executed'));
console.log('Main script start');

readFile(new URL(import.meta.url).pathname, () => {
  console.log('File read completed');
  setTimeout(() => console.log('Timer callback from I/O callback'));
  setImmediate(() => console.log('Immediate callback from I/O callback'));
  process.nextTick(() => console.log('nextTick from I/O callback'));
});

console.log('Main script end');
