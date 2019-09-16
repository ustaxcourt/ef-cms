const {
  createISODateString,
  formatDateString,
  prepareDateFromString,
} = require('./DateHandler');

describe('DateHandler', () => {
  describe('prepareDateFromString', () => {
    it("Creates a new moment object for 'now' when given no inputs'", () => {
      const myMoment = prepareDateFromString();
      expect(myMoment).toBeDefined();
    });
  });

  describe('createISODateString', () => {
    it('creates a date anew', () => {
      const myDate = createISODateString();
      expect(myDate).toBeDefined();
    });

    it('creates a date from a year', () => {
      const myDate = createISODateString('2000', 'YYYY');
      expect(myDate).toBe('2000-01-01T05:00:00.000Z');
    });

    it('creates a date from a two-digit year', () => {
      const myDate = createISODateString('89', 'YYYY');
      expect(myDate).toBe('1989-01-01T05:00:00.000Z');
    });

    it('creates an EST-set UTC date from a YYYY-MM-DD string', () => {
      const myDate = createISODateString('2001-01-01'); // Jan 1, 2001 at the stroke of midnight, EST
      expect(myDate).toBe('2001-01-01T05:00:00.000Z');
    });

    it('should not alter a zulu time string', () => {
      const myDate = createISODateString('2001-01-01T00:00:00.000Z'); // Jan 1, 2001 at the stroke of midnight, GMT
      expect(myDate).toBe('2001-01-01T00:00:00.000Z');
    });
  });

  describe('formatDateString', () => {
    it('accepts YYYY-MM-DD as EST and displays same as EST', () => {
      const dateRetrievedFromStorage = '2001-01-01';
      const result = formatDateString(dateRetrievedFromStorage, 'YYYY-MM-DD'); // stored literally as EST
      expect(result).toBe('2001-01-01');
    });
    it('creates a formatted EST time from a database iso string', () => {
      const dateRetrievedFromStorage = '2019-03-02T04:40:46.415Z';
      const result = formatDateString(
        dateRetrievedFromStorage,
        'YYYY-MM-DD hh:mm a',
      );
      expect(result).toBe('2019-03-01 11:40 pm');
    });
  });
});
