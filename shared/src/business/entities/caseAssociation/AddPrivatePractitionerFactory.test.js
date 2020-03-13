const {
  AddPrivatePractitionerFactory,
} = require('./AddPrivatePractitionerFactory');

const errorMessages = AddPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES;

describe('AddPrivatePractitionerFactory', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const entity = AddPrivatePractitionerFactory.get({});
      expect(entity.getFormattedValidationErrors()).toEqual({
        representingPrimary: errorMessages.representingPrimary,
        user: errorMessages.user,
      });
    });

    it('should be valid when all fields are present', () => {
      const entity = AddPrivatePractitionerFactory.get({
        representingPrimary: true,
        user: { userId: 'abc' },
      });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });

    it('should not be valid if representingPrimary is false and representingSecondary is not present', () => {
      const entity = AddPrivatePractitionerFactory.get({
        representingPrimary: false,
        user: { userId: 'abc' },
      });
      expect(entity.getFormattedValidationErrors()).toEqual({
        representingPrimary: errorMessages.representingPrimary,
      });
    });
  });
});
