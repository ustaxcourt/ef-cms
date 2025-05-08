import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import { processCaseEntries } from './processCaseEntries';
import { upsertCases } from '@web-api/persistence/postgres/cases/upsertCases';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';

jest.mock('@web-api/persistence/postgres/cases/upsertCases');

describe('processCaseEntries', () => {
  const getCasesByDocketNumbers = getCasesByDocketNumbersMock as jest.Mock;
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
    getCasesByDocketNumbers.mockReturnValue(mockCaseRecord);

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
