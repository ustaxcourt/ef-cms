import { CaseWorksheet, RawCaseWorksheet } from './CaseWorksheet';

describe('CaseWorksheet', () => {
  describe('validation', () => {
    const VALID_ENTITY_DATA: RawCaseWorksheet = {
      docketNumber: '101-26',
      finalBriefDueDate: '2023-07-29T04:00:00.000Z',
      primaryIssue: 'SOME PRIMARY ISSUE',
      statusOfMatter: 'Awaiting Consideration',
      judgeUserId: '208a959f-9526-4db5-b262-e58c476a4604',
    };

    it('should create a valid entity', () => {
      const worksheet = new CaseWorksheet(VALID_ENTITY_DATA);
      expect(worksheet.getFormattedValidationErrors()).toEqual(null);
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
});
