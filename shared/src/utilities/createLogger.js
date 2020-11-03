const combine = require('logform/combine');
const json = require('logform/json');
const printf = require('logform/printf');
const timestamp = require('logform/timestamp');
const {
  createLogger: createWinstonLogger,
  format,
  transports,
} = require('winston');
const { cloneDeep, unset } = require('lodash');

const redact = format(logEntry => {
  const copy = cloneDeep(logEntry);
  ['token', 'headers.authorization'].forEach(k => unset(copy, k));
  return copy;
});

const nonProductionFormatters = [
  combine(
    timestamp(),
    printf(
      info =>
        `${info.timestamp} ${info.level}: ${info.message} ${JSON.stringify(
          info,
          null,
          2,
        )}`,
    ),
  ),
];

exports.createLogger = defaultMeta =>
  createWinstonLogger({
    defaultMeta,
    format: combine(
      redact(),
      ...(process.env.NODE_ENV === 'production'
        ? [json()]
        : nonProductionFormatters),
    ),
    level: process.env.LOG_LEVEL || 'debug',
    transports: [new transports.Console()],
  });
