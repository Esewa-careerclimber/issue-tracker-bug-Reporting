const timestamp = () => `[${new Date().toISOString()}]`;

export function log(message) {
  console.log(`${timestamp()} ${message}`);
}

const logger = {
  info: (message) => console.log(`${timestamp()} [INFO] ${message}`),
  warn: (message) => console.warn(`${timestamp()} [WARN] ${message}`),
  error: (message) => console.error(`${timestamp()} [ERROR] ${message}`),
  log: (message) => console.log(`${timestamp()} ${message}`)
};

export default logger;