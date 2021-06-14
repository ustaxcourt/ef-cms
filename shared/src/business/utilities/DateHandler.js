const moment = require('moment-timezone');
const momentPackage = require('moment');

const FORMATS = {
  DATE_TIME: 'MM/DD/YY hh:mm a',
  DATE_TIME_TZ: 'MM/DD/YY h:mm a [ET]',
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  MMDDYY: 'MM/DD/YY',
  MMDDYYYY: 'MM/DD/YYYY',
  MONTH_DAY_YEAR: 'MMMM D, YYYY',
  MONTH_DAY_YEAR_WITH_DAY_OF_WEEK: 'dddd, MMMM D, YYYY',
  SORTABLE_CALENDAR: 'YYYY/MM/DD',
  TIME: 'hh:mm a',
  TIME_TZ: 'h:mm a [ET]',
  YEAR: 'YYYY',
  YYYYMMDD: 'YYYY-MM-DD',
};

const PATTERNS = {
  'H:MM': /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, // hour can be specified with either one OR two digits.
  YYYYMMDD: /^\d{4}-\d{1,2}-\d{1,2}$/,
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
  if (dateString === undefined) {
    dateString = createISODateString();
  }
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

  return result && result.toISOString();
};

const createISODateAtStartOfDayEST = dateString => {
  const startOfDay = moment.tz(dateString, undefined, USTC_TZ);
  startOfDay.startOf('day'); // adjustment is according to USTC_TZ
  return startOfDay.toISOString(); // will reflect UTC offset.
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
    FORMATS.ISO,
  );
};

/**
 * @param {string} dateString a date string like YYYY-MM-DD or an ISO date retrieved from persistence
 * @param {string} formatStr the desired formatting as specified by the moment library
 * @returns {string} a formatted date string
 */
const formatDateString = (dateString, formatStr = FORMATS.ISO) => {
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
  const simpleDateLength = 10; // e.g. YYYY-MM-DD

  if (a.length == simpleDateLength || b.length == simpleDateLength) {
    // at least one date has a simple format, compare only year, month, and day according to EST
    const dayDifference = calculateDifferenceInDays(
      createISODateString(a),
      createISODateString(b),
    );
    if (Math.abs(dayDifference) === 0) {
      return 0;
    }
  }

  const millisecondsDifferenceThreshold = 30 * 1000;

  const moment1 = prepareDateFromString(a);
  const moment2 = prepareDateFromString(b);
  const differenceInMillis = moment1.diff(moment2, 'millisecond', true);

  if (Math.abs(differenceInMillis) < millisecondsDifferenceThreshold) {
    // treat as equal time stamps
    return 0;
  }
  return differenceInMillis;
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

const getMonthDayYearObj = momentRef => {
  const momentObj = momentRef || prepareDateFromString(createISODateString());
  const result = {
    day: momentObj.format('D'),
    month: momentObj.format('M'),
    year: momentObj.format('YYYY'),
  };
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

/**
 * properly casts a variety of inputs to a UTC ISOString
 * directly using the moment library to inspect the formatting of the input
 * before sending to application context functions to be transformed
 *
 * @param {object} applicationContext the application context
 * @param {string} dateString the date string to cast to an ISO string
 * @returns {string} the ISO string.
 */
const castToISO = dateString => {
  if (dateString === '') {
    return null;
  }

  const formatDate = ds => createISODateString(ds, FORMATS.YYYYMMDD);

  dateString = dateString
    .split('-')
    .map(segment => segment.padStart(2, '0'))
    .join('-');
  if (
    momentPackage.utc(`${dateString}-01-01`, FORMATS.YYYYMMDD, true).isValid()
  ) {
    return formatDate(`${dateString}-01-01`);
  } else if (momentPackage.utc(dateString, FORMATS.YYYYMMDD, true).isValid()) {
    return formatDate(dateString);
  } else if (isStringISOFormatted(dateString)) {
    return dateString;
  } else {
    return '-1';
  }
};

/**
 * checks if the new date contains all expected parts and returns date as an
 * ISO string; otherwise, it returns null
 *
 * @param {object} applicationContext the application context*
 * @param {string} updatedDateString the new date string to verify
 * @returns {string} the updatedDateString if everything is correct.
 */
const checkDate = updatedDateString => {
  const hasAllDateParts = /.+-.+-.+/;
  let result = null;

  // use unique characters in "undefined" ⬇
  if (updatedDateString.replace(/[-,undefi]/g, '') === '') {
    result = null;
  } else if (dateHasText(updatedDateString)) {
    result = '-1';
  } else if (
    !updatedDateString.includes('undefined') &&
    hasAllDateParts.test(updatedDateString)
  ) {
    result = castToISO(updatedDateString);
  }
  return result;
};

const dateHasText = updatedDateString => {
  const letterMatcher = /[0-9]+$/;
  const dateParts = updatedDateString.split('-');
  return (
    !letterMatcher.test(dateParts[0]) ||
    !letterMatcher.test(dateParts[1]) ||
    !letterMatcher.test(dateParts[2])
  );
};

/**
 * Attempts to format separate date components provided into a string
 * like YYYY-MM-DD, e.g. 2021-01-20 if any of day, month, or year are defined
 * otherwise, will return null.
 *
 * @param {object} deconstructed date object
 * @param {string} deconstructed.day two-digit calendar day
 * @param {string} deconstructed.month two-digit calendar month
 * @param {string} deconstructed.year four-digit calendar year
 * @returns {string} a date formatted as YYYY-MM-DD
 */
const computeDate = ({ day, month, year }) => {
  const inputProvided = day || month || year;
  if (!inputProvided) {
    return null;
  }
  const yyyyPadded = `${year}`.padStart(4, '0');
  const mmPadded = `${month}`.padStart(2, '0');
  const ddPadded = `${day}`.padStart(2, '0');
  const dateToParse = `${yyyyPadded}-${mmPadded}-${ddPadded}`;
  if (!PATTERNS.YYYYMMDD.test(dateToParse)) {
    return undefined;
  }
  return prepareDateFromString(dateToParse, FORMATS.ISO).toISOString();
};

/**
 * Formats date object into ISO string only if date is valid
 *
 * @param {object} date the date object containing year, month, day
 * @returns {string} a formatted ISO date string if date object is valid
 */
const validateDateAndCreateISO = date => {
  if (isValidDateString(`${date.month}-${date.day}-${date.year}`)) {
    return createISODateStringFromObject({
      day: date.day,
      month: date.month,
      year: date.year,
    });
  }
};

module.exports = {
  FORMATS,
  PATTERNS,
  calculateDifferenceInDays,
  calculateISODate,
  castToISO,
  checkDate,
  computeDate,
  createEndOfDayISO,
  createISODateAtStartOfDayEST,
  createISODateString,
  createISODateStringFromObject,
  createStartOfDayISO,
  dateStringsCompared,
  deconstructDate,
  formatDateString,
  formatNow,
  getMonthDayYearObj,
  isStringISOFormatted,
  isValidDateString,
  prepareDateFromString,
  validateDateAndCreateISO,
};
