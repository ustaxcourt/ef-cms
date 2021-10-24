const deepFreeze = require('deep-freeze');
const joi = require('joi').extend(require('@hapi/joi-date'));

const {
  CURRENT_YEAR,
  DOCKET_NUMBER_MATCHER,
  MAX_FILE_SIZE_BYTES,
} = require('./EntityConstants');

const DATE_FORMATS = {
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  YYYYMMDD: 'YYYY-MM-DD',
};

// if repeatedly using the same rules to validate how an input should be formatted, capture it here.
const STRING = joi.string().min(1);
exports.JoiValidationConstants = deepFreeze({
  CASE_CAPTION: STRING.max(4700),
  DATE: joi.date().iso().format([DATE_FORMATS.YYYYMMDD]),
  DOCKET_NUMBER: STRING.regex(DOCKET_NUMBER_MATCHER),
  DOCKET_RECORD: joi
    .array()
    .unique(
      (a, b) =>
        a.index !== undefined && b.index !== undefined && a.index === b.index,
    ),
  DOCUMENT_TITLE: STRING.max(3000),
  EMAIL: STRING.email({ tlds: false }).max(100),
  ISO_DATE: joi.date().iso().format([DATE_FORMATS.ISO]),
  MAX_FILE_SIZE_BYTES: joi.number().integer().min(1).max(MAX_FILE_SIZE_BYTES),
  STRING,
  TWENTYFOUR_HOUR_MINUTES: STRING.regex(
    /^(([0-1][0-9])|([2][0-3])):([0-5][0-9])$/,
  ),
  US_POSTAL_CODE: STRING.regex(/^(\d{5}|\d{5}-\d{4})$/),
  UUID: STRING.uuid({
    version: ['uuidv4'],
  }),
  YEAR_MAX_CURRENT: joi.number().integer().min(1900).max(CURRENT_YEAR),
});
