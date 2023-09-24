import { CaseWorksheet } from './CaseWorksheet';

describe('CaseWorksheet', () => {
  describe('validation', () => {
    it('should be invalid when the final brief due date is NOT a date string', () => {
      const worksheet = new CaseWorksheet({
        finalBriefDueDate: 'abcdef',
      });

      expect(
        worksheet.getFormattedValidationErrors()!.finalBriefDueDate,
      ).toEqual('Enter a valid due date');
    });

    it('should be invalid when the status of matter is NOT one of the status of matter options', () => {
      const worksheet = new CaseWorksheet({
        statusOfMatter: 'this_is_not_valid',
      });

      expect(
        worksheet.getFormattedValidationErrors()!.statusOfMatter,
      ).toBeDefined();
    });
  });
});
