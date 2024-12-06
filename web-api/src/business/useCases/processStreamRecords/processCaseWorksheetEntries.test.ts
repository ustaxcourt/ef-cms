import '@web-api/persistence/postgres/caseWorksheets/mocks.jest';
import { processCaseWorksheetEntries } from '@web-api/business/useCases/processStreamRecords/processCaseWorksheetEntries';
import { upsertCaseWorksheets } from '@web-api/persistence/postgres/caseWorksheets/upsertCaseWorksheets';
describe('processCaseWorksheetEntries', () => {
  const judgeUserId = 'dabbad00-18d0-43ec-bafb-654e83405416';

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
          gsi1pk: {
            S: `judge-case-worksheet|${judgeUserId}`,
          },
        },
      },
    };

    await processCaseWorksheetEntries({
      caseWorksheetRecords: [mockDynamoCaseWorksheets],
    });

    expect(upsertCaseWorksheets).toHaveBeenCalledWith([
      {
        docketNumber: '123-45',
        entityName: 'CaseWorksheet',
        gsi1pk: `judge-case-worksheet|${judgeUserId}`,
        judgeUserId: `${judgeUserId}`,
      },
    ]);
  });
});
