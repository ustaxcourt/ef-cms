import { RawDocketEntryWorksheet } from '@shared/business/entities/docketEntryWorksheet/DocketEntryWorksheet';
import { validateDocketEntryWorksheetInteractor } from '@shared/business/useCases/pendingMotion/validateDocketEntryWorksheetInteractor';

describe('validateDocketEntryWorksheetInteractor', () => {
  const TEST_DOCKET_ENTRY_ID = '06f60736-5f37-4590-b62a-5c7edf84ffc6';
  const VALID_WORKSHEET: RawDocketEntryWorksheet = {
    docketEntryId: TEST_DOCKET_ENTRY_ID,
    entityName: 'RawDocketEntryWorksheet',
    finalBriefDueDate: '2023-07-29',
    primaryIssue: 'tests primaryIssue',
    statusOfMatter: 'Awaiting Consideration',
  };

  it('should return null when the worksheet passes validation', () => {
    const results = validateDocketEntryWorksheetInteractor({
      docketEntryWorksheet: VALID_WORKSHEET,
    });

    expect(results).toEqual(null);
  });

  it('should return the errors when the worksheet fails validation', () => {
    const results = validateDocketEntryWorksheetInteractor({
      docketEntryWorksheet: {
        ...VALID_WORKSHEET,
        finalBriefDueDate: 'NOT A VALID DATE STRING',
      },
    });

    expect(results).toEqual({ finalBriefDueDate: 'Enter a valid due date' });
  });
});
