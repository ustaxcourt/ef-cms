import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import { processCaseDeadlineEntries } from '@web-api/business/useCases/processStreamRecords/processCaseDeadlineEntries';
import { upsertCaseDeadlines } from '@web-api/persistence/postgres/caseDeadlines/upsertCaseDeadlines';

describe('processCaseDeadlineEntries', () => {
  beforeEach(() => {
    (upsertCaseDeadlines as jest.Mock).mockResolvedValue(undefined);
  });

  it('should attempt to store case deadlines using the upsert method', async () => {
    const mockDynamoCaseDeadlines = {
      dynamodb: {
        NewImage: {
          docketNumber: {
            S: '123-45',
          },
          entityName: {
            S: 'CaseDeadline',
          },
        },
      },
    };

    await processCaseDeadlineEntries({
      caseDeadlineRecords: [mockDynamoCaseDeadlines],
    });

    expect(upsertCaseDeadlines).toHaveBeenCalled();
  });
});
