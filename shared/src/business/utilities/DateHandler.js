const moment = require('moment-timezone');

const FORMATS = {
  DATE_TIME: 'MM/DD/YY hh:mm a',
  DATE_TIME_TZ: 'MM/DD/YY h:mm a [ET]',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  MMDDYY: 'MM/DD/YY',
  MMDDYYYY: 'MM/DD/YYYY',
  MONTH_DAY_YEAR: 'MMMM D, YYYY',
  SORTABLE_CALENDAR: 'YYYY/MM/DD',
  TIME: 'hh:mm a',
  TIME_TZ: 'h:mm a [ET]',
  YEAR: 'YYYY',
  YYYYMMDD: 'YYYY-MM-DD',
};

const PATTERNS = {
  'H:MM': /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, // hour can be specified with either one OR two digits.
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

  return prepareDateFromString(dateString || createISODateString(), FORMATS.ISO)
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
    result = moment.tz(USTC_TZ);
  } else {
    result = prepareDateFromString(dateString, inputFormat);
  }

  return result.toISOString();
};

const createEndOfDayISO = ({ day, month, year }) => {
  const composedDate = `${year}-${month}-${day}T23:59:59.999`;
  const composedFormat = 'YYYY-M-DTHH:mm:ss.SSS';
  return prepareDateFromString(composedDate, composedFormat).toISOString();
};

const createStartOfDayISO = ({ day, month, year }) => {
  const composedDate = `${year}-${month}-${day}T00:00:00.000`;
  const composedFormat = 'YYYY-M-DTHH:mm:ss.SSS';
  return prepareDateFromString(composedDate, composedFormat).toISOString();
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
  /*
  Using `module.exports` to allow mocking in tests
  */
  const now = module.exports.createISODateString();
  return formatDateString(now, formatStr);
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
 * @param {string} a the first date to be compared
 * @param {string} b the second date to be compared
 * @returns {number} -1 if date a is larger, 1 if date b is larger, 0 if dates are equal
 */
const calendarDatesCompared = (a, b) => {
  const aFormatEst = formatDateString(a, FORMATS.SORTABLE_CALENDAR);
  const bFormatEst = formatDateString(b, FORMATS.SORTABLE_CALENDAR);

  if (aFormatEst < bFormatEst) {
    return -1;
  } else if (aFormatEst > bFormatEst) {
    return 1;
  } else {
    return 0;
  }
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

/**
 * Calculates the difference in calendar days between timeStamp1 and timeStamp2
 * When timeStamp1 is greater (more recent) than timeStamp2, the difference
 * will be positive. Time-stamps occurring on the same day will yield zero.
 * If timeStamp2 is greater than timeStamp1, the result will be negative.
 *
 * @param {string} timeStamp1 an ISO-8601 date string
 * @param {string} timeStamp2 an ISO-8601 date string
 * @returns {number} the difference between two days, rounded to the nearest integer
 */
const calculateDifferenceInDays = (timeStamp1, timeStamp2) => {
  const moment1 = prepareDateFromString(timeStamp1).set({
    hours: 12,
  });
  const moment2 = prepareDateFromString(timeStamp2).set({
    hours: 12,
  });
  const differenceInDays = Math.round(moment1.diff(moment2, 'day', true));
  return differenceInDays;
};

module.exports = {
  FORMATS,
  PATTERNS,
  calculateDifferenceInDays,
  calculateISODate,
  calendarDatesCompared,
  createEndOfDayISO,
  createISODateString,
  createISODateStringFromObject,
  createStartOfDayISO,
  dateStringsCompared,
  deconstructDate,
  formatDateString,
  formatNow,
  isStringISOFormatted,
  isValidDateString,
  prepareDateFromString,
};
