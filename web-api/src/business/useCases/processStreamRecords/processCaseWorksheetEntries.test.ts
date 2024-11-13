import '@web-api/persistence/postgres/caseWorksheets/mocks.jest';
import { processCaseWorksheetEntries } from '@web-api/business/useCases/processStreamRecords/processCaseWorksheetEntries';
import { upsertCaseWorksheets } from '@web-api/persistence/postgres/caseWorksheets/upsertCaseWorksheets';
describe('processCaseWorksheetEntries', () => {
  beforeEach(() => {
    (upsertCaseWorksheets as jest.Mock).mockResolvedValue(undefined);
  });

  it('should attempt to store case worksheets using the upsert method', async () => {
    const mockDynamoCaseWorksheets = {
      dynamodb: {
        NewImage: {
          docketNumber: {
            S: '123-45',
          },
          entityName: {
            S: 'CaseWorksheet',
          },
        },
      },
    };

    await processCaseWorksheetEntries({
      caseWorksheetRecords: [mockDynamoCaseWorksheets],
    });

    expect(upsertCaseWorksheets).toHaveBeenCalled();
  });
});
