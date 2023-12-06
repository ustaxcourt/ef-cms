import { UserCaseNote } from './UserCaseNote';

describe('UserCaseNote', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const entity = new UserCaseNote({});

      expect(entity.getFormattedValidationErrors()).toEqual({
        docketNumber: '"docketNumber" is required',
        notes: 'Add note',
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
