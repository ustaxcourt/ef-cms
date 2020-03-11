const {
  EditPrivatePractitionerFactory,
} = require('./EditPrivatePractitionerFactory');

const errorMessages = EditPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES;

describe('EditPrivatePractitionerFactory', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const entity = EditPrivatePractitionerFactory.get({});
      expect(entity.getFormattedValidationErrors()).toEqual({
        representingPrimary: errorMessages.representingPrimary,
      });
    });

    it('should be valid if either representingPrimary or representingSecondary is present and true', () => {
      let entity = EditPrivatePractitionerFactory.get({
        representingPrimary: true,
      });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
      entity = EditPrivatePractitionerFactory.get({
        representingSecondary: true,
      });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });

    it('should not be valid if representingPrimary is false and representingSecondary is not present', () => {
      const entity = EditPrivatePractitionerFactory.get({
        representingPrimary: false,
      });
      expect(entity.getFormattedValidationErrors()).toEqual({
        representingPrimary: errorMessages.representingPrimary,
      });
    });
  });
});
