const { AddIrsPractitioner } = require('./AddIrsPractitioner');

describe('AddIrsPractitioner', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const entity = new AddIrsPractitioner({});
      expect(entity.getFormattedValidationErrors()).toEqual({
        user: AddIrsPractitioner.VALIDATION_ERROR_MESSAGES.user,
      });
    });

    it('should be valid when all fields are present', () => {
      const entity = new AddIrsPractitioner({
        user: { userId: '02323349-87fe-4d29-91fe-8dd6916d2fda' },
      });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });
  });
});
