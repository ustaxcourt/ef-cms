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
        user: { userId: '02323349-87fe-4d29-91fe-8dd6916d2fda' },
      });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });

    it('should not be valid if representingPrimary is false and representingSecondary is not present', () => {
      const entity = AddPrivatePractitionerFactory.get({
        representingPrimary: false,
        user: { userId: '02323349-87fe-4d29-91fe-8dd6916d2fda' },
      });
      expect(entity.getFormattedValidationErrors()).toEqual({
        representingPrimary: errorMessages.representingPrimary,
      });
    });
  });
});
