import { Note } from './Note';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';

describe('Note', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      // typing arguments of Note as any to avoid ts errors
      const notesConfiguration: any = {};
      const entity = new Note(notesConfiguration);
      const customMessages = extractCustomMessages(entity.getValidationRules());

      expect(entity.getFormattedValidationErrors()).toEqual({
        notes: customMessages.notes[0],
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
