import { CASE_STATUS_TYPES } from '../../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { get, queryFull } from '../../dynamodbClientService';
import { getCalendaredCasesForTrialSession } from './getCalendaredCasesForTrialSession';

jest.mock('../../dynamodbClientService', () => ({
  get: jest.fn(),
  queryFull: jest.fn(),
}));
const getMock = get as jest.Mock;
const queryFullMock = queryFull as jest.Mock;

describe('getCalendaredCasesForTrialSession', () => {
  beforeAll(() => {
    getMock.mockReturnValue({
      caseOrder: [
        {
          disposition: 'something',
          docketNumber: MOCK_CASE.docketNumber,
          removedFromTrial: true,
        },
      ],
    });

    queryFullMock.mockReturnValue([
      {
        docketNumber: MOCK_CASE.docketNumber,
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: `case|${MOCK_CASE.docketNumber}`,
        status: 'New',
      },
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'irsPractitioner|123',
        userId: 'abc-123',
      },
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'privatePractitioner|123',
        userId: 'abc-123',
      },
      {
        docketEntryId: 'abc-123',
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'docket-entry|123',
      },
    ]);
  });

  it('should get the cases calendared for a trial session', async () => {
    const result = await getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId: 'testId111',
    });
    expect(result).toEqual([
      {
        archivedCorrespondences: [],
        archivedDocketEntries: [],
        consolidatedCases: [],
        correspondence: [],
        disposition: 'something',
        docketEntries: [
          {
            docketEntryId: 'abc-123',
          },
        ],
        docketNumber: MOCK_CASE.docketNumber,
        hearings: [],
        irsPractitioners: [
          {
            userId: 'abc-123',
          },
        ],
        privatePractitioners: [
          {
            userId: 'abc-123',
          },
        ],
        removedFromTrial: true,
        status: CASE_STATUS_TYPES.new,
      },
    ]);
  });
});
