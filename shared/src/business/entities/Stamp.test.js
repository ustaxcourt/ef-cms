const {
  calculateISODate,
  createISODateString,
  formatDateString,
  FORMATS,
  getStartOfDateFromIsoDateString,
} = require('../utilities/DateHandler');
const { formatNow } = require('../utilities/DateHandler');
const { MOTION_STATUSES } = require('./EntityConstants');
const { Stamp } = require('./Stamp');

const { VALIDATION_ERROR_MESSAGES } = Stamp;

describe('Stamp entity', () => {
  describe('Validation', () => {
    it('should be invalid when status is undefined', () => {
      const stamp = new Stamp({});

      expect(stamp.getFormattedValidationErrors()).toMatchObject({
        status: VALIDATION_ERROR_MESSAGES.status,
      });
    });

    it('should be invalid when date is yesterday', () => {
      let yesterdayIso = getStartOfDateFromIsoDateString();
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
        dueDateMessage: 'something',
        status: MOTION_STATUSES.GRANTED,
      });

      expect(stamp.getFormattedValidationErrors()).toMatchObject({
        date: 'Due date cannot be prior to today. Enter a valid date.',
      });
    });

    it('should be invalid when date is undefined but dueDateMessage is defined', () => {
      const stamp = new Stamp({
        date: undefined,
        dueDateMessage: 'something',
        status: MOTION_STATUSES.GRANTED,
      });

      expect(stamp.getFormattedValidationErrors()).toMatchObject({
        date: 'Enter a valid date',
      });
    });

    it('should be valid when date and dueDateMessage are defined', () => {
      const stamp = new Stamp({
        date: '2222-12-05T00:00:00.000-05:00',
        dueDateMessage: 'something',
        status: MOTION_STATUSES.GRANTED,
      });

      expect(stamp.getFormattedValidationErrors()).toBeNull();
    });

    it('should be valid when date is today', () => {
      const mockToday = formatNow();

      const stamp = new Stamp({
        date: mockToday,
        dueDateMessage: 'something',
        status: MOTION_STATUSES.GRANTED,
      });

      expect(stamp.getFormattedValidationErrors()).toBeNull();
    });
  });
});
