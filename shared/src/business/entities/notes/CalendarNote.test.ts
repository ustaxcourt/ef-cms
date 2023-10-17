import { CalendarNote } from './CalendarNote';

describe('CalendarNote', () => {
  describe('validation', () => {
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
