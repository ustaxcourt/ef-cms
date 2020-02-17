const moment = require('moment-timezone');

const FORMATS = {
  DATE_TIME: 'MM/DD/YY hh:mm a',
  DATE_TIME_TZ: 'MM/DD/YY h:mm a [ET]',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  MMDDYY: 'MM/DD/YY',
  MMDDYYYY: 'MM/DD/YYYY',
  MONTH_DAY_YEAR: 'MMMM D, YYYY',
  TIME: 'hh:mm a',
  TIME_TZ: 'h:mm a [ET]',
  YEAR: 'YYYY',
};

const USTC_TZ = 'America/New_York';

const isStringISOFormatted = dateString => {
  return moment.utc(dateString, FORMATS.ISO, true).isValid();
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

const calculateISODate = ({ dateString, howMuch = 0, units = 'days' }) => {
  if (!howMuch) return dateString;

  return prepareDateFromString(dateString, FORMATS.ISO)
    .add(howMuch, units)
    .toISOString();
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
 * @param {object} options the date options containing year, month, day
 * @returns {string} a formatted ISO date string
 */
const createISODateStringFromObject = options => {
  return createISODateString(
    `${options.year}-${options.month}-${options.day}`,
    'YYYY-MM-DD',
  );
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

/**
 * @param {string} a the first date to be compared
 * @param {string} b the second date to be compared
 * @returns {number} difference between date a and date b
 */
const dateStringsCompared = (a, b) => {
  const simpleDatePattern = /^(\d{4}-\d{2}-\d{2})/;
  const simpleDateLength = 10; // e.g. YYYY-MM-DD

  if (a.length == simpleDateLength || b.length == simpleDateLength) {
    // at least one date has a simple format, compare only year, month, and day
    const [aSimple, bSimple] = [
      a.match(simpleDatePattern)[0],
      b.match(simpleDatePattern)[0],
    ];
    if (aSimple.localeCompare(bSimple) == 0) {
      return 0;
    }
  }

  const secondsDifference = 30 * 1000;
  const aDate = new Date(a);
  const bDate = new Date(b);
  if (Math.abs(aDate - bDate) < secondsDifference) {
    // treat as equal time stamps
    return 0;
  }
  return aDate - bDate;
};

/**
 * @param {string} dateString date to be deconstructed
 * @returns {object} deconstructed date object
 */
const deconstructDate = dateString => {
  const momentObj = dateString && prepareDateFromString(dateString);
  let result;
  if (momentObj && momentObj.toDate() instanceof Date && momentObj.isValid()) {
    result = {
      day: momentObj.format('D'),
      month: momentObj.format('M'),
      year: momentObj.format('YYYY'),
    };
  }
  return result;
};

/**
 * @param {string} dateString the date string
 * @param {string} formats the format to check against
 * @returns {boolean} if the date string is valid
 */
const isValidDateString = (dateString, formats = ['M-D-YYYY', 'M/D/YYYY']) => {
  return moment(dateString, formats, true).isValid();
};

module.exports = {
  FORMATS,
  calculateISODate,
  createISODateString,
  createISODateStringFromObject,
  dateStringsCompared,
  deconstructDate,
  formatDateString,
  formatNow,
  isStringISOFormatted,
  isValidDateString,
  prepareDateFromString,
};
