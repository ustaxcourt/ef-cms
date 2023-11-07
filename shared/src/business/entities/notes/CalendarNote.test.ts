import { CalendarNote } from './CalendarNote';
import { getTextByCount } from '@shared/business/utilities/getTextByCount';

describe('CalendarNote', () => {
  describe('validation', () => {
    it('should have validation rules', () => {
      const entity = new CalendarNote({ note: '' });
      expect(entity.getValidationRules()).not.toEqual(null);
    });

    it('should have not have any error messages for note field longer than 200 characters', () => {
      const entity = new CalendarNote({ note: getTextByCount(1001) });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });

    it('should be valid when all fields are present', () => {
      const entity = new CalendarNote({
        note: '  some notes   ', // with spaces all around it
      });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
      expect(entity.note).toEqual('some notes');
    });

    it('should be valid note if it is an empty string', () => {
      const entity = new CalendarNote({
        note: '',
      });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
      expect(entity.note).toEqual('');
    });
  });
});
