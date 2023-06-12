import { AddPrivatePractitionerFactory } from './AddPrivatePractitionerFactory';
import { SERVICE_INDICATOR_TYPES } from '../EntityConstants';

describe('AddPrivatePractitionerFactory', () => {
  describe('validation', () => {
    const mockContactId = '98cda707-1029-463c-8a3e-e03393019daf';

    it('should have error messages for missing fields', () => {
      const entity = new AddPrivatePractitionerFactory({});

      expect(entity.getFormattedValidationErrors()).toEqual({
        representing:
          AddPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES.representing,
        serviceIndicator:
          AddPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES
            .serviceIndicator[1],
        user: AddPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES.user,
      });
    });

    it('should be valid when all fields are present', () => {
      const entity = new AddPrivatePractitionerFactory({
        representing: [mockContactId],
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        user: { userId: '02323349-87fe-4d29-91fe-8dd6916d2fda' },
      });

      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });

    it('should not be valid if representing is empty', () => {
      const entity = new AddPrivatePractitionerFactory({
        representing: [],
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        user: { userId: '02323349-87fe-4d29-91fe-8dd6916d2fda' },
      });

      expect(entity.getFormattedValidationErrors()).toEqual({
        representing:
          AddPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES.representing,
      });
    });

    it('should not be valid if no email is given and the service preference is electronic', () => {
      const entity = new AddPrivatePractitionerFactory({
        representing: [mockContactId],
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        user: { userId: '02323349-87fe-4d29-91fe-8dd6916d2fda' },
      });

      expect(entity.getFormattedValidationErrors()).toEqual({
        serviceIndicator:
          AddPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES
            .serviceIndicator[0].message,
      });
    });
  });
});
