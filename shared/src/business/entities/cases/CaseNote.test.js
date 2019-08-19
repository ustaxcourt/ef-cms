const { CaseNote } = require('./CaseNote');

describe('CaseNote', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const entity = new CaseNote({});
      expect(entity.getFormattedValidationErrors()).toEqual({
        notes: 'Notes can not be empty.',
      });
    });

    it('should be valid when all fields are present', () => {
      const entity = new CaseNote({ notes: 'some notes' });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
