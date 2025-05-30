import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
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
        petitioners: {
          S: [],
        },
        caseStatusHistory: {
          S: [],
        },
      },
    },
  };

  beforeEach(() => {
    getCaseMetadataWithCounsel.mockReturnValue(mockCaseRecord);

    (upsertCases as jest.Mock).mockResolvedValue(undefined);
  });

  it('should do nothing when no case records are found', async () => {
    await processCaseEntries({
      caseEntityRecords: [],
    });

    expect(upsertCases).not.toHaveBeenCalled();
  });

  it('should upsert the provided case record', async () => {
    await processCaseEntries({
      caseEntityRecords: [mockCaseRecord],
    });

    expect(upsertCases).toHaveBeenCalledWith([
      expect.objectContaining({ pk: 'case|123-45' }),
    ]);
  });
});
