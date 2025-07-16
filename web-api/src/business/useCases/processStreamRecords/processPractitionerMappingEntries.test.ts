import '@web-api/persistence/postgres/cases/mocks.jest';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { processPractitionerMappingEntries } from '@web-api/business/useCases/processStreamRecords/processPractitionerMappingEntries';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';

const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);

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

    expect(getCasesByDocketNumbers).not.toHaveBeenCalled();
  });

  it('should retrieve and index each case for each provided practitioner mapping record', async () => {
    const docketNumberInPractitionerMapping =
      mockModifyIrsPractitionerMappingRecord.dynamodb.NewImage.pk.S.split(
        '|',
      )[1];

    getCasesByDocketNumbers.mockResolvedValue([mockCaseRecord] as any[]);

    await processPractitionerMappingEntries({
      applicationContext,
      practitionerMappingRecords: mockPractitionerMappingEntries,
    });

    expect(getCasesByDocketNumbers).toHaveBeenCalledTimes(
      mockPractitionerMappingEntries.length,
    );
    expect(getCasesByDocketNumbers.mock.calls[0][0].docketNumbers).toEqual([
      docketNumberInPractitionerMapping,
    ]);
    expect(
      applicationContext.getPersistenceGateway().bulkIndexRecords,
    ).toHaveBeenCalled();
  });
});
