const {
  AddPrivatePractitionerFactory,
} = require('./AddPrivatePractitionerFactory');
const { SERVICE_INDICATOR_TYPES } = require('../EntityConstants');

const errorMessages = AddPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES;

describe('AddPrivatePractitionerFactory', () => {
  describe('validation', () => {
    const mockContactId = '98cda707-1029-463c-8a3e-e03393019daf';

    it('should have error messages for missing fields', () => {
      const entity = AddPrivatePractitionerFactory.get({});
      expect(entity.getFormattedValidationErrors()).toEqual({
        representing: errorMessages.representing,
        serviceIndicator: errorMessages.serviceIndicator[1],
        user: errorMessages.user,
      });
    });

    it('should be valid when all fields are present', () => {
      const entity = AddPrivatePractitionerFactory.get({
        representing: [mockContactId],
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        user: { userId: '02323349-87fe-4d29-91fe-8dd6916d2fda' },
      });
      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });

    it('should not be valid if representing is empty', () => {
      const entity = AddPrivatePractitionerFactory.get({
        representing: [],
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        user: { userId: '02323349-87fe-4d29-91fe-8dd6916d2fda' },
      });
      expect(entity.getFormattedValidationErrors()).toEqual({
        representing: errorMessages.representing,
      });
    });

    it('should not be valid if no email is given and the service preference is electronic', () => {
      const entity = AddPrivatePractitionerFactory.get({
        representing: [mockContactId],
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        user: { userId: '02323349-87fe-4d29-91fe-8dd6916d2fda' },
      });
      expect(entity.getFormattedValidationErrors()).toEqual({
        serviceIndicator: errorMessages.serviceIndicator[0].message,
      });
    });
  });
});
