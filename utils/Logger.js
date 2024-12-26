const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.File({ level: 'error' , filename: 'logs/error.log',  }),
      new winston.transports.File({ level: 'info'  , filename: 'logs/combinedlog.log' , })
    ]
  });

  module.exports = logger;