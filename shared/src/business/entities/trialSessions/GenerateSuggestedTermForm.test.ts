import { GenerateSuggestedTermForm } from './GenerateSuggestedTermForm';

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
  });
});
