const {
  AddPetitionerCounselFactory,
} = require('./AddPetitionerCounselFactory');
const { SERVICE_INDICATOR_TYPES } = require('../EntityConstants');

const errorMessages = AddPetitionerCounselFactory.VALIDATION_ERROR_MESSAGES;

describe('AddPetitionerCounselFactory', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const entity = AddPetitionerCounselFactory.get({});
      expect(entity.getFormattedValidationErrors()).toEqual({
        representingPrimary: errorMessages.representingPrimary,
        serviceIndicator: errorMessages.serviceIndicator[1],
        user: errorMessages.user,
      });
    });

    it('should be valid when all fields are present', () => {
      const entity = AddPetitionerCounselFactory.get({
        representingPrimary: true,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        user: { userId: '02323349-87fe-4d29-91fe-8dd6916d2fda' },
      });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });

    it('should not be valid if representingPrimary is false and representingSecondary is not present', () => {
      const entity = AddPetitionerCounselFactory.get({
        representingPrimary: false,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        user: { userId: '02323349-87fe-4d29-91fe-8dd6916d2fda' },
      });
      expect(entity.getFormattedValidationErrors()).toEqual({
        representingPrimary: errorMessages.representingPrimary,
      });
    });

    it('should not be valid if no email is given and the service preference is electronic', () => {
      const entity = AddPetitionerCounselFactory.get({
        representingPrimary: true,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        user: { userId: '02323349-87fe-4d29-91fe-8dd6916d2fda' },
      });
      expect(entity.getFormattedValidationErrors()).toEqual({
        serviceIndicator: errorMessages.serviceIndicator[0].message,
      });
    });
  });
});
