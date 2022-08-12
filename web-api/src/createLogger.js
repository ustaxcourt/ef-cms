const colorize = require('logform/colorize');
const combine = require('logform/combine');
const errors = require('logform/errors');
const json = require('logform/json');
const printf = require('logform/printf');
const util = require('util');
const {
  config,
  createLogger: createWinstonLogger,
  format,
  transports,
} = require('winston');
const { cloneDeep, unset } = require('lodash');

exports.redact = format(logEntry => {
  const copy = cloneDeep(logEntry);
  [
    'user.token',
    'request.headers.authorization',
    'request.headers.Authorization',
  ].forEach(k => unset(copy, k));
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

  const formatters = [errors({ stack: true }), exports.redact()];

  if (process.env.NODE_ENV === 'production') {
    options.format = combine(...formatters, json());
  } else {
    options.format = combine(
      ...formatters,
      colorize(),
      printf(info => {
        const lines = exports.getMetadataLines(info);
        return [`${info.level}:\t${info.message}`, ...lines].join('\n  ');
      }),
    );
  }

  const logger = createWinstonLogger(options);

  // alias Winston's "warning" to "warn".
  logger.warn = logger.warning;
  return logger;
};

exports.getMetadataLines = info => {
  const metadata = Object.assign({}, info, {
    level: undefined,
    message: undefined,
  });
  // util.inspecting to avoid stringifying circular request/response error objects
  const stringified = util.inspect(metadata, {
    compact: false,
    maxStringLength: null,
  });
  const undefinedPropertyMatcher = /.+: undefined,*/gm;
  const stripped = stringified.replace(undefinedPropertyMatcher, '');
  const emptyObjectMatcher = /{\s*}/gm;
  if (stripped.match(emptyObjectMatcher)) {
    return [];
  }
  return stripped.trim().split('\n');
};
