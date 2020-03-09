const DateHandler = require('./DateHandler');

describe('DateHandler', () => {
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
    it('calculates dates with negative adjustment', () => {
      const result = DateHandler.calculateISODate({
        dateString: '2000-01-21T00:00:00.000Z',
        howMuch: -20,
        units: 'days',
      });
      expect(result).toEqual('2000-01-01T00:00:00.000Z');
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
