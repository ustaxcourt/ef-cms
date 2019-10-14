const { EditPractitionerFactory } = require('./EditPractitionerFactory');

const errorMessages = EditPractitionerFactory.VALIDATION_ERROR_MESSAGES;

describe('EditPractitionerFactory', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const entity = EditPractitionerFactory.get({});
      expect(entity.getFormattedValidationErrors()).toEqual({
        representingPrimary: errorMessages.representingPrimary,
      });
    });

    it('should be valid if either representingPrimary or representingSecondary is present and true', () => {
      let entity = EditPractitionerFactory.get({
        representingPrimary: true,
      });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
      entity = EditPractitionerFactory.get({
        representingSecondary: true,
      });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });

    it('should not be valid if representingPrimary is false and representingSecondary is not present', () => {
      const entity = EditPractitionerFactory.get({
        representingPrimary: false,
      });
      expect(entity.getFormattedValidationErrors()).toEqual({
        representingPrimary: errorMessages.representingPrimary,
      });
    });
  });
});
