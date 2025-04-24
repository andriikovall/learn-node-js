import { SystemMonitor } from "./system-monitor.js";
import { Logger } from "./logger.js";

const logger = new Logger();

SystemMonitor.addListener('info', (str) => logger.log(str));

SystemMonitor.start();

process.on("beforeExit", () => {
  logger.dispose();
});
