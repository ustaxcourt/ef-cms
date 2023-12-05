import { FORMATS, formatNow } from '../utilities/DateHandler';
import { MOTION_DISPOSITIONS } from './EntityConstants';
import { Stamp } from './Stamp';

describe('Stamp entity', () => {
  describe('Validation', () => {
    it('should be invalid when disposition is undefined', () => {
      const stamp = new Stamp({});

      expect(stamp.getFormattedValidationErrors()).toMatchObject({
        disposition: 'Enter a disposition',
      });
    });

    it('should be invalid when date is in the past', () => {
      const stamp = new Stamp({
        date: '08/08/21',
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
        date: '12/05/55',
        disposition: MOTION_DISPOSITIONS.GRANTED,
        dueDateMessage: 'something',
      });

      expect(stamp.getFormattedValidationErrors()).toBeNull();
    });

    it('should be valid when date is today', () => {
      const mockToday = formatNow(FORMATS.MMDDYY);

      const stamp = new Stamp({
        date: mockToday,
        disposition: MOTION_DISPOSITIONS.GRANTED,
        dueDateMessage: 'something',
      });

      expect(stamp.getFormattedValidationErrors()).toBeNull();
    });
  });
});
