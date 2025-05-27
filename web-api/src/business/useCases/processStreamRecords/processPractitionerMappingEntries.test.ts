jest.mock(
  '@web-api/business/useCases/processStreamRecords/getCaseDataFromDynamo',
);
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/practitioners/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import { processPractitionerMappingEntries } from '@web-api/business/useCases/processStreamRecords/processPractitionerMappingEntries';
import { upsertPractitionerRecords as upsertPractitionerRecordsMock } from '@web-api/persistence/postgres/practitioners/upsertPractitionerRecords';
import { upsertUserOnCaseRecords as upsertUserOnCaseRecordsMock } from '@web-api/persistence/postgres/users/cases/upsertUserOnCaseRecords';

const upsertPractitionerRecords = upsertPractitionerRecordsMock as jest.Mock;
const upsertUserOnCaseRecords = upsertUserOnCaseRecordsMock as jest.Mock;

describe('processPractitionerMappingEntries', () => {
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
    upsertPractitionerRecords.mockResolvedValue(() => {});
    upsertUserOnCaseRecords.mockResolvedValue(() => {});
  });

  it('should do nothing when no practitioner mapping records are passed', async () => {
    await processPractitionerMappingEntries({
      practitionerMappingRecords: [],
    });

    expect(upsertPractitionerRecords).not.toHaveBeenCalled();
    expect(upsertUserOnCaseRecords).not.toHaveBeenCalled();
  });

  it('should call upsertPractitionerRecords and upsertUserOnCaseRecords when practitioner mapping records are passed', async () => {
    await processPractitionerMappingEntries({
      practitionerMappingRecords: mockPractitionerMappingEntries,
    });

    expect(upsertPractitionerRecords).toHaveBeenCalled();
    expect(upsertUserOnCaseRecords).toHaveBeenCalled();
  });
});
