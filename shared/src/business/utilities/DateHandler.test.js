/* eslint-disable max-lines */
const DateHandler = require('./DateHandler');
const { FORMATS, PATTERNS } = DateHandler;

describe('DateHandler', () => {
  // Takes an ISO-8601 timestamp representing UTC and temporarily
  // mocks the system's current time by overriding global Date implementation
  const setupMockTestCurrentTime = isoTimestamp => {
    const originalDateImpl = Date.now.bind(global.Date);
    const dateNowMock = jest.fn();

    const setDateMockValue = timestamp => {
      // eslint-disable-next-line @miovision/disallow-date/no-new-date
      dateNowMock.mockReturnValue(new Date(timestamp).valueOf());
    };
    const setupDateMock = () => {
      setDateMockValue(isoTimestamp);
      global.Date.now = dateNowMock;
    };
    const restoreDateMock = () => {
      global.Date.now = originalDateImpl;
    };

    return { restoreDateMock, setDateMockValue, setupDateMock };
  };

  describe('combine ISO date and EST time', () => {
    it('should combine ISO datestamp and a string representing hours and minutes in Eastern time', () => {
      const inputISO = '2021-11-11T05:00:00.000Z';
      const inputTimeInEst = '14:00'; //2:00 pm

      const outputString = '2021-11-11T19:00:00.000Z';

      const result = DateHandler.combineISOandEasternTime(
        inputISO,
        inputTimeInEst,
      );
      expect(result).toEqual(outputString);
    });
  });
  describe('pattern matcher', () => {
    describe('H:MM', () => {
      it('matches valid times', () => {
        expect(PATTERNS['H:MM'].test('00:00')).toBeTruthy();
        expect(PATTERNS['H:MM'].test('9:00')).toBeTruthy();
        expect(PATTERNS['H:MM'].test('09:00')).toBeTruthy();
        expect(PATTERNS['H:MM'].test('10:30')).toBeTruthy();
        expect(PATTERNS['H:MM'].test('23:59')).toBeTruthy();
      });
      it('rejects invalid times', () => {
        expect(PATTERNS['H:MM'].test('7:60')).toBeFalsy();
        expect(PATTERNS['H:MM'].test('29:59')).toBeFalsy();
        expect(PATTERNS['H:MM'].test('30:00')).toBeFalsy();
      });
    });
  });

  describe('prepareDateFromEST', () => {
    it('converts calendar date to ISO', () => {
      const result = DateHandler.prepareDateFromEST('11/11/11', FORMATS.MMDDYY);
      expect(result).toBe('2011-11-11T05:00:00.000Z');
    });
  });

  describe('prepareDateFromString', () => {
    it("Creates a new datetime object for 'now' when given no inputs", () => {
      const myDatetime = DateHandler.prepareDateFromString();
      expect(myDatetime).toBeDefined();
    });

    it('Creates a new datetime object for a given YYYY-MM-DD', () => {
      const myDatetime = DateHandler.prepareDateFromString('2021-03-21');
      const isoString = myDatetime.toISO();
      expect(isoString).toEqual('2021-03-21T04:00:00.000Z');
    });

    it('Creates a new datetime object for a given strict ISO timestamp with unchanged timezone', () => {
      const strictIsoStamp = '2021-03-21T01:00:00.000Z';
      const myDatetime = DateHandler.prepareDateFromString(strictIsoStamp);
      const isoString = myDatetime.toISOString();
      expect(isoString).toEqual(strictIsoStamp);
    });
  });

  describe('createISODateStringFromObject', () => {
    it('should return expected date when using single digit month and day', () => {
      const myDate = DateHandler.createISODateStringFromObject({
        day: '1',
        month: '1',
        year: '1990',
      });
      expect(myDate).toEqual('1990-01-01T05:00:00.000Z');
    });

    it('should return expected date when using double digit month and day', () => {
      const myDate = DateHandler.createISODateStringFromObject({
        day: '01',
        month: '01',
        year: '1990',
      });
      expect(myDate).toEqual('1990-01-01T05:00:00.000Z');
    });
  });

  describe('calculateDifferenceInDays', () => {
    it('returns calculated interval based on provided unit', () => {
      const firstDate = '2020-01-09T12:00:00.000Z';
      const tenDaysLater = '2020-01-19T12:00:00.000Z';
      const result = DateHandler.calculateDifferenceInDays(
        tenDaysLater,
        firstDate,
      );
      expect(result).toEqual(10);
    });
    it('returns negative value if first date provided is earlier than second', () => {
      const firstDate = '2020-01-01T12:00:00.000Z';
      const fiveDaysLater = '2020-01-06T12:00:00.000Z';
      const result = DateHandler.calculateDifferenceInDays(
        firstDate,
        fiveDaysLater,
      );
      expect(result).toEqual(-5);
    });
    it('returns positive value if first date provided is later than second', () => {
      const firstDate = '2020-01-06T12:00:00.000Z';
      const fiveDaysEarlier = '2020-01-01T12:00:00.000Z';
      const result = DateHandler.calculateDifferenceInDays(
        firstDate,
        fiveDaysEarlier,
      );
      expect(result).toEqual(5);
    });
    it('returns a difference of 1 day if first day is "today at 4pm EST" and second day is "tomorrow at 8am EST"', () => {
      const firstDate = '2020-01-01T21:00:00.000Z'; // 4pm EST
      const sameDate = '2020-01-02T13:00:00.000Z'; // 8am EST
      const result = DateHandler.calculateDifferenceInDays(sameDate, firstDate);
      expect(result).toEqual(1);
    });
    it('returns difference of 1 day from the perspective of the EST time zone, even if dates provided occur on the same day in UTC and are only two minutes apart', () => {
      const lateToday = '2020-01-02T04:59:00.000Z'; // 2010-01-01 at 11:59pm EST
      const earlyTomorrow = '2020-01-02T05:01:00.000Z'; // 2020-01-02 at 12:01am EST
      const result = DateHandler.calculateDifferenceInDays(
        earlyTomorrow,
        lateToday,
      );
      expect(result).toEqual(1);
    });
    it('returns difference of 1 day from the perspective of the EST time zone, even if dates provided occur on the same day in UTC', () => {
      const earlyToday = '2020-01-02T05:01:00.000Z'; // 2010-01-02 at 12:01am EST
      const lateTomorrow = '2020-01-04T04:59:00.000Z'; // 2020-01-03 at 11:59pm EST
      const result = DateHandler.calculateDifferenceInDays(
        lateTomorrow,
        earlyToday,
      );
      expect(result).toEqual(1);
    });
    it('returns difference of 45 day from the perspective of the EST time zone when both are 1 minute before midnight EST', () => {
      const firstDate = '2020-02-04T04:59:00.000Z'; // 2010-02-03 at 11:59pm EST of a leap year
      const fortyFiveDaysLater = '2020-03-20T03:59:00.000Z'; // 2020-03-19 at 11:59pm EST across daylight saving line, too

      const result = DateHandler.calculateDifferenceInDays(
        fortyFiveDaysLater,
        firstDate,
      );
      expect(result).toEqual(45);
    });
  });

  describe('calculateISODate', () => {
    it('returns the dateString param exactly as provided when the `howMuch` param is omitted', () => {
      const result = DateHandler.calculateISODate({ dateString: '12/1/1901' });

      expect(result).toEqual('12/1/1901');
    });

    it('calculates dates with positive adjustment', () => {
      const result = DateHandler.calculateISODate({
        dateString: '2000-01-01T00:00:00.000Z',
        howMuch: 20,
        units: 'days',
      });

      expect(result).toEqual('2000-01-21T00:00:00.000Z');
    });

    it('calculates dates with an hour not at midnight', () => {
      const result = DateHandler.calculateISODate({
        dateString: '2000-01-01T20:01:23.212Z',
        howMuch: 20,
        units: 'days',
      });

      expect(result).toEqual('2000-01-21T20:01:23.212Z');
    });

    it('calculates dates with negative adjustment', () => {
      const result = DateHandler.calculateISODate({
        dateString: '2000-01-21T00:00:00.000Z',
        howMuch: -20,
        units: 'days',
      });

      expect(result).toEqual('2000-01-01T00:00:00.000Z');
    });
  });

  describe('createStartOfDayISO', () => {
    it('creates a timestamp exactly at midnight, the first moment of the day according to Eastern Timezone', () => {
      const startOfDay = DateHandler.createStartOfDayISO({
        day: '7',
        month: '4',
        year: '2020',
      });
      expect(startOfDay).toBe('2020-04-07T04:00:00.000Z');

      // now confirm it converts "back" to originally desired time
      const formattedInEastern = DateHandler.formatDateString(
        startOfDay,
        FORMATS.DATE_TIME,
      );
      expect(formattedInEastern).toEqual('04/07/20 12:00 am'); // the stroke of midnight
    });
  });

  describe('createEndOfDayISO', () => {
    it('creates a timestamp one millisecond before midnight, the last moment of the day according to Eastern Timezone', () => {
      const endOfDay = DateHandler.createEndOfDayISO({
        day: '7',
        month: '4',
        year: '2020',
      });
      expect(endOfDay).toEqual('2020-04-08T03:59:59.999Z');

      // now confirm it converts "back" to originally desired time
      const formattedInEastern = DateHandler.formatDateString(
        endOfDay,
        FORMATS.DATE_TIME,
      );
      expect(formattedInEastern).toEqual('04/07/20 11:59 pm'); // the moment before midnight the next day
    });
  });

  describe('createISODateAtStartOfDayEST', () => {
    describe('around midnight', () => {
      const mockTimeFunc = setupMockTestCurrentTime('2021-10-07T00:31:51.621Z');
      beforeAll(mockTimeFunc.setupDateMock);
      afterAll(mockTimeFunc.restoreDateMock);

      const midnightTests = [
        // input in ISO UTC, output in ET start of day
        ['2021-10-07T00:31:51.621Z', '2021-10-06T04:00:00.000Z'], // 10/6 at midnight ET
        ['2021-10-07T11:01:51.621Z', '2021-10-07T04:00:00.000Z'],
        ['2022-01-01T01:02:21.729Z', '2021-12-31T05:00:00.000Z'], // Jan 1 at 1am UTC is still Dec 31 ET
      ];

      midnightTests.forEach(([input, output]) => {
        it(`gets an ISO Date String representing Midnight when given ${input}`, () => {
          const result = DateHandler.createISODateAtStartOfDayEST(input);
          expect(result).toBe(output);
        });
      });

      it('gets an ISO Date String representing today at Midnight when given no arguments', () => {
        const sameDay = '2022-07-16';
        mockTimeFunc.setDateMockValue(`${sameDay}T18:54:00.000Z`);
        const result = DateHandler.createISODateAtStartOfDayEST();
        expect(result).toBe(`${sameDay}T04:00:00.000Z`);
      });
    });

    it('creates a timestamp at start of day EST when provided YYYY-MM-DD', () => {
      const myDate = DateHandler.createISODateAtStartOfDayEST('2020-03-15');
      expect(myDate).toEqual('2020-03-15T04:00:00.000Z');
    });

    it('creates a timestamp at start of day EST when given no arguments', () => {
      const myDate = DateHandler.createISODateAtStartOfDayEST();
      expect(DateHandler.isStringISOFormatted(myDate)).toBeTruthy();
    });

    it('creates a timestamp at start of day EST when provided full ISO that is not already at the start of the day', () => {
      const myDate = DateHandler.createISODateAtStartOfDayEST(
        '2020-03-15T17:42:36.916Z',
      );
      expect(myDate).toEqual('2020-03-15T04:00:00.000Z');
    });

    it('returns the correct timestamp value if a start of day EST timestamp is input', () => {
      const inputAndOutput = '2020-03-15T04:00:00.000Z';
      const myDate = DateHandler.createISODateAtStartOfDayEST(inputAndOutput);
      expect(myDate).toEqual(inputAndOutput);
    });
  });

  describe('deconstructDate', () => {
    it('returns month, day, and year when provided a valid ISO timestamp', () => {
      const input = '2019-10-30T12:39:54.007Z';
      const result = DateHandler.deconstructDate(input);
      expect(result).toMatchObject({ day: '30', month: '10', year: '2019' });
    });
    it('returns month, day, and year when provided a valid ISO timestamp in the early morning UTC', () => {
      const input = '2019-10-30T02:39:54.007Z';
      const result = DateHandler.deconstructDate(input);
      expect(result).toMatchObject({ day: '29', month: '10', year: '2019' });
    });
    it('can deconstruct dates formatted as YYYY-MM-DD', () => {
      const input = '2038-07-31';
      const result = DateHandler.deconstructDate(input);
      expect(result).toMatchObject({ day: '31', month: '7', year: '2038' });
    });
    it('returns undefined if given a value not representative of an ISO timestamp', () => {
      const input = '';
      const result = DateHandler.deconstructDate(input);
      expect(result).toBeUndefined();
    });
  });

  describe('formatDateString', () => {
    it('accepts YYYY-MM-DD as ET and displays same as ET', () => {
      const dateRetrievedFromStorage = '2001-01-01';
      const result = DateHandler.formatDateString(
        dateRetrievedFromStorage,
        'yyyy-MM-dd',
      ); // stored literally as ET
      expect(result).toBe('2001-01-01');
    });

    it('creates a formatted ET time from a database iso string', () => {
      const dateRetrievedFromStorage = '2019-03-02T04:40:46.415Z';
      const result = DateHandler.formatDateString(
        dateRetrievedFromStorage,
        FORMATS.DATE_TIME_TZ,
      );
      expect(result).toBe('03/01/19 11:40 pm ET');
    });

    it('creates a formatted EST time using DateHandler internal format "TIME_TZ"', () => {
      const dateRetrievedFromStorage = '2019-03-02T01:40:46.415Z';
      const result = DateHandler.formatDateString(
        dateRetrievedFromStorage,
        FORMATS.TIME_TZ,
      );
      expect(result).toBe('8:40 pm ET');
    });

    it('creates a formatted EST time using DateHandler internal format "TIME_TZ"', () => {
      const dateRetrievedFromStorage = '2001-01-01';
      const result = DateHandler.formatDateString(
        dateRetrievedFromStorage,
        FORMATS.SHORT_MONTH_DAY_YEAR,
      );
      expect(result).toBe('Jan 1, 2001');
    });
  });

  describe('formatNow', () => {
    beforeEach(() => {
      jest
        .spyOn(DateHandler, 'createISODateString')
        .mockImplementation(() => '1997-01-01T02:17:27.415Z');
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('formats current time stamp using requested format', () => {
      const result = DateHandler.formatNow('yy');
      expect(result).toEqual('96');
    });
    it('formats current time stamp using requested format', () => {
      const result = DateHandler.formatNow(FORMATS.YEAR);
      const numericType = +result;
      expect(result).toEqual('1996');
      expect(numericType).toEqual(1996);
    });
  });

  describe('dateStringsCompared', () => {
    it('should correctly compare two date strings', () => {
      let result;
      const date1 = '2001-01-01';
      const date2 = '2001-01-02';

      result = DateHandler.dateStringsCompared(date1, date2);
      expect(result).toEqual(-86400000); // 1 day in milliseconds

      result = DateHandler.dateStringsCompared(date2, date1);
      expect(result).toEqual(86400000); // 1 day in milliseconds
    });

    it('should return a non-zero if two calendar-dates appear to be the same but are different according to EST', () => {
      let result;
      const date1 = '2001-01-02'; // i.e. Jan 2, midnight EST
      const date2 = '2001-01-02T02:40:55.007Z'; // Jan 1, 9:40m EST

      result = DateHandler.dateStringsCompared(date1, date2);
      expect(result).not.toEqual(0);
    });

    it('should return zero if two calendar-dates are the same, even if formatted differently', () => {
      let result;
      const date1 = '2001-01-01';
      const date2 = '2001-01-01T08:40:55.007Z';

      result = DateHandler.dateStringsCompared(date1, date2);
      expect(result).toEqual(0);
    });

    it('should by default return zero if provided two ISO timestamps within 30 seconds of each other', () => {
      let result;
      const date1 = '2001-01-01T08:40:26.007Z';
      const date2 = '2001-01-01T08:40:55.007Z';

      result = DateHandler.dateStringsCompared(date1, date2);
      expect(result).toEqual(0);
    });

    it('should not return zero if provided two ISO timestamps within 30 seconds of each other and options specify exact is true', () => {
      let result;
      const date1 = '2001-01-01T08:40:26.007Z';
      const date2 = '2001-01-01T08:40:55.007Z';

      result = DateHandler.dateStringsCompared(date1, date2, { exact: true });
      expect(result).not.toEqual(0);
      expect(result).toEqual(-29000);
    });
  });

  describe('isValidDateString', () => {
    it('should return true on valid date strings', () => {
      ['01-01-2001', '1-1-2001', '01/01/2001', '1/1/2001'].forEach(date => {
        expect(DateHandler.isValidDateString(date)).toBeTruthy();
      });
    });

    it('should return false on invalid date string', () => {
      ['01-01-01', '13-1-2001', '01/41/2001', '/1/2001'].forEach(date => {
        expect(DateHandler.isValidDateString(date)).toBeFalsy();
      });
    });
  });
  describe('castToISO', () => {
    it('returns an iso string when the date string passed in is valid', () => {
      expect(DateHandler.castToISO('2010-10-10')).toEqual(
        '2010-10-10T04:00:00.000Z',
      );
    });

    it('returns an iso string when the date string of 2009-01-01 passed in is valid', () => {
      expect(DateHandler.castToISO('2009-01-01')).toEqual(
        '2009-01-01T05:00:00.000Z',
      );
    });

    it('returns an iso string for 01-01-2009 when the date string of 2009 is passed in', () => {
      expect(DateHandler.castToISO('2009')).toEqual('2009-01-01T05:00:00.000Z');
    });

    it('returns null when the date string passed in is invalid', () => {
      expect(DateHandler.castToISO('x-10-10')).toEqual('-1');
    });

    it('returns null when the date string passed in is an empty string', () => {
      expect(DateHandler.castToISO('')).toEqual(null);
    });

    it('returns the same iso string passed in when an iso string is passed in', () => {
      expect(DateHandler.castToISO('1990-01-01T05:00:00.000Z')).toEqual(
        '1990-01-01T05:00:00.000Z',
      );
    });
  });

  describe('checkDate', () => {
    it('should return -1 when the date is invalid', () => {
      expect(DateHandler.checkDate('xx-01-01')).toEqual('-1');
    });

    it('should return null when date does not include letters or numbers', () => {
      expect(DateHandler.checkDate('--')).toEqual(null);
    });

    it('should return the expected date in ISO format', () => {
      expect(DateHandler.checkDate('2009-09-03')).toEqual(
        '2009-09-03T04:00:00.000Z',
      );
    });
  });

  describe('computeDate', () => {
    it('should return a zero-padded date formatted like YYYY-MM-DDTHH:mm:ss.SSSZ when provided day, month, and year', () => {
      const result = DateHandler.computeDate({
        day: '9',
        month: '3',
        year: '1993',
      });

      expect(result).toBe('1993-03-09T05:00:00.000Z');
    });

    it('should return undefined when year, month, or day is not provided', () => {
      const result = DateHandler.computeDate({
        day: '5',
        month: '11',
      });

      expect(result).toBe(undefined);
    });

    it('should return null if not provided values for all of day, month, and year', () => {
      const result = DateHandler.computeDate({
        daynotprovided: true,
        not: 'date info',
        some: 'other thing',
      });

      expect(result).toBe(null);
    });
  });

  describe('getMonthDayYearInETObj', () => {
    beforeAll(() => {
      expect.extend({
        toBeWithinRange(received, floor, ceiling) {
          const pass = +received >= floor && +received <= ceiling;
          if (pass) {
            return {
              message: () =>
                `expected ${received} not to be within range ${floor} - ${ceiling}`,
              pass: true,
            };
          } else {
            return {
              message: () =>
                `expected ${received} to be within range ${floor} - ${ceiling}`,
              pass: false,
            };
          }
        },
      });
    });

    it('takes no arguments to create an object with keys month, day, and year according to Eastern Time with numeric strings', () => {
      const mockTimeFunc = setupMockTestCurrentTime('2021-10-07T00:31:51.621Z');

      mockTimeFunc.setupDateMock();
      const result = DateHandler.getMonthDayYearInETObj();
      mockTimeFunc.restoreDateMock();

      expect(result).toEqual({
        day: '6',
        month: '10',
        year: '2021',
      });
    });
  });

  describe('validateDateAndCreateISO)', () => {
    it('should return undefined when year, month, or day is invalid', () => {
      const result = DateHandler.validateDateAndCreateISO({
        day: '33',
        month: '10',
        year: '2002',
      });

      expect(result).toBe(undefined);
    });

    it('should return undefined when year, month, or day is not provided', () => {
      const result = DateHandler.validateDateAndCreateISO({
        day: '4',
        month: '10',
      });

      expect(result).toBe(undefined);
    });

    it('should return expected ISO date when date object is valid', () => {
      const validDate = DateHandler.createISODateStringFromObject({
        day: '1',
        month: '1',
        year: '2001',
      });
      expect(validDate).toEqual('2001-01-01T05:00:00.000Z');
    });
  });

  describe('subtractISODates)', () => {
    it('return an ISO string of the previous year', () => {
      const isoDate = '1999-01-01T05:00:00.000Z';
      const previousYearISO = '1997-01-01T05:00:00.000Z';
      const result = DateHandler.subtractISODates(isoDate, {
        year: 2,
      });

      expect(result).toEqual(previousYearISO);
    });
  });

  describe('getBusinessDateInFuture)', () => {
    it('should return 60 days in the future from the provided date if that later date is not a holiday or weekend', () => {
      const numberOfDays = 60;
      const mockStartDate = '2021-05-31';
      const sixtyDaysFromStartDate = 'July 30, 2021';

      const result = DateHandler.getBusinessDateInFuture({
        numberOfDays,
        startDate: mockStartDate,
      });

      expect(result).toEqual(sixtyDaysFromStartDate);
    });

    it('should return a weekday >60 days in the future from now if 60 days from now lands on a Saturday', () => {
      const numberOfDays = 60;
      const mockStartDate = '2021-06-01';
      const weekdaySixtyDaysFromStartDate = 'August 2, 2021';

      const result = DateHandler.getBusinessDateInFuture({
        numberOfDays,
        startDate: mockStartDate,
      });

      expect(result).toEqual(weekdaySixtyDaysFromStartDate);
    });

    it('should return a weekday >60 days in the future from now if 60 days from now lands on a Sunday', () => {
      const numberOfDays = 60;
      const mockStartDate = '2021-06-02';
      const weekdaySixtyDaysFromStartDate = 'August 2, 2021';

      const result = DateHandler.getBusinessDateInFuture({
        numberOfDays,
        startDate: mockStartDate,
      });

      expect(result).toEqual(weekdaySixtyDaysFromStartDate);
    });

    it('should return a non-holiday weekday >60 days in the future from now if 60 days from now lands on a shifted Sunday federal holiday', () => {
      const numberOfDays = 60;
      const mockStartDate = '2022-10-27';
      // Christmas is 12/25/22, but observed on Monday 12/26/22
      const weekdayNonHolidayAtLeastSixtyDaysFromStartDate =
        'December 27, 2022';

      const result = DateHandler.getBusinessDateInFuture({
        numberOfDays,
        startDate: mockStartDate,
      });

      expect(result).toEqual(weekdayNonHolidayAtLeastSixtyDaysFromStartDate);
    });

    it('should return a non-holiday weekday >60 days in the future from now if 60 days from now lands on a shifted Saturday federal holiday', () => {
      const numberOfDays = 60;
      const mockStartDate = '2021-11-01';
      const weekdayNonHolidayAtLeastSixtyDaysFromStartDate = 'January 3, 2022';
      // New Year's Day is 1/1/22, but observed on Friday 12/31/21

      const result = DateHandler.getBusinessDateInFuture({
        numberOfDays,
        startDate: mockStartDate,
      });

      expect(result).toEqual(weekdayNonHolidayAtLeastSixtyDaysFromStartDate);
    });

    it('should return a non-holiday weekday >60 days in the future from now if 60 days from now lands on a federal holiday', () => {
      const numberOfDays = 60;
      const mockStartDate = '2022-09-12';
      // Veterans day is Friday 11/11/22
      const weekdayNonHolidayAtLeastSixtyDaysFromStartDate =
        'November 14, 2022';

      const result = DateHandler.getBusinessDateInFuture({
        numberOfDays,
        startDate: mockStartDate,
      });

      expect(result).toEqual(weekdayNonHolidayAtLeastSixtyDaysFromStartDate);
    });
  });
});
