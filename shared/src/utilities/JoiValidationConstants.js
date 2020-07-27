const joi = require('joi').extend(require('@hapi/joi-date'));
const {
  DOCKET_NUMBER_MATCHER,
  MAX_FILE_SIZE_BYTES,
} = require('../business/entities/EntityConstants');
const { FORMATS } = require('../business/utilities/DateHandler');
// if repeatedly using the same rules to validate how an input should be formatted, capture it here.
exports.JoiValidationConstants = {
  CASE_CAPTION: joi.string().max(4700),
  DOCKET_NUMBER: joi.string().regex(DOCKET_NUMBER_MATCHER),
  DOCUMENT_TITLE: joi.string().max(3000),
  EMAIL: joi.string().email({ tlds: false }).max(100),
  // eslint-disable-next-line spellcheck/spell-checker
  // TODO: remove FORMATS.YYYYMMDD from valid timestamp formats after devex task
  ISO_DATE: joi.date().iso().format([FORMATS.ISO, FORMATS.YYYYMMDD]),
  MAX_FILE_SIZE_BYTES: joi.number().integer().min(1).max(MAX_FILE_SIZE_BYTES),
  TWENTYFOUR_HOUR_MINUTES: joi
    .string()
    .regex(/^(([0-1][0-9])|([2][0-3])):([0-5][0-9])$/),
  US_POSTAL_CODE: joi.string().regex(/^(\d{5}|\d{5}-\d{4})$/),
  UUID: joi.string().uuid({
    version: ['uuidv4'],
  }),
};
