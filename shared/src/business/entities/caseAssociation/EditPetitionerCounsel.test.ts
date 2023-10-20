import { EditPetitionerCounsel } from './EditPetitionerCounsel';
import { extractCustomMessages } from '@shared/business/entities/utilities/extractCustomMessages';

describe('EditPetitionerCounsel', () => {
  describe('validation', () => {
    it('should have error messages for missing fields', () => {
      const entity = new EditPetitionerCounsel({});
      const customMessages = extractCustomMessages(entity.getValidationRules());
      expect(entity.getFormattedValidationErrors()).toEqual({
        representing: customMessages.representing[0],
      });
    });

    it('should be valid if either representing has at least one entry', () => {
      const entity = new EditPetitionerCounsel({
        representing: ['02323349-87fe-4d29-91fe-8dd6916d2fda'],
      });

      expect(entity.getFormattedValidationErrors()).toEqual(null);
    });

    it('should not be valid if representing is empty', () => {
      const entity = new EditPetitionerCounsel({
        representing: [],
      });
      const customMessages = extractCustomMessages(entity.getValidationRules());
      expect(entity.getFormattedValidationErrors()).toEqual({
        representing: customMessages.representing[0],
      });
    });
  });
});
