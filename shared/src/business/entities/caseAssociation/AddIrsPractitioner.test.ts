import { AddIrsPractitioner } from './AddIrsPractitioner';
import { SERVICE_INDICATOR_TYPES } from '../EntityConstants';

describe('AddIrsPractitioner', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const entity = new AddIrsPractitioner({});

      expect(entity.getFormattedValidationErrors()).toEqual({
        serviceIndicator:
          AddIrsPractitioner.VALIDATION_ERROR_MESSAGES.serviceIndicator[1],
        user: AddIrsPractitioner.VALIDATION_ERROR_MESSAGES.user,
      });
    });

    it('should be valid when all fields are present', () => {
      const entity = new AddIrsPractitioner({
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        user: { userId: '02323349-87fe-4d29-91fe-8dd6916d2fda' },
      });

      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });
  });

  it('should not be valid if no email is given and the service preference is electronic', () => {
    const entity = new AddIrsPractitioner({
      serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
      user: { userId: '02323349-87fe-4d29-91fe-8dd6916d2fda' },
    });

    expect(entity.getFormattedValidationErrors()).toEqual({
      serviceIndicator:
        AddIrsPractitioner.VALIDATION_ERROR_MESSAGES.serviceIndicator[0]
          .message,
    });
  });
});
