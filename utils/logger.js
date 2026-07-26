// utils/logger.js
const path = require("path");

function getCallerFileName() {
  const originalPrepareStackTrace = Error.prepareStackTrace;
  let callerFile;

  try {
    const err = new Error();
    Error.prepareStackTrace = (err, stack) => stack;
    const currentFile = err.stack.shift().getFileName();

    while (err.stack.length) {
      callerFile = err.stack.shift().getFileName();
      if (currentFile !== callerFile) break;
    }
  } catch (e) {
    callerFile = "Unknown File";
  } finally {
    Error.prepareStackTrace = originalPrepareStackTrace;
  }

  return callerFile ? path.basename(callerFile) : "Unknown File";
}

const logger = {
  info: (...args) => {
    const fileName = getCallerFileName();
    console.log(`Log From ${fileName} data is :`, ...args);
  },
  error: (...args) => {
    const fileName = getCallerFileName();
    console.error(`Log From ${fileName} data is :`, ...args);
  },
  warn: (...args) => {
    const fileName = getCallerFileName();
    console.warn(`Log From ${fileName} data is :`, ...args);
  },
};

module.exports = logger;
