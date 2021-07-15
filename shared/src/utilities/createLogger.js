const colorize = require('logform/colorize');
const combine = require('logform/combine');
const errors = require('logform/errors');
const json = require('logform/json');
const printf = require('logform/printf');
const {
  config,
  createLogger: createWinstonLogger,
  format,
  transports,
} = require('winston');
const { cloneDeep, unset } = require('lodash');

const redact = format(logEntry => {
  const copy = cloneDeep(logEntry);
  ['user.token', 'request.headers.authorization'].forEach(k => unset(copy, k));
  return copy;
});

exports.createLogger = (opts = {}) => {
  const options = {
    defaultMeta: {},
    level: opts.logLevel || process.env.LOG_LEVEL || 'debug',
    levels: config.syslog.levels,
    transports: [new transports.Console()],
    ...opts,
  };

  const formatters = [errors({ stack: true }), redact()];

  if (process.env.NODE_ENV === 'production') {
    options.format = combine(...formatters, json());
  } else {
    options.format = combine(
      ...formatters,
      colorize(),
      printf(info => {
        const metadata = Object.assign({}, info, {
          level: undefined,
          message: undefined,
        });

        const stringified = JSON.stringify(metadata, null, 2);
        const lines = stringified === '{}' ? [] : stringified.split('\n');

        return [`${info.level}:\t${info.message}`, ...lines].join('\n  ');
      }),
    );
  }

  return createWinstonLogger(options);
};
