import { cloneDeep, isEqual, unset } from 'lodash';
import {
  config,
  createLogger as createWinstonLogger,
  format,
  transports,
} from 'winston';
import colorize from 'logform/colorize';
import combine from 'logform/combine';
import errors from 'logform/errors';
import json from 'logform/json';
import printf from 'logform/printf';
import util from 'util';

export const redact = format(logEntry => {
  const copy = cloneDeep(logEntry);
  [
    'user.token',
    'request.headers.authorization',
    'request.headers.Authorization',
  ].forEach(k => unset(copy, k));
  return copy;
});

export const removeDuplicateLogInformation = format(logEntry => {
  const copy = cloneDeep(logEntry);

  if (!copy.context) return copy;

  // check in .context to see if any of the keys contain what we already have in the root
  for (const key of Object.keys(copy.context)) {
    if (isEqual(copy[key], copy.context[key])) {
      delete copy.context[key];
    }
  }

  return copy;
});

export const createLogger = (opts = {}) => {
  const options = {
    defaultMeta: {},
    level: opts.logLevel || process.env.LOG_LEVEL || 'debug',
    levels: config.syslog.levels,
    transports: [new transports.Console()],
    ...opts,
  };

  const formatters = [
    errors({ stack: true }),
    redact(),
    removeDuplicateLogInformation(),
  ];

  if (process.env.NODE_ENV === 'production') {
    options.format = combine(...formatters, json());
  } else {
    options.format = combine(
      ...formatters,
      colorize(),
      printf(info => {
        const lines = getMetadataLines(info);
        return [`${info.level}:\t${info.message}`, ...lines].join('\n  ');
      }),
    );
  }

  const logger = createWinstonLogger(options);

  // alias Winston's "warning" to "warn".
  logger.warn = logger.warning;
  return logger;
};

export const getMetadataLines = info => {
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
