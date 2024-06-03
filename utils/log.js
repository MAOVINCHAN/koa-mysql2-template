const winston = require('winston');
require('winston-daily-rotate-file');
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;

// define log format.
const logFormat = printf(info => {
    let { level, label, timestamp } = info;
    timestamp = new Date(timestamp).toLocaleString();

    const obj = JSON.parse(JSON.stringify(info));
    delete obj.level;
    delete obj.label;
    delete obj.timestamp;
    let str = '';
    for (let key in obj) {
        str += `${key}=${obj[key]} `;
    }

    return `${timestamp} [${label}] ${level}: ${str}`;
});

// create Transports.
const transportsConfig = (env) => {
    const commonTransports = [];

    if (env === 'production') {
        commonTransports.push(
            new winston.transports.DailyRotateFile({
                level: 'info',
                filename: 'app-%DATE%.log',
                datePattern: 'YYYY-MM-DD-HH',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '15d',
                dirname: process.cwd() + '/logs'
            })
        )
    } else {
        commonTransports.push(
            new transports.Console({
                level: env === 'production' ? 'info' : 'debug',
            })
        )
    }

    return commonTransports;
};

module.exports = (env = process.env.NODE_ENV || 'development') => {
    return createLogger({
        level: env === 'production' ? 'warn' : 'debug',
        format: combine(label({ label: 'KOA-APP' }), timestamp(), logFormat),
        transports: transportsConfig(env),
    });
};