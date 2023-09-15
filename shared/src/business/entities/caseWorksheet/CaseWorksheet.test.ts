import { CaseWorksheet } from './CaseWorksheet';

describe('CaseWorksheet', () => {
  describe('validation', () => {
    it('should be invalid when the primary issue is not a string', () => {
      const worksheet = new CaseWorksheet({
        primaryIssue: 1234567890,
      });

      expect(worksheet.getFormattedValidationErrors()!.primaryIssue).toEqual(
        'Add primary issue',
      );
    });

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

  describe('deletePrimaryIssue', () => {
    it('should delete the primary issue when deletePrimaryIssue method is called', () => {
      const worksheet = new CaseWorksheet({
        primaryIssue: 'TEST_PRIMARY_ISSUE',
      });

      expect(worksheet.primaryIssue).toBeDefined();

      worksheet.deletePrimaryIssue();

      expect(worksheet.primaryIssue).toBeUndefined();
    });
  });
});
