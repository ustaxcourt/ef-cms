const joi = require('joi-browser');

// if repeatedly using the same rules to validate how an input should be formatted, capture it here.
exports.JoiValidationConstants = {
  TWENTYFOUR_HOUR_MINUTES: joi
    .string()
    .regex(/^(([0-1][0-9])|([2][0-3])):([0-5][0-9])$/),
  US_POSTAL_CODE: joi.string().regex(/^(\d{5}|\d{5}-\d{4})$/),
};
