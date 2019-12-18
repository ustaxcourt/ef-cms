const { JudgesCaseNote } = require('./JudgesCaseNote');

const errorMessages = JudgesCaseNote.VALIDATION_ERROR_MESSAGES;

describe('JudgesCaseNote', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const entity = new JudgesCaseNote({});
      expect(entity.getFormattedValidationErrors()).toEqual({
        caseId: '"caseId" is required',
        notes: errorMessages.notes,
        userId: '"userId" is required',
      });
    });
    it('should be valid when all fields are present', () => {
      const entity = new JudgesCaseNote({
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        notes: 'some notes',
        userId: 'b7d90c05-f6cd-442c-a168-202db587f16f',
      });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
