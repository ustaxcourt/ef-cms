import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { processCaseEntries } from './processCaseEntries';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
jest.mock('@web-api/persistence/postgres/cases/upsertCases');

describe('processCaseEntries', () => {
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

    applicationContext
      .getPersistenceGateway()
      .getCaseMetadataWithCounsel.mockReturnValue(mockCaseRecord);

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

    expect(
      applicationContext.getPersistenceGateway().getCaseMetadataWithCounsel.mock
        .calls[0][0],
    ).toMatchObject({
      docketNumber: mockCaseRecord.dynamodb.NewImage.docketNumber.S,
    });
  });

  it('should index the provided case record', async () => {
    await processCaseEntries({
      applicationContext,
      caseEntityRecords: [mockCaseRecord],
    });

    const caseRecord =
      applicationContext.getPersistenceGateway().bulkIndexRecords.mock
        .calls[0][0].records[1].dynamodb.NewImage.dynamodb.M.NewImage.M
        .entityName.M.S.S;

    expect(caseRecord).toEqual('Case');
  });

  it('should index a case docket entry mapping record in order to create a parent-child relationship between a case and a docket entry', async () => {
    await processCaseEntries({
      applicationContext,
      caseEntityRecords: [mockCaseRecord],
    });

    const caseDocketEntryMappingRecord =
      applicationContext.getPersistenceGateway().bulkIndexRecords.mock
        .calls[0][0].records[0].dynamodb.NewImage.entityName.S;

    expect(caseDocketEntryMappingRecord).toEqual('CaseDocketEntryMapping');
  });

  it('should index a case message mapping record in order to create a parent-child relationship between a case and a message', async () => {
    await processCaseEntries({
      applicationContext,
      caseEntityRecords: [mockCaseRecord],
    });

    const caseMessageMappingRecord =
      applicationContext.getPersistenceGateway().bulkIndexRecords.mock
        .calls[0][0].records[1].dynamodb.NewImage.entityName.S;

    expect(caseMessageMappingRecord).toEqual('CaseMessageMapping');
  });

  it('should index a case work item mapping record in order to create a parent-child relationship between a case and a work item', async () => {
    await processCaseEntries({
      applicationContext,
      caseEntityRecords: [mockCaseRecord],
    });

    const caseWorkItemMappingRecord =
      applicationContext.getPersistenceGateway().bulkIndexRecords.mock
        .calls[0][0].records[2].dynamodb.NewImage.entityName.S;

    expect(caseWorkItemMappingRecord).toEqual('CaseWorkItemMapping');
  });

  it('should log an error and throw an exception when bulk index returns failed records', async () => {
    applicationContext
      .getPersistenceGateway()
      .bulkIndexRecords.mockReturnValueOnce({
        failedRecords: [{ id: 'failed record' }],
      });

    await expect(
      processCaseEntries({
        applicationContext,
        caseEntityRecords: [mockCaseRecord],
      }),
    ).rejects.toThrow('failed to index case entry');

    expect(applicationContext.logger.error).toHaveBeenCalled();
  });
});
