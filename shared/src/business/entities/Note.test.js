const { Note } = require('./Note');

describe('Note', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const entity = new Note({});
      expect(entity.getFormattedValidationErrors()).toEqual({
        notes: 'Notes can not be empty.',
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
