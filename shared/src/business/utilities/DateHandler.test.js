const DateHandler = require('./DateHandler');
const { FORMATS, PATTERNS } = DateHandler;
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');

describe('DateHandler', () => {
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

  describe('prepareDateFromString', () => {
    it("Creates a new moment object for 'now' when given no inputs'", () => {
      const myMoment = DateHandler.prepareDateFromString();
      expect(myMoment).toBeDefined();
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

  describe('createISODateString', () => {
    it('creates a date anew', () => {
      const myDate = DateHandler.createISODateString();
      expect(myDate).toBeDefined();
    });

    it('creates a date from a year', () => {
      const myDate = DateHandler.createISODateString('2000', 'YYYY');
      expect(myDate).toBe('2000-01-01T05:00:00.000Z');
    });

    it('creates a date from a two-digit year', () => {
      const myDate = DateHandler.createISODateString('89', 'YYYY');
      expect(myDate).toBe('1989-01-01T05:00:00.000Z');
    });

    it('creates an EST-set UTC date from a YYYY-MM-DD string', () => {
      const myDate = DateHandler.createISODateString('2001-01-01'); // Jan 1, 2001 at the stroke of midnight, EST
      expect(myDate).toBe('2001-01-01T05:00:00.000Z');
    });

    it('should not alter a zulu time string', () => {
      const myDate = DateHandler.createISODateString(
        '2001-01-01T00:00:00.000Z',
      ); // Jan 1, 2001 at the stroke of midnight, GMT
      expect(myDate).toBe('2001-01-01T00:00:00.000Z');
    });

    it('creates timestamps that strictly adhere to Joi formatting rules', () => {
      const thisDate = DateHandler.createISODateString();
      expect(
        JoiValidationConstants.ISO_DATE.validate(thisDate).error,
      ).toBeUndefined();
    });
  });

  describe('deconstructDate', () => {
    it('returns month, day, and year when provided a valid ISO timestamp', () => {
      const input = '2019-10-30T12:39:54.007Z';
      const result = DateHandler.deconstructDate(input);
      expect(result).toMatchObject({ day: '30', month: '10', year: '2019' });
    });
    it('returns undefined if given a value not representative of an ISO timestamp', () => {
      const input = '';
      const result = DateHandler.deconstructDate(input);
      expect(result).toBeUndefined();
    });
  });

  describe('formatDateString', () => {
    it('accepts YYYY-MM-DD as EST and displays same as EST', () => {
      const dateRetrievedFromStorage = '2001-01-01';
      const result = DateHandler.formatDateString(
        dateRetrievedFromStorage,
        'YYYY-MM-DD',
      ); // stored literally as EST
      expect(result).toBe('2001-01-01');
    });

    it('creates a formatted EST time from a database iso string', () => {
      const dateRetrievedFromStorage = '2019-03-02T04:40:46.415Z';
      const result = DateHandler.formatDateString(
        dateRetrievedFromStorage,
        'YYYY-MM-DD hh:mm a',
      );
      expect(result).toBe('2019-03-01 11:40 pm');
    });

    it('creates a formatted EST time using DateHandler internal format "TIME_TZ" ', () => {
      const dateRetrievedFromStorage = '2019-03-02T01:40:46.415Z';
      const result = DateHandler.formatDateString(
        dateRetrievedFromStorage,
        'TIME_TZ',
      );
      expect(result).toBe('8:40 pm ET');
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
      const result = DateHandler.formatNow('YY');
      expect(result).toEqual('96');
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
  });

  describe('calendarDatesCompared', () => {
    const pastDate = '2001-01-01';
    const futureDate = '2061-01-02';

    it('should return -1 when the first date is occurs before the second', () => {
      const result = DateHandler.calendarDatesCompared(pastDate, futureDate);

      expect(result).toEqual(-1);
    });

    it('should return 1 when the first date occurs after the second', () => {
      const result = DateHandler.calendarDatesCompared(futureDate, pastDate);

      expect(result).toEqual(1);
    });

    it('should return 0 when the two dates are the same calendar date', () => {
      const result = DateHandler.calendarDatesCompared(futureDate, futureDate);

      expect(result).toEqual(0);
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
});
