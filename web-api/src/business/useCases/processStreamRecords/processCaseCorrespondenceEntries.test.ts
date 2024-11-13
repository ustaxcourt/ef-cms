import '@web-api/persistence/postgres/caseCorrespondences/mocks.jest';
import { processCaseCorrespondenceEntries } from '@web-api/business/useCases/processStreamRecords/processCaseCorrespondenceEntries';
import { upsertCaseCorrespondences } from '@web-api/persistence/postgres/caseCorrespondences/upsertCaseCorrespondences';

describe('processCaseCorrespondenceEntries', () => {
  beforeEach(() => {
    (upsertCaseCorrespondences as jest.Mock).mockResolvedValue(undefined);
  });

  it('should attempt to store case correspondences using the upsert method', async () => {
    const mockDynamoCaseCorrespondence = {
      dynamodb: {
        NewImage: {
          docketNumber: {
            S: '123-45',
          },
          entityName: {
            S: 'CaseCorrespondence',
          },
        },
      },
    };

    await processCaseCorrespondenceEntries({
      caseCorrespondenceRecords: [mockDynamoCaseCorrespondence],
    });

    expect(upsertCaseCorrespondences).toHaveBeenCalled();
  });
});
