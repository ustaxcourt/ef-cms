const {
  EditPetitionerCounselFactory,
} = require('./EditPetitionerCounselFactory');

const errorMessages = EditPetitionerCounselFactory.VALIDATION_ERROR_MESSAGES;

describe('EditPetitionerCounselFactory', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const entity = EditPetitionerCounselFactory.get({});
      expect(entity.getFormattedValidationErrors()).toEqual({
        representingPrimary: errorMessages.representingPrimary,
      });
    });

    it('should be valid if either representingPrimary or representingSecondary is present and true', () => {
      let entity = EditPetitionerCounselFactory.get({
        representingPrimary: true,
      });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
      entity = EditPetitionerCounselFactory.get({
        representingSecondary: true,
      });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });

    it('should not be valid if representingPrimary is false and representingSecondary is not present', () => {
      const entity = EditPetitionerCounselFactory.get({
        representingPrimary: false,
      });
      expect(entity.getFormattedValidationErrors()).toEqual({
        representingPrimary: errorMessages.representingPrimary,
      });
    });
  });
});
