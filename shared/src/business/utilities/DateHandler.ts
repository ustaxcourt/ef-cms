import { DateTime, DurationLike, Interval } from 'luxon';
import fedHolidays from '@18f/us-federal-holidays';

export const FORMATS = {
  DATE_TIME: 'MM/dd/yy hh:mm a',
  DATE_TIME_TZ: "MM/dd/yy h:mm a 'ET'",
  DAY_OF_WEEK: 'c',
  FILENAME_DATE: 'MMMM_d_yyyy',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSZZ",
  LOG_TIMESTAMP: "yyyy/MM/dd HH:mm:ss.SSS 'ET'",
  MDYY: 'M/d/yy',
  MDYYYY: 'M/d/yyyy',
  MDYYYY_DASHED: 'M-d-yyyy',
  MMDDYY: 'MM/dd/yy',
  MMDDYYYY: 'MM/dd/yyyy',
  MMDDYYYY_DASHED: 'MM-dd-yyyy',
  MONTH_DAY_YEAR: 'MMMM d, yyyy',
  MONTH_DAY_YEAR_WITH_DAY_OF_WEEK: 'DDDD',
  SHORT_MONTH_DAY_YEAR: 'MMM d, yyyy',
  SORTABLE_CALENDAR: 'yyyy/MM/dd',
  TIME: 'hh:mm a',
  TIME_24_HOUR: 'HH:mm',
  TIME_TZ: "h:mm a 'ET'",
  TRIAL_SORT_TAG: 'yyyyMMddHHmmss',
  TRIAL_TIME: 'yyyy-MM-dd H:mm',
  UNIX_TIMESTAMP_SECONDS: 'X',
  WEEK: 'W',
  YEAR: 'yyyy',
  YEAR_TWO_DIGIT: 'yy',
  YYYYMM: 'yyyy-MM',
  YYYYMMDD: 'yyyy-MM-dd',
  YYYYMMDD_NUMERIC: 'yyyyMMdd',
} as const;
const FORMATS1 = Object.values(FORMATS);
export type TimeFormats = (typeof FORMATS1)[number];
export type TimeFormatNames = keyof typeof FORMATS;

export const PATTERNS = {
  'H:MM': /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, // hour can be specified with either one OR two digits.
  YYYYMMDD: /^\d{4}-\d{1,2}-\d{1,2}$/,
};

export const USTC_TZ = 'America/New_York';

export const isStringISOFormatted = dateString => {
  return DateTime.fromISO(dateString).isValid;
};

/**
 * convert a given date or time provided in Eastern Time to a GMT luxon object
 * @param {string} dateString a string representing a date/time in EST
 * @param {string} inputFormat the format matching the incoming dateString
 * @returns {string} an ISO-8601 timestamp with GMT+0
 */
export const prepareDateFromEST = (dateString, inputFormat) => {
  const result = DateTime.fromFormat(dateString, inputFormat, {
    zone: USTC_TZ,
  })
    .setZone(0)
    .toISO();

  return result;
};

/**
 * combines a ISO-formatted date stamp in UTC with a HH:mm time string in EST
 * @param {string} dateString ISO-formatted date stamp in UT
 * @param {string} timeString a HH:mm time string in EST
 * @returns {string} an ISO-8601 timestamp with GMT+0
 */
export const combineISOandEasternTime = (
  dateString: string,
  timeString: string,
): string => {
  const [hour, minute] = timeString.split(':');
  const result = DateTime.fromISO(dateString, {
    zone: USTC_TZ,
  })
    .set({ hour: Number.parseInt(hour), minute: Number.parseInt(minute) })
    .setZone('utc')
    .toISO();

  return result!;
};

/**
 *
 * @param {string} dateString a string representing a date
 * @param {string} inputFormat optional parameter containing hints on how to parse dateString
 * @returns {luxon} a luxon object
 */
export const prepareDateFromString = (
  dateString?: string,
  inputFormat?: TimeFormats,
): DateTime => {
  const dateToFormat: string = dateString || createISODateString();
  let result: DateTime;

  if (inputFormat === FORMATS.ISO) {
    result = DateTime.fromISO(dateToFormat, { zone: 'utc' });
  } else if (inputFormat) {
    result = DateTime.fromFormat(dateToFormat, inputFormat, {
      zone: USTC_TZ,
    }).setZone('utc');
  } else {
    result = DateTime.fromISO(dateToFormat, {
      zone: USTC_TZ,
    }).setZone('utc');
  }
  return result;
};

export const calculateISODate = ({
  dateString = undefined,
  howMuch = 0,
  units = 'days',
}: {
  dateString?: string;
  howMuch?: number;
  units?: string;
}): string => {
  if (!howMuch) return dateString!;

  return prepareDateFromString(dateString)
    .plus({ [units]: howMuch })
    .toISO()!;
};

/**
 * @param {string?} dateString a date string to be sent to persistence
 * @param {string?} inputFormat optional parameter containing hints on how to parse dateString
 * @returns {string} a formatted ISO date string
 */
export const createISODateString = (
  dateString?: string,
  inputFormat?: TimeFormats,
): string => {
  let result: DateTime;

  if (!dateString) {
    result = DateTime.now().setZone(USTC_TZ);
  } else {
    result = prepareDateFromString(dateString, inputFormat);
  }

  return result.setZone('utc').toISO()!;
};

/**
 * createISODateAtStartOfDayEST
 * @param {string} dateString a date string to be updated to ISO in USTC_TZ (ET)
 * @returns {string} the ISO formatted date set at midnight of today USTC_TZ (ET)
 */
export const createISODateAtStartOfDayEST = (dateString?: string): string => {
  const dtObj = dateString
    ? DateTime.fromISO(dateString, { zone: USTC_TZ })
    : DateTime.now().setZone(USTC_TZ);

  const iso = dtObj.startOf('day').setZone('utc').toISO();

  return iso!;
};

/**
 * createDateAtStartOfWeekEST
 * @param {string} dateString a date string to be updated to given format in USTC_TZ (ET)
 * @returns {string} the formatted date set at midnight of first Monday of
 *                   given week USTC_TZ (ET)
 */
export const createDateAtStartOfWeekEST = (
  dateString: string,
  format: TimeFormats,
): string => {
  const dtObj = DateTime.fromISO(dateString, { zone: USTC_TZ });

  const dateOutput = dtObj
    .startOf('week')
    .startOf('day')
    .setZone('utc')
    .toFormat(format);

  return dateOutput;
};

export const createEndOfDayISO = (params?: {
  day: string;
  month: string;
  year: string;
}): string => {
  const dateObject = params
    ? DateTime.fromObject(
        {
          day: Number(params.day),
          month: Number(params.month),
          year: Number(params.year),
        },
        { zone: USTC_TZ },
      )
    : DateTime.now().setZone(USTC_TZ);

  return dateObject.endOf('day').setZone('utc').toISO();
};

export const createStartOfDayISO = (params?: {
  day: string;
  month: string;
  year: string;
}): string => {
  const dateObject = params
    ? DateTime.fromObject(
        {
          day: Number(params.day),
          month: Number(params.month),
          year: Number(params.year),
        },
        { zone: USTC_TZ },
      )
    : DateTime.now().setZone(USTC_TZ);

  return dateObject.startOf('day').setZone('utc').toISO();
};

/**
 * @param {object} options the date options containing year, month, day
 * @returns {string} a formatted ISO date string
 */
export const createISODateStringFromObject = options => {
  return DateTime.fromObject(options, { zone: USTC_TZ }).setZone('utc').toISO();
};

/**
 * @param {string} dateString a date string like YYYY-MM-DD or an ISO date retrieved from persistence
 * @param {string} formatArg the desired formatting as specified by the luxon library
 * @returns {string|void} a formatted date string
 */
export const formatDateString = (
  dateString: string,
  formatArg: TimeFormatNames | TimeFormats = FORMATS.ISO,
): string | void => {
  if (!dateString) return '';
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

export const formatNow = (formatStr?: TimeFormats | TimeFormatNames) => {
  const now = createISODateString();
  return formatDateString(now, formatStr);
};

/**
 * @param {string} date1 the first date to be compared
 * @param {string} date2 the second date to be compared
 * @param {object} options options provider
 * @param {boolean} options.exact whether to return the exact number of ms between a and b (default false)
 * @returns {number} difference between date a and date b
 */
export const dateStringsCompared = (
  date1: string,
  date2: string,
  options = { exact: false },
): number => {
  const simpleDateLength = 10; // e.g. YYYY-MM-DD

  if (date1.length == simpleDateLength || date2.length == simpleDateLength) {
    // at least one date has a simple format, compare only year, month, and day according to EST
    const dayDifference = calculateDifferenceInDays(
      createISODateString(date1),
      createISODateString(date2),
    );
    if (Math.abs(dayDifference) === 0) {
      return 0;
    }
  }

  const millisecondsDifferenceThreshold = 30 * 1000;

  const dt1 = prepareDateFromString(date1);
  const dt2 = prepareDateFromString(date2);
  const differenceInMillis = dt1.diff(dt2, 'millisecond').milliseconds;

  if (
    !options.exact &&
    Math.abs(differenceInMillis) < millisecondsDifferenceThreshold
  ) {
    // treat as equal time stamps
    return 0;
  }
  return differenceInMillis;
};

/**
 * @param {string} dateString date to be deconstructed
 * @returns {object} deconstructed date object
 */
export const deconstructDate = (
  dateString: string,
): { day: string; month: string; year: string } => {
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
 * @returns {object} with date, month, and year
 */
export const getMonthDayYearInETObj = (): {
  day: string;
  month: string;
  year: string;
} => {
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
export const isValidDateString = (
  dateString: string,
  formats: TimeFormats[] = ['MM-dd-yyyy', 'MM/dd/yyyy', 'M-d-yyyy', 'M/d/yyyy'],
): boolean => {
  if (!dateString) {
    return false;
  }

  if (Array.isArray(formats)) {
    return formats.some(format => {
      return DateTime.fromFormat(dateString, format).isValid;
    });
  }

  return DateTime.fromFormat(dateString, formats).isValid;
};

export const getDateFormat = (
  dateString: string,
  acceptableFormats: TimeFormats[],
): TimeFormats => {
  for (const possibleTimeFormat of acceptableFormats) {
    if (DateTime.fromFormat(dateString, possibleTimeFormat).isValid) {
      return possibleTimeFormat;
    }
  }

  throw new Error('Invalid date string');
};

/**
 * Calculates the difference in calendar days between timeStamp1 and timeStamp2
 * When timeStamp1 is greater (more recent) than timeStamp2, the difference
 * will be positive. Time-stamps occurring on the same day will yield zero.
 * If timeStamp2 is greater than timeStamp1, the result will be negative.
 * @param {string} timeStamp1 an ISO-8601 date string
 * @param {string} timeStamp2 an ISO-8601 date string
 * @returns {number} the difference between two days, rounded to the nearest integer
 */
export const calculateDifferenceInDays = (
  timeStamp1: string,
  timeStamp2: string,
): number => {
  const dt1 = DateTime.fromISO(timeStamp1, { zone: USTC_TZ })
    .set({
      hour: 12,
    })
    .setZone('utc');

  const dt2 = DateTime.fromISO(timeStamp2, { zone: USTC_TZ })
    .set({
      hour: 12,
    })
    .setZone('utc');

  const differenceInDays = Math.round(dt1.diff(dt2, 'days').days);
  return differenceInDays;
};

/**
 * properly casts a variety of inputs to a UTC ISOString
 * directly using the luxon library to inspect the formatting of the input
 * before sending to application context functions to be transformed
 * @param {object} applicationContext the application context
 * @param {string} dateString the date string to cast to an ISO string
 * @returns {string} the ISO string.
 */
export const castToISO = (dateString: string): string | null => {
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
 * @param {object} applicationContext the application context*
 * @param {string} updatedDateString the new date string to verify
 * @returns {string} the updatedDateString if everything is correct.
 */
export const checkDate = (updatedDateString: string): string | null => {
  const hasAllDateParts = /.+-.+-.+/;
  let result: string | null = null;

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

const dateHasText = (date: string): boolean => {
  const letterMatcher = /[0-9]+$/;
  const dateParts = date.split('-');
  return (
    !letterMatcher.test(dateParts[0]) ||
    !letterMatcher.test(dateParts[1]) ||
    !letterMatcher.test(dateParts[2])
  );
};

/**
 * Formats date object into ISO string only if date is valid
 * @param {object} date the date object containing year, month, day
 * @returns {string|void} a formatted ISO date string if date object is valid
 */
export const validateDateAndCreateISO = ({
  day,
  month,
  year,
}: {
  day: string;
  month: string;
  year: string;
}): string | undefined => {
  if (isValidDateString(`${month}-${day}-${year}`)) {
    return createStartOfDayISO({
      day,
      month,
      year,
    });
  }
};

/**
 * Subtracts a specified amount of time from passed in ISO date
 * @param {string} isoString the ISO date
 * @param {object} dateConfig time
 * @returns {string} a formatted ISO date string if date object is valid
 */
export const subtractISODates = (
  isoString: string,
  dateConfig: DurationLike,
): string => {
  return DateTime.fromISO(isoString).minus(dateConfig).setZone('UTC').toISO()!;
};

/**
 * Returns startDate plus n numberOfDays
 * but if the return date results on a Saturday, Sunday, or Federal holiday,
 * it will be moved forward to the next business day
 * @param {string} startDate the date to add days to
 * @param {number} numberOfDays number of days to add to startDate
 * @returns {string} a formatted MONTH_DAY_YEAR string if date object is valid
 */
export const getBusinessDateInFuture = ({
  numberOfDays,
  startDate,
}: {
  numberOfDays: number;
  startDate: string;
}): string => {
  let laterDate = prepareDateFromString(startDate).plus({
    days: numberOfDays,
  });

  let isAHoliday = fedHolidays.isAHoliday(
    laterDate.toFormat(FORMATS.MONTH_DAY_YEAR) as any,
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
      laterDate.toFormat(FORMATS.MONTH_DAY_YEAR) as any,
    );
  }

  return laterDate.toFormat(FORMATS.MONTH_DAY_YEAR);
};

/**
 * Returns whether or not the current date falls within the given date time range
 * @param {string} intervalStartDate the interval start ISO date string
 * @param {string} intervalEndDate the interval end ISO date string
 * @returns {boolean} whether or not the current date falls within the given date time range
 */
export const isTodayWithinGivenInterval = ({
  intervalEndDate,
  intervalStartDate,
}): boolean => {
  const today = DateTime.now().setZone(USTC_TZ);
  const dateRangeInterval = Interval.fromDateTimes(
    intervalStartDate,
    intervalEndDate,
  );

  return dateRangeInterval.contains(today);
};
