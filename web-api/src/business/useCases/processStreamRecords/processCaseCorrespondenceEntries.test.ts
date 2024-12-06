import '@web-api/persistence/postgres/caseCorrespondences/mocks.jest';
import { processCaseCorrespondenceEntries } from '@web-api/business/useCases/processStreamRecords/processCaseCorrespondenceEntries';
import { upsertCaseCorrespondences } from '@web-api/persistence/postgres/caseCorrespondences/upsertCaseCorrespondences';

describe('processCaseCorrespondenceEntries', () => {
  const docketNumber = '103-19';

  beforeEach(() => {
    (upsertCaseCorrespondences as jest.Mock).mockResolvedValue(undefined);
  });

  it('should attempt to store case correspondences using the upsert method', async () => {
    const mockDynamoCaseCorrespondence = {
      dynamodb: {
        NewImage: {
          entityName: {
            S: 'Correspondence',
          },
          pk: {
            S: `case|${docketNumber}`,
          },
        },
      },
    };

    await processCaseCorrespondenceEntries({
      caseCorrespondenceRecords: [mockDynamoCaseCorrespondence],
    });

    expect(upsertCaseCorrespondences).toHaveBeenCalledWith([
      {
        docketNumber,
        entityName: 'Correspondence',
        pk: `case|${docketNumber}`,
      },
    ]);
  });
});
