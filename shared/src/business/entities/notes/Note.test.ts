import { Note } from './Note';

const { VALIDATION_ERROR_MESSAGES } = Note;

describe('Note', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      // TODO: discuss with team what to do about this

      const entity = new Note({});
      expect(entity.getFormattedValidationErrors()).toEqual({
        notes: VALIDATION_ERROR_MESSAGES.notes,
      });
    });

    it('should be valid when all fields are present', () => {
      const entity = new Note({
        notes: '  some notes   ', // with spaces all around it
      });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
      expect(entity.notes).toEqual('some notes');
    });
  });
});
