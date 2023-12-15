import {
  DocketEntryWorksheet,
  RawDocketEntryWorksheet,
} from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';

describe('DocketEntryWorksheet', () => {
  const VALID_ENTITY_DATA: RawDocketEntryWorksheet = {
    docketEntryId: '208a959f-9526-4db5-b262-e58c476a4604',
    finalBriefDueDate: '2023-07-29',
    primaryIssue: 'SOME PRIMARY ISSUE',
    statusOfMatter: 'AwaitingConsideration',
  };

  it('should create a valid Entity', () => {
    const worksheet = new DocketEntryWorksheet(VALID_ENTITY_DATA);
    expect(worksheet.getFormattedValidationErrors()).toEqual(null);
  });

  describe('validation', () => {
    it('should be invalid when the docketEntryId is NOT a UUID', () => {
      const worksheet = new DocketEntryWorksheet({
        docketEntryId: 'NOT UUID',
      });

      expect(worksheet.getFormattedValidationErrors()!.docketEntryId).toEqual(
        '"docketEntryId" must be a valid GUID',
      );
    });

    it('should be invalid when the final brief due date is NOT a date string', () => {
      const worksheet = new DocketEntryWorksheet({
        finalBriefDueDate: 'abcdef',
      });

      expect(
        worksheet.getFormattedValidationErrors()!.finalBriefDueDate,
      ).toEqual('Enter a valid due date');
    });

    it('should be invalid when the status of matter is NOT one of the status of matter options', () => {
      const worksheet = new DocketEntryWorksheet({
        statusOfMatter: 'this_is_not_valid',
      });

      expect(
        worksheet.getFormattedValidationErrors()!.statusOfMatter,
      ).toBeDefined();
    });
  });
});
