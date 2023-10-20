import { UserCaseNote } from './UserCaseNote';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';

describe('UserCaseNote', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const entity = new UserCaseNote({});
      const customMessages = extractCustomMessages(entity.getValidationRules());

      expect(entity.getFormattedValidationErrors()).toEqual({
        docketNumber: '"docketNumber" is required',
        notes: customMessages.notes[0],
        userId: '"userId" is required',
      });
    });

    it('should be valid when all fields are present', () => {
      const entity = new UserCaseNote({
        docketNumber: '123-45',
        notes: 'some notes',
        userId: 'b7d90c05-f6cd-442c-a168-202db587f16f',
      });

      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
