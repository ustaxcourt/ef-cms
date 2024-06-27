import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { processPractitionerMappingEntries } from './processPractitionerMappingEntries';

describe('processPractitionerMappingEntries', () => {
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

  const mockModifyIrsPractitionerMappingRecord = {
    dynamodb: {
      NewImage: {
        entityName: {
          S: 'IrsPractitioner',
        },
        pk: {
          S: 'case|123-45',
        },
        sk: {
          S: 'irsPractitioner|PT1234',
        },
      },
    },
    eventName: 'MODIFY',
  };

  const mockModifyPrivatePractitionerMappingRecord = {
    dynamodb: {
      NewImage: {
        entityName: {
          S: 'PrivatePractitioner',
        },
        pk: {
          S: 'case|123-45',
        },
        sk: {
          S: 'privatePractitioner|PT1234',
        },
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
  });

  it('should do nothing when no practitioner mapping records are found', async () => {
    await processPractitionerMappingEntries({
      applicationContext,
      practitionerMappingRecords: [],
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseMetadataWithCounsel,
    ).not.toHaveBeenCalled();
  });

  it('should retrieve and index each case for each provided practitioner mapping record', async () => {
    const docketNumberInPractitionerMapping =
      mockModifyIrsPractitionerMappingRecord.dynamodb.NewImage.pk.S.split(
        '|',
      )[1];

    applicationContext
      .getPersistenceGateway()
      .getCaseMetadataWithCounsel.mockReturnValue(mockCaseRecord);

    await processPractitionerMappingEntries({
      applicationContext,
      practitionerMappingRecords: mockPractitionerMappingEntries,
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseMetadataWithCounsel,
    ).toHaveBeenCalledTimes(mockPractitionerMappingEntries.length);
    expect(
      applicationContext.getPersistenceGateway().getCaseMetadataWithCounsel.mock
        .calls[0][0].docketNumber,
    ).toEqual(docketNumberInPractitionerMapping);
    expect(
      applicationContext.getPersistenceGateway().bulkIndexRecords,
    ).toHaveBeenCalled();
  });

  it('should log an error and throw an exception when bulk index returns failed records', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseMetadataWithCounsel.mockReturnValue(mockCaseRecord);

    applicationContext
      .getPersistenceGateway()
      .bulkIndexRecords.mockReturnValueOnce({
        failedRecords: [{ id: 'failed record' }],
      });

    await expect(
      processPractitionerMappingEntries({
        applicationContext,
        practitionerMappingRecords: mockPractitionerMappingEntries,
      }),
    ).rejects.toThrow('failed to index practitioner mapping records');

    expect(applicationContext.logger.error).toHaveBeenCalled();
  });
});
