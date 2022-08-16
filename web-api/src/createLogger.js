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
const { cloneDeep, isEqual, unset } = require('lodash');

exports.redact = format(logEntry => {
  const copy = cloneDeep(logEntry);
  [
    'user.token',
    'request.headers.authorization',
    'request.headers.Authorization',
  ].forEach(k => unset(copy, k));
  return copy;
});

exports.removeDuplicateLogInformation = format(logEntry => {
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

exports.formatMetadata = format(logEntry => {
  const rootFields = [
    'authorizer',
    'environment',
    'level',
    'logGroup',
    'logStream',
    'message',
    'metadata',
    'protectedRequiredFields',
    'request',
    'requestId',
    'response',
    'timestamp',
    'user',
  ];
  let leftovers = cloneDeep(logEntry);
  rootFields.forEach(k => unset(leftovers, k));

  const metadata =
    'metadata' in logEntry
      ? {
          ...leftovers,
          ...logEntry.metadata,
        }
      : leftovers;

  let formattedLogEntry = cloneDeep(logEntry);
  [...Object.keys(metadata), 'metadata', 'protectedRequiredFields'].forEach(k =>
    unset(formattedLogEntry, k),
  );
  formattedLogEntry.metadata = metadata;

  if ('protectedRequiredFields' in logEntry) {
    formattedLogEntry = {
      ...formattedLogEntry,
      ...logEntry.protectedRequiredFields,
      context: {},
    };
  }

  for (const key of Object.keys(logEntry)) {
    if (
      !(key in formattedLogEntry) ||
      formattedLogEntry[key] !== logEntry[key]
    ) {
      formattedLogEntry.context[key] = logEntry[key];
    }
  }

  return formattedLogEntry;
});

exports.createLogger = (opts = {}) => {
  const options = {
    defaultMeta: {},
    level: opts.logLevel || process.env.LOG_LEVEL || 'debug',
    levels: config.syslog.levels,
    transports: [new transports.Console()],
    ...opts,
  };

  const formatters = [
    errors({ stack: true }),
    exports.redact(),
    // exports.formatMetadata(),
    exports.removeDuplicateLogInformation(),
  ];

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
