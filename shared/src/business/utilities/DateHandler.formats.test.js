const DateHandler = require('./DateHandler');
const { createISODateString, formatDateString, FORMATS } = DateHandler;
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');

describe('DateHandler', () => {
  describe('Date Formats', () => {
    let realDateNow;
    const mockTimeValue = 1530518207007; // '2018-07-02T07:56:47.007Z'
    // const expectedReturnValue = '2018-07-02T07:56:47.007Z';

    const FORMATS_EXPECTED_OUTPUT = {
      DATE_TIME: '07/02/18 03:56 am',
      DATE_TIME_TZ: '07/02/18 3:56 am ET',
      ISO: '2018-07-02T03:56:47.007-04:00',
      MMDDYY: '07/02/18',
      MMDDYYYY: '07/02/2018',
      MONTH_DAY_YEAR: 'July 2, 2018',
      MONTH_DAY_YEAR_WITH_DAY_OF_WEEK: 'Monday, July 2, 2018',
      SORTABLE_CALENDAR: '2018/07/02',
      TIME: '03:56 am',
      TIME_TZ: '3:56 am ET',
      YEAR: '2018',
      YYYYMMDD: '2018-07-02',
    };

    beforeAll(() => {
      realDateNow = Date.now.bind(global.Date);
      const dateNowStub = jest.fn().mockReturnValue(mockTimeValue);
      global.Date.now = dateNowStub;
    });

    afterAll(() => {
      global.Date.now = realDateNow;
    });

    Object.keys(FORMATS).forEach(format => {
      it(`correctly formats dates using ${format}`, () => {
        const dateString = createISODateString();
        const result = formatDateString(dateString, FORMATS[format]);
        expect(result).toEqual(FORMATS_EXPECTED_OUTPUT[format]);
      });
    });
  });

  describe('createISODateString', () => {
    it('creates a date anew', () => {
      const myDate = createISODateString();
      expect(myDate).toBeDefined();
    });

    it('creates a known timestamp', () => {
      // mock the date implementation and returning original value upon test completion

      const mockTimeValue = 1530518207007;
      const expectedReturnValue = '2018-07-02T07:56:47.007Z';

      const realDateNow = Date.now.bind(global.Date);
      const dateNowStub = jest.fn().mockReturnValue(mockTimeValue);
      global.Date.now = dateNowStub;

      const myDate = DateHandler.createISODateString();
      expect(myDate).toBe(expectedReturnValue);
      expect(dateNowStub).toHaveBeenCalled();

      global.Date.now = realDateNow;
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
});
