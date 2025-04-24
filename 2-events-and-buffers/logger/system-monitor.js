import EventEmitter from "node:events";
import os from "node:os";

const getSystemInfo = () => {
  const formatMemory = (bytes) =>
    `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${remainingSeconds}s`;
  };
  const formatCPUs = (cpus) => {
    return cpus
      .map(
        (cpu, index) =>
          `  CPU ${index + 1}: ${cpu.model.trim()} @ ${cpu.speed / 1000}GHz`
      )
      .join("\n");
  };

    return `
  System Information:
  ------------------
  Operating System: ${os.platform()}
  Memory:
    Free: ${formatMemory(os.freemem())}
    Total: ${formatMemory(os.totalmem())}
    Usage: ${((1 - os.freemem() / os.totalmem()) * 100).toFixed(1)}%

  CPUs:
  ${formatCPUs(os.cpus())}

  System Uptime: ${formatUptime(os.uptime())}
  `;
};

class SystemMonitorClass extends EventEmitter {
  constructor() {
    super();
  }

  #timer = null;

  start() {
    if (this.#timer) {
      return;
    }

    this.#timer = setInterval(() => {
      this.emit("info", getSystemInfo());
    }, 100);
  }

  stop() {
    if (this.#timer) {
      clearInterval(this.#timer);
    }
  }
}

export const SystemMonitor = new SystemMonitorClass();
