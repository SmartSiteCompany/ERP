const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple()
    }),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    })
  ]
});

module.exports = {
  logError: (message, error) => {
    logger.error(`${message}: ${error.message}`, { stack: error.stack });
  },
  logInfo: (message) => {
    logger.info(message);
  }
};