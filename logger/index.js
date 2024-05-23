const winston = require('winston')


const logger = winston.createLogger({
    fortmat: winston.format.json(),



    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'combined.log' })
    ]
})



module.exports = logger