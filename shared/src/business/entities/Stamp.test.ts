const {
  calculateISODate,
  createISODateAtStartOfDayEST,
  createISODateString,
  formatDateString,
  FORMATS,
} = require('../utilities/DateHandler');
const { formatNow } = require('../utilities/DateHandler');
const { MOTION_DISPOSITIONS } = require('./EntityConstants');
const { Stamp } = require('./Stamp');

const { VALIDATION_ERROR_MESSAGES } = Stamp;

describe('Stamp entity', () => {
  describe('Validation', () => {
    it('should be invalid when disposition is undefined', () => {
      const stamp = new Stamp({});

      expect(stamp.getFormattedValidationErrors()).toMatchObject({
        disposition: VALIDATION_ERROR_MESSAGES.disposition,
      });
    });

    it('should be invalid when date is yesterday', () => {
      let yesterdayIso = createISODateAtStartOfDayEST();
      yesterdayIso = calculateISODate({
        dateString: yesterdayIso,
        howMuch: -1,
        units: 'days',
      });

      const yesterdayFormatted = formatDateString(
        createISODateString(yesterdayIso),
        FORMATS.ISO,
      );

      const stamp = new Stamp({
        date: yesterdayFormatted,
        disposition: MOTION_DISPOSITIONS.GRANTED,
        dueDateMessage: 'something',
      });

      expect(stamp.getFormattedValidationErrors()).toMatchObject({
        date: 'Due date cannot be prior to today. Enter a valid date.',
      });
    });

    it('should be invalid when date is undefined but dueDateMessage is defined', () => {
      const stamp = new Stamp({
        date: undefined,
        disposition: MOTION_DISPOSITIONS.GRANTED,
        dueDateMessage: 'something',
      });

      expect(stamp.getFormattedValidationErrors()).toMatchObject({
        date: 'Enter a valid date',
      });
    });

    it('should be valid when date and dueDateMessage are defined', () => {
      const stamp = new Stamp({
        date: '2222-12-05T00:00:00.000-05:00',
        disposition: MOTION_DISPOSITIONS.GRANTED,
        dueDateMessage: 'something',
      });

      expect(stamp.getFormattedValidationErrors()).toBeNull();
    });

    it('should be valid when date is today', () => {
      const mockToday = formatNow();

      const stamp = new Stamp({
        date: mockToday,
        disposition: MOTION_DISPOSITIONS.GRANTED,
        dueDateMessage: 'something',
      });

      expect(stamp.getFormattedValidationErrors()).toBeNull();
    });
  });
});
