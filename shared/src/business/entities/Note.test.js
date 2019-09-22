const { Note } = require('./Note');

const { VALIDATION_ERROR_MESSAGES } = Note;

describe('Note', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const entity = new Note({});
      expect(entity.getFormattedValidationErrors()).toEqual({
        notes: VALIDATION_ERROR_MESSAGES.notes,
      });
    });

    it('should be valid when all fields are present', () => {
      const entity = new Note({
        notes: 'some notes',
      });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
