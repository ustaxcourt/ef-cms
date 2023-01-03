const fedHolidays = require('@18f/us-federal-holidays');
const { DateTime } = require('luxon');

const FORMATS = {
  DATE_TIME: 'MM/dd/yy hh:mm a',
  DATE_TIME_TZ: "MM/dd/yy h:mm a 'ET'",
  DAY_OF_WEEK: 'c',
  FILENAME_DATE: 'MMMM_d_yyyy',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSZZ",
  LOG_TIMESTAMP: "yyyy/MM/dd HH:mm:ss.SSS 'ET'",
  MMDDYY: 'MM/dd/yy',
  MMDDYYYY: 'MM/dd/yyyy',
  MMDDYYYY_DASHED: 'MM-dd-yyyy',
  MONTH_DAY_YEAR: 'MMMM d, yyyy',
  MONTH_DAY_YEAR_WITH_DAY_OF_WEEK: 'DDDD',
  SHORT_MONTH_DAY_YEAR: 'MMM d, yyyy',
  SORTABLE_CALENDAR: 'yyyy/MM/dd',
  TIME: 'hh:mm a',
  TIME_TZ: "h:mm a 'ET'",
  TRIAL_SORT_TAG: 'yyyyMMddHHmmss',
  TRIAL_TIME: 'yyyy-MM-dd H:mm',
  YEAR: 'yyyy',
  YEAR_TWO_DIGIT: 'yy',
  YYYYMM: 'yyyy-MM',
  YYYYMMDD: 'yyyy-MM-dd',
  YYYYMMDD_NUMERIC: 'yyyyMMdd',
};

const PATTERNS = {
  'H:MM': /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, // hour can be specified with either one OR two digits.
  YYYYMMDD: /^\d{4}-\d{1,2}-\d{1,2}$/,
};

const USTC_TZ = 'America/New_York';

const isStringISOFormatted = dateString => {
  return DateTime.fromISO(dateString).isValid;
};

/**
 * convert a given date or time provided in Eastern Time to a GMT luxon object
 *
 * @param {string} dateString a string representing a date/time in EST
 * @param {string} inputFormat the format matching the incoming dateString
 * @returns {string} an ISO-8601 timestamp with GMT+0
 */
const prepareDateFromEST = (dateString, inputFormat) => {
  const result = DateTime.fromFormat(dateString, inputFormat, {
    zone: USTC_TZ,
  })
    .setZone(0)
    .toISO();

  return result;
};

/**
 * combines a ISO-formatted date stamp in UTC with a HH:mm time string in EST
 *
 * @param {string} dateString ISO-formatted date stamp in UT
 * @param {string} timeString a HH:mm time string in EST
 * @returns {string} an ISO-8601 timestamp with GMT+0
 */
const combineISOandEasternTime = (dateString, timeString) => {
  const [hour, minute] = timeString.split(':');
  const result = DateTime.fromISO(dateString, {
    zone: USTC_TZ,
  })
    .set({ hour, minute })
    .setZone('utc')
    .toISO();

  return result;
};

/**
 *
 * @param {string} dateString a string representing a date
 * @param {string} inputFormat optional parameter containing hints on how to parse dateString
 * @returns {luxon} a luxon object
 */
const prepareDateFromString = (dateString, inputFormat) => {
  if (dateString === undefined) {
    dateString = createISODateString();
  }
  let result;

  if (inputFormat === FORMATS.ISO) {
    result = DateTime.fromISO(dateString, { zone: 0 });
  } else if (inputFormat) {
    result = DateTime.fromFormat(dateString, inputFormat, {
      zone: USTC_TZ,
    }).setZone('utc');
  } else {
    result = DateTime.fromISO(dateString, {
      zone: USTC_TZ,
    }).setZone('utc');
  }
  result.toISOString = () => result.toISO();
  result.isSame = (a, b) => result.hasSame(a, b);
  result.isBefore = (b, unit) => {
    if (!b && !unit) {
      const now = DateTime.now();
      return result < now;
    }
    return result.startOf(unit) < b.startOf(unit);
  };
  result.setDateForISO = args => {
    const updatedDate = result.set(args);
    return updatedDate.toISO();
  };
  return result;
};

const calculateISODate = ({ dateString, howMuch = 0, units = 'days' }) => {
  if (!howMuch) return dateString;

  return prepareDateFromString(dateString)
    .plus({ [units]: howMuch })
    .toISO();
};

/**
 * @param {string?} dateString a date string to be sent to persistence
 * @param {string?} inputFormat optional parameter containing hints on how to parse dateString
 * @returns {string} a formatted ISO date string
 */
const createISODateString = (dateString, inputFormat) => {
  let result;

  if (!dateString) {
    result = DateTime.now().setZone(USTC_TZ);
  } else {
    result = prepareDateFromString(dateString, inputFormat);
  }

  return result && result.setZone('utc').toISO();
};

/**
 * createISODateAtStartOfDayEST
 *
 * @param {string} dateString a date string to be updated to ISO in USTC_TZ (ET)
 * @returns {string} the ISO formatted date set at midnight of today USTC_TZ (ET)
 */
const createISODateAtStartOfDayEST = dateString => {
  const dtObj = dateString
    ? DateTime.fromISO(dateString, { zone: USTC_TZ })
    : DateTime.now().setZone(USTC_TZ);

  const iso = dtObj.startOf('day').setZone('utc').toISO();

  return iso;
};

/**
 * createDateAtStartOfWeekEST
 *
 * @param {string} dateString a date string to be updated to given format in USTC_TZ (ET)
 * @returns {string} the formatted date set at midnight of first Monday of
 *                   given week USTC_TZ (ET)
 */
const createDateAtStartOfWeekEST = (dateString, format) => {
  const dtObj = dateString
    ? DateTime.fromISO(dateString, { zone: USTC_TZ })
    : DateTime.now().setZone(USTC_TZ);

  const dateOutput = dtObj
    .startOf('week')
    .startOf('day')
    .setZone('utc')
    .toFormat(format);

  return dateOutput;
};

const createEndOfDayISO = ({ day, month, year }) => {
  return DateTime.fromObject({ day, month, year }, { zone: USTC_TZ })
    .set({ hour: 23, millisecond: 999, minute: 59, second: 59 })
    .setZone('utc')
    .toISO();
};

const createStartOfDayISO = ({ day, month, year }) => {
  return DateTime.fromObject({ day, month, year }, { zone: USTC_TZ })
    .startOf('day')
    .setZone('utc')
    .toISO();
};

/**
 * @param {object} options the date options containing year, month, day
 * @returns {string} a formatted ISO date string
 */
const createISODateStringFromObject = options => {
  return DateTime.fromObject(options, { zone: USTC_TZ }).setZone('utc').toISO();
};

/**
 * @param {string} dateString a date string like YYYY-MM-DD or an ISO date retrieved from persistence
 * @param {string} formatArg the desired formatting as specified by the luxon library
 * @returns {string|void} a formatted date string
 */
const formatDateString = (dateString, formatArg = FORMATS.ISO) => {
  if (!dateString) return;
  let formatString = FORMATS[formatArg] || formatArg;

  if (!Object.values(FORMATS).includes(formatString)) {
    throw new Error(`Must use a formatting constant: "${formatString}"`); // TODO: test coverage
  }

  let result = prepareDateFromString(dateString)
    .setZone(USTC_TZ)
    .toFormat(formatString);

  const formatWithAMPM = [
    FORMATS.DATE_TIME,
    FORMATS.DATE_TIME_TZ,
    FORMATS.TIME,
    FORMATS.TIME_TZ,
  ];

  if (formatWithAMPM.includes(formatString)) {
    result = result.replace(/AM/, 'am');
    result = result.replace(/PM/, 'pm');
  }

  return result;
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

  const dt1 = prepareDateFromString(a);
  const dt2 = prepareDateFromString(b);
  const differenceInMillis = dt1.diff(dt2, 'millisecond').milliseconds;

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
  if (PATTERNS.YYYYMMDD.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number).map(String);
    return { day, month, year };
  }
  const dtObj = DateTime.fromISO(dateString, { zone: 'utc' }).setZone(USTC_TZ);
  let result;
  if (dtObj && dtObj.toJSDate() instanceof Date && dtObj.isValid) {
    result = {
      day: dtObj.toFormat('d'),
      month: dtObj.toFormat('M'),
      year: dtObj.toFormat(FORMATS.YEAR),
    };
  }
  return result;
};

/**
 * Creates an object representing the current calendar day
 * according to USTC_TZ timezone
 *
 * @returns {object} with date, month, and year
 */
const getMonthDayYearInETObj = () => {
  const dtObj = DateTime.now().setZone(USTC_TZ);
  const result = {
    day: dtObj.toFormat('d'),
    month: dtObj.toFormat('M'),
    year: dtObj.toFormat(FORMATS.YEAR),
  };
  return result;
};

/**
 * @param {string} dateString the date string
 * @param {string} formats the format to check against
 * @returns {boolean} if the date string is valid
 */
const isValidDateString = (
  dateString,
  formats = ['MM-dd-yyyy', 'MM/dd/yyyy', 'M-d-yyyy', 'M/d/yyyy'],
) => {
  if (Array.isArray(formats)) {
    return formats.some(format => {
      return DateTime.fromFormat(dateString, format).isValid;
    });
  }

  return DateTime.fromFormat(dateString, formats).isValid;
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
  const dt1 = DateTime.fromISO(timeStamp1, { zone: USTC_TZ })
    .set({
      hours: 12,
    })
    .setZone('utc');

  const dt2 = DateTime.fromISO(timeStamp2, { zone: USTC_TZ })
    .set({
      hours: 12,
    })
    .setZone('utc');

  const differenceInDays = Math.round(dt1.diff(dt2, 'days').days);
  return differenceInDays;
};

/**
 * properly casts a variety of inputs to a UTC ISOString
 * directly using the luxon library to inspect the formatting of the input
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

  dateString = dateString
    .split('-')
    .map(segment => segment.padStart(2, '0'))
    .join('-');
  if (DateTime.fromFormat(`${dateString}-01-01`, 'yyyy-MM-dd').isValid) {
    return DateTime.fromFormat(`${dateString}-01-01`, 'yyyy-MM-dd', {
      zone: USTC_TZ,
    })
      .setZone('utc')
      .toISO();
  } else if (DateTime.fromISO(dateString).isValid) {
    return DateTime.fromISO(dateString, { zone: USTC_TZ })
      .setZone('utc')
      .toISO();
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
  return DateTime.fromISO(dateToParse, { zone: USTC_TZ })
    .setZone('utc')
    .toISO();
};

/**
 * Formats date object into ISO string only if date is valid
 *
 * @param {object} date the date object containing year, month, day
 * @returns {string|void} a formatted ISO date string if date object is valid
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

/**
 * Subtracts a specified amount of time from passed in ISO date
 *
 * @param {string} date the ISO date
 * @param {object} dateConfig time
 * @returns {string} a formatted ISO date string if date object is valid
 */
const subtractISODates = (date, dateConfig) => {
  return DateTime.fromISO(date).minus(dateConfig).setZone('UTC').toISO();
};

/**
 * Returns startDate plus n numberOfDays
 * but if the return date results on a Saturday, Sunday, or Federal holiday,
 * it will be moved forward to the next business day
 *
 * @param {string} startDate the date to add days to
 * @param {number} numberOfDays number of days to add to startDate
 * @returns {string} a formatted MONTH_DAY_YEAR string if date object is valid
 */
const getBusinessDateInFuture = ({
  numberOfDays,
  startDate,
  units = 'days',
}) => {
  let laterDate = prepareDateFromString(startDate).plus({
    [units]: numberOfDays,
  });

  let isAHoliday = fedHolidays.isAHoliday(
    laterDate.toFormat(FORMATS.MONTH_DAY_YEAR),
  );

  let dayOfWeek = laterDate.toFormat(FORMATS.DAY_OF_WEEK);
  const saturday = '6';
  const sunday = '7';

  let isAWeekend = dayOfWeek === saturday || dayOfWeek === sunday;

  while (isAHoliday || isAWeekend) {
    laterDate = laterDate.plus({ days: 1 });
    dayOfWeek = laterDate.toFormat(FORMATS.DAY_OF_WEEK);
    isAWeekend = dayOfWeek === saturday || dayOfWeek === sunday;

    isAHoliday = fedHolidays.isAHoliday(
      laterDate.toFormat(FORMATS.MONTH_DAY_YEAR),
    );
  }

  return laterDate.toFormat(FORMATS.MONTH_DAY_YEAR);
};

module.exports = {
  FORMATS,
  PATTERNS,
  calculateDifferenceInDays,
  calculateISODate,
  castToISO,
  checkDate,
  combineISOandEasternTime,
  computeDate,
  createDateAtStartOfWeekEST,
  createEndOfDayISO,
  createISODateAtStartOfDayEST,
  createISODateString,
  createISODateStringFromObject,
  createStartOfDayISO,
  dateStringsCompared,
  deconstructDate,
  formatDateString,
  formatNow,
  getBusinessDateInFuture,
  getMonthDayYearInETObj,
  isStringISOFormatted,
  isValidDateString,
  prepareDateFromEST,
  prepareDateFromString,
  subtractISODates,
  validateDateAndCreateISO,
};
