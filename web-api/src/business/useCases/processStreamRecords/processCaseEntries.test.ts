import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCaseMetadataWithCounsel as getCaseMetadataWithCounselMock } from '@web-api/persistence/postgres/cases/getCaseMetadataWithCounsel';
import { processCaseEntries } from './processCaseEntries';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
jest.mock('@web-api/persistence/postgres/cases/upsertCases');

describe('processCaseEntries', () => {
  const getCaseMetadataWithCounsel =
    getCaseMetadataWithCounselMock as jest.Mock;
  const mockCaseRecord = {
    dynamodb: {
      NewImage: {
        docketNumber: {
          S: '123-45',
        },
        entityName: {
          S: 'Case',
        },
        pk: {
          S: 'case|123-45',
        },
        sk: {
          S: 'case|123-45',
        },
      },
    },
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .bulkIndexRecords.mockReturnValue({ failedRecords: [] });

    getCaseMetadataWithCounsel.mockReturnValue(mockCaseRecord);

    (upsertCases as jest.Mock).mockResolvedValue(undefined);
  });

  it('should do nothing when no case records are found', async () => {
    await processCaseEntries({
      applicationContext,
      caseEntityRecords: [],
    });

    expect(
      applicationContext.getPersistenceGateway().bulkIndexRecords,
    ).not.toHaveBeenCalled();
  });

  it('should make a call to fetch the full case record with counsel from persistence', async () => {
    await processCaseEntries({
      applicationContext,
      caseEntityRecords: [mockCaseRecord],
    });

    expect(getCaseMetadataWithCounsel.mock.calls[0][0]).toMatchObject({
      docketNumber: mockCaseRecord.dynamodb.NewImage.docketNumber.S,
    });
  });

  it('should index the provided case record', async () => {
    await processCaseEntries({
      applicationContext,
      caseEntityRecords: [mockCaseRecord],
    });

    expect(upsertCases).toHaveBeenCalledWith([mockCaseRecord]);
  });
});
