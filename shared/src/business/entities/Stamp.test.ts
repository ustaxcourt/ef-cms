import {
  FORMATS,
  calculateISODate,
  createISODateAtStartOfDayEST,
  createISODateString,
  formatDateString,
  formatNow,
} from '../utilities/DateHandler';
import { MOTION_DISPOSITIONS } from './EntityConstants';
import { Stamp } from './Stamp';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';

describe('Stamp entity', () => {
  describe('Validation', () => {
    it('should be invalid when disposition is undefined', () => {
      const stamp = new Stamp({});
      const customMessages = extractCustomMessages(stamp.getValidationRules());
      expect(stamp.getFormattedValidationErrors()).toMatchObject({
        disposition: customMessages.disposition[0],
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
