jest.mock(
  '@web-api/business/useCases/processStreamRecords/getCaseDataFromDynamo',
);
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/practitioners/mocks.jest';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { processPractitionerMappingEntries } from '@web-api/business/useCases/processStreamRecords/processPractitionerMappingEntries';
import { getCaseMetadataWithCounsel as getCaseMetadataWithCounselMock } from '@web-api/persistence/postgres/cases/getCaseMetadataWithCounsel';
import { getCaseDataFromDynamo as getCaseDataFromDynamoMock } from '@web-api/business/useCases/processStreamRecords/getCaseDataFromDynamo';
import { upsertPractitionerRecords as upsertPractitionerRecordsMock } from '@web-api/persistence/postgres/practitioners/upsertPractitionerRecords';

const getCaseMetadataWithCounsel = jest.mocked(getCaseMetadataWithCounselMock);
const getCaseDataFromDynamo = jest.mocked(getCaseDataFromDynamoMock);
const upsertPractitionerRecords = upsertPractitionerRecordsMock as jest.Mock;

describe('processPractitionerMappingEntries', () => {
  const mockCaseRecord = {
    dynamodb: {
      NewImage: {
        docketNumber: { S: '123-45' },
        entityName: { S: 'Case' },
        pk: { S: 'case|123-45' },
        sk: { S: 'case|123-45' },
      },
    },
  };

  const mockModifyIrsPractitionerMappingRecord = {
    dynamodb: {
      NewImage: {
        entityName: { S: 'IrsPractitioner' },
        pk: { S: 'case|123-45' },
        sk: { S: 'irsPractitioner|PT1234' },
      },
    },
    eventName: 'MODIFY',
  };

  const mockModifyPrivatePractitionerMappingRecord = {
    dynamodb: {
      NewImage: {
        entityName: { S: 'PrivatePractitioner' },
        pk: { S: 'case|123-45' },
        sk: { S: 'privatePractitioner|PT1234' },
      },
    },
    eventName: 'MODIFY',
  };

  const mockPractitionerMappingEntries = [
    mockModifyIrsPractitionerMappingRecord,
    mockModifyPrivatePractitionerMappingRecord,
  ];

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .bulkIndexRecords.mockReturnValue({ failedRecords: [] });

    upsertPractitionerRecords.mockResolvedValue(() => {});
  });

  it('should do nothing when no practitioner mapping records are found', async () => {
    await processPractitionerMappingEntries({
      applicationContext,
      practitionerMappingRecords: [],
    });

    expect(getCaseMetadataWithCounsel).not.toHaveBeenCalled();
  });

  it('should retrieve and index each case for each provided practitioner mapping record', async () => {
    const docketNumberInPractitionerMapping =
      mockModifyIrsPractitionerMappingRecord.dynamodb.NewImage.pk.S.split(
        '|',
      )[1];

    getCaseMetadataWithCounsel.mockResolvedValue(mockCaseRecord as any);

    await processPractitionerMappingEntries({
      applicationContext,
      practitionerMappingRecords: mockPractitionerMappingEntries,
    });

    expect(getCaseMetadataWithCounsel).toHaveBeenCalledTimes(
      mockPractitionerMappingEntries.length,
    );
    expect(getCaseMetadataWithCounsel.mock.calls[0][0].docketNumber).toEqual(
      docketNumberInPractitionerMapping,
    );
    expect(
      applicationContext.getPersistenceGateway().bulkIndexRecords,
    ).toHaveBeenCalled();
  });

  it('should fallback to dynamo when case is not found in postgres during re-indexing', async () => {
    getCaseMetadataWithCounsel.mockRejectedValue({});
    getCaseDataFromDynamo.mockResolvedValue({});

    await processPractitionerMappingEntries({
      applicationContext,
      practitionerMappingRecords: mockPractitionerMappingEntries,
    });

    expect(getCaseDataFromDynamo).toHaveBeenCalledTimes(
      mockPractitionerMappingEntries.length,
    );
  });
});
