const { AddPractitionerFactory } = require('./AddPractitionerFactory');

const errorMessages = AddPractitionerFactory.VALIDATION_ERROR_MESSAGES;

describe('AddPractitioner', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const entity = AddPractitionerFactory.get({});
      expect(entity.getFormattedValidationErrors()).toEqual({
        representingPrimary: errorMessages.representingPrimary,
        user: errorMessages.user,
      });
    });

    it('should be valid when all fields are present', () => {
      const entity = AddPractitionerFactory.get({
        representingPrimary: true,
        user: { userId: 'abc' },
      });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });

    it('should not be valid if representingPrimary is false and representingSecondary is not present', () => {
      const entity = AddPractitionerFactory.get({
        representingPrimary: false,
        user: { userId: 'abc' },
      });
      expect(entity.getFormattedValidationErrors()).toEqual({
        representingPrimary: errorMessages.representingPrimary,
      });
    });
  });
});
