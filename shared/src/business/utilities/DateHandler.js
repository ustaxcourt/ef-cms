const moment = require('moment-timezone');

const FORMATS = {
  DATE_TIME: 'MM/DD/YY hh:mm a',
  DATE_TIME_TZ: 'MM/DD/YY h:mm a [ET]',
  MMDDYY: 'MM/DD/YY',
  MMDDYYYY: 'MM/DD/YYYY',
  MONTH_DAY_YEAR: 'MMMM D, YYYY',
  TIME: 'hh:mm a',
  TIME_TZ: 'h:mm a [ET]',
  YEAR: 'YYYY',
};

const USTC_TZ = 'America/New_York';

const isStringISOFormatted = dateString => {
  return moment.utc(dateString, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true).isValid();
};

/**
 *
 * @param {string} dateString a string representing a date
 * @param {string} inputFormat optional parameter containing hints on how to parse dateString
 * @returns {moment} a moment-timezone object
 */
const prepareDateFromString = (dateString, inputFormat) => {
  return moment.tz(dateString, inputFormat, USTC_TZ);
};

/**
 * @param {string} dateString a date string to be sent to persistence
 * @param {string} inputFormat optional parameter containing hints on how to parse dateString
 * @returns {string} a formatted ISO date string
 */
const createISODateString = (dateString, inputFormat) => {
  let result;
  if (!dateString) {
    result = moment();
  } else {
    result = prepareDateFromString(dateString, inputFormat);
  }

  return result.toISOString();
};

/**
 * @param {string} dateString a date string like YYYY-MM-DD or an ISO date retrieved from persistence
 * @param {string} formatStr the desired formatting as specified by the moment library
 * @returns {string} a formatted date string
 */
const formatDateString = (dateString, formatStr) => {
  if (!dateString) return;
  let formatString = FORMATS[formatStr] || formatStr;
  return prepareDateFromString(dateString).format(formatString);
};

const formatNow = formatStr => {
  const now = module.exports.createISODateString();
  return module.exports.formatDateString(now, formatStr);
};

module.exports = {
  FORMATS,
  createISODateString,
  formatDateString,
  formatNow,
  isStringISOFormatted,
  prepareDateFromString,
};
