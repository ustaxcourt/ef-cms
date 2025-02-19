import '@web-api/persistence/postgres/cases/mocks.jest';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import * as practitionerModule from './processPractitionerMappingEntries';
const { processPractitionerMappingEntries } = practitionerModule;

import { getCaseMetadataWithCounsel as getCaseMetadataWithCounselMock } from '@web-api/persistence/postgres/cases/getCaseMetadataWithCounsel';
const getCaseMetadataWithCounsel = getCaseMetadataWithCounselMock as jest.Mock;

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

    getCaseMetadataWithCounsel.mockResolvedValue(mockCaseRecord);

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

  it('should log an error and throw an exception when bulk index returns failed records', async () => {
    getCaseMetadataWithCounsel.mockResolvedValue(mockCaseRecord);

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

  it('should fallback to dynamo when case is not found in postgres during re-indexing', async () => {
    jest
      .spyOn(practitionerModule, 'getCaseDataFromDynamo')
      .mockResolvedValue({});

    getCaseMetadataWithCounsel.mockRejectedValue({});

    await processPractitionerMappingEntries({
      applicationContext,
      practitionerMappingRecords: mockPractitionerMappingEntries,
    });

    expect(practitionerModule.getCaseDataFromDynamo).toHaveBeenCalledTimes(
      mockPractitionerMappingEntries.length,
    );
  });
});
