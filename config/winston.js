const path = require('path');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const logDir = path.join(__dirname, 'logs');
const fs = require('fs');

const options = {
  file: {
    level: 'info',
    filename: `${logDir}/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const myFormat = printf(info => {
  return `[${info.timestamp}] ${info.level}: ${info.message}`;
});

const logger = createLogger({
  format: combine(
    format.combine(
      format.splat(),
      format.simple()
    ),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    myFormat
  ),
  transports: [
    new transports.Console(options.console),
    new transports.File(options.file)
  ],
  exitOnError: false
});

module.exports = logger;