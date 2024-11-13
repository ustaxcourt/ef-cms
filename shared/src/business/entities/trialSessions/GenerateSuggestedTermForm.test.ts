import { GenerateSuggestedTermForm } from './GenerateSuggestedTermForm';
import { yesterdayFormatted } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';

describe('GenerateSuggestTermForm', () => {
  describe('validation', () => {
    it('should pass validation when all required fields are valid', () => {
      const formEntity = new GenerateSuggestedTermForm({
        termEndDate: '03/31/2050',
        termName: 'Test Term',
        termStartDate: '01/01/2050',
      });

      expect(formEntity.isValid()).toBeTruthy();
    });

    it('should fail validation when one or more fields is not provided', () => {
      const formEntity = new GenerateSuggestedTermForm({});

      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getFormattedValidationErrors()).toEqual({
        termEndDate: 'Enter date in format MM/DD/YYYY.',
        termName: 'Enter a term name',
        termStartDate: 'Enter date in format MM/DD/YYYY.',
      });
    });

    it('should fail validation when end date is prior to start date', () => {
      const formEntity = new GenerateSuggestedTermForm({
        termEndDate: '01/01/2050',
        termName: 'Test Term',
        termStartDate: '03/31/2050',
      });

      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getFormattedValidationErrors()).toEqual({
        termEndDate:
          'End date cannot be prior to start date. Enter a valid end date.',
      });
    });

    it('should fail validation when start date is in the past', () => {
      const formEntity = new GenerateSuggestedTermForm({
        termEndDate: '01/01/2050',
        termName: 'Test Term',
        termStartDate: yesterdayFormatted,
      });

      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getFormattedValidationErrors()).toEqual({
        termStartDate: 'Start date cannot be in the past. Enter a valid date.',
      });
    });
  });
});
