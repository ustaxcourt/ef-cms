const joi = require('@hapi/joi').extend(require('@hapi/joi-date'));
const { FORMATS } = require('../business/utilities/DateHandler');

exports.getTimestampSchema = () => {
  // eslint-disable-next-line spellcheck/spell-checker
  // TODO: remove FORMATS.YYYYMMDD from valid timestamp formats after devex task
  return joi.date().iso().format(FORMATS.ISO, FORMATS.YYYYMMDD);
};
