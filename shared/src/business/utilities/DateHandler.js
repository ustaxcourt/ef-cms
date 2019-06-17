const moment = require('moment-timezone');

const dateFormats = {
  DATE_TIME: 'MM/DD/YY hh:mm a',
  MMDDYY: 'MM/DD/YY',
  TIME: 'hh:mm a',
};

const USTC_TZ = 'America/New_York';

/**
 *
 * @param {string} dateString a string representing a date
 * @param {string} inputFormat optional parameter containing hints on how to parse dateString
 * @returns {moment} a moment-timezone object
 */
const prepareDateFromString = (dateString, inputFormat) => {
  return moment.tz(dateString, inputFormat, USTC_TZ);
};

module.exports.prepareDateFromString = prepareDateFromString;

/**
 * @param {string} dateString a date string to be sent to persistence
 * @param {string} inputFormat
 * @returns {string} a formatted ISO date string
 */
module.exports.createISODateString = (dateString, inputFormat) => {
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
module.exports.formatDateString = (dateString, formatStr) => {
  if (!dateString) return;
  formatStr = dateFormats[formatStr] || formatStr;
  return prepareDateFromString(dateString).format(formatStr);
};
