import winston from 'winston'
import expressWinston from 'express-winston'
import config from './../config/config'

export const requestLogger = expressWinston.logger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        })
    ]
});

let files = {transports: []};
config.logger.files.forEach((definition) => {
    const transport = new (winston.transports.File)(definition);
    files.transports.push(transport)
});

export const errorLogger = expressWinston.errorLogger(files);