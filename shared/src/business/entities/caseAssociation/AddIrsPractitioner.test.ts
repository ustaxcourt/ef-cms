import { AddIrsPractitioner } from './AddIrsPractitioner';
import { SERVICE_INDICATOR_TYPES } from '../EntityConstants';

describe('AddIrsPractitioner', () => {
  describe('validation', () => {
    it('should return expected error messages when required fields are missing', () => {
      const entity = new AddIrsPractitioner({});

      expect(entity.getFormattedValidationErrors()).toEqual({
        serviceIndicator: 'Select service type',
        user: 'Select a respondent counsel',
      });
    });

    it('should not return any validation errors when all required fields are provided', () => {
      const entity = new AddIrsPractitioner({
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        user: { userId: '02323349-87fe-4d29-91fe-8dd6916d2fda' },
      });

      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });

    it('should not be valid if no email is given and the service preference is electronic', () => {
      const entity = new AddIrsPractitioner({
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
        user: { userId: '02323349-87fe-4d29-91fe-8dd6916d2fda' },
      });

      expect(entity.getFormattedValidationErrors()).toEqual({
        serviceIndicator:
          'No email found for electronic service. Select a valid service preference.',
      });
    });
  });
});
