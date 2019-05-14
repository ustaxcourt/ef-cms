const { createISODateString, formatDateString } = require('./DateHandler');

describe('DateHandler', () => {
  describe('createISODateString', () => {
    it('creates a date anew', () => {
      const myDate = createISODateString();
      expect(myDate).toBeDefined();
    });

    it('creates an EST-set UTC date from a YYYY-MM-DD string', () => {
      const myDate = createISODateString('2001-01-01'); // Jan 1, 2001 at the stroke of midnight, EST
      expect(myDate).toBe('2001-01-01T05:00:00.000Z');
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
      expect(result).toBe('2019-03-01 11:40 am');
    });
  });
});
