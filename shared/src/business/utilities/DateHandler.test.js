const DateHandler = require('./DateHandler');

describe('DateHandler', () => {
  describe('prepareDateFromString', () => {
    it("Creates a new moment object for 'now' when given no inputs'", () => {
      const myMoment = DateHandler.prepareDateFromString();
      expect(myMoment).toBeDefined();
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
});
