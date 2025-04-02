import {
  getBusinessDateInFuture,
  FORMATS,
  createISODateString,
} from '@shared/business/utilities/DateHandler';
import { GenerateSuggestedTermModal } from './GenerateSuggestedTermModal';
import { yesterdayFormatted } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';

describe('GenerateSuggestedTermModal', () => {
  const termEndDate = getBusinessDateInFuture({
    numberOfDays: 360,
    outputFormat: FORMATS.MMDDYYYY,
    startDate: createISODateString(),
  });

  const termStartDate = getBusinessDateInFuture({
    numberOfDays: 1,
    outputFormat: FORMATS.MMDDYYYY,
    startDate: createISODateString(),
  });

  describe('validation', () => {
    it('should pass validation when all required fields are valid', () => {
      const formEntity = new GenerateSuggestedTermModal({
        termEndDate,
        termName: 'Test Term',
        termStartDate,
      });

      expect(formEntity.isValid()).toBeTruthy();
    });

    it('should fail validation when one or more fields is not provided', () => {
      const formEntity = new GenerateSuggestedTermModal({});

      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getFormattedValidationErrors()).toEqual({
        termEndDate: 'Enter date in format MM/DD/YYYY.',
        termName: 'Enter a term name',
        termStartDate: 'Enter date in format MM/DD/YYYY.',
      });
    });

    it('should fail validation when end date is prior to start date', () => {
      const formEntity = new GenerateSuggestedTermModal({
        termEndDate: termStartDate,
        termName: 'Test Term',
        termStartDate: termEndDate,
      });

      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getFormattedValidationErrors()).toEqual({
        termEndDate:
          'End date cannot be prior to start date. Enter a valid end date.',
      });
    });

    it('should fail validation when start date is in the past', () => {
      const formEntity = new GenerateSuggestedTermModal({
        termEndDate,
        termName: 'Test Term',
        termStartDate: yesterdayFormatted,
      });

      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getFormattedValidationErrors()).toEqual({
        termStartDate: 'Start date cannot be in the past. Enter a valid date.',
      });
    });

    it('should fail validation when term name is longer than 100 characters', () => {
      const formEntity = new GenerateSuggestedTermModal({
        termEndDate,
        termName:
          'I woke up this morning and shot an elephant in my pajamas; how he got in my pajamas I`ll never know. Here are some more characters to make this string particularly long.',
        termStartDate,
      });

      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getFormattedValidationErrors()).toEqual({
        termName: 'Term name must be 100 characters or fewer.',
      });
    });

    it('should fail validation when end date is in the past', () => {
      const formEntity = new GenerateSuggestedTermModal({
        termEndDate: yesterdayFormatted,
        termName: 'Test Term',
        termStartDate,
      });

      expect(formEntity.isValid()).toBeFalsy();
      expect(formEntity.getFormattedValidationErrors()).toEqual({
        termEndDate: 'End date cannot be in the past. Enter a valid date.',
      });
    });
  });
});
