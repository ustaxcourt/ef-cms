import '@web-api/persistence/postgres/caseCorrespondences/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { get } from '../../dynamodbClientService';
import { getCalendaredCasesForTrialSession } from './getCalendaredCasesForTrialSession';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

jest.mock('../../dynamodbClientService', () => ({
  get: jest.fn(),
  queryFull: jest.fn(),
}));
const getMock = get as jest.Mock;
const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;

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

    getCaseByDocketNumber.mockReturnValue({
      docketEntries: [
        {
          docketEntryId: 'abc-123',
        },
      ],
      docketNumber: MOCK_CASE.docketNumber,
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
      status: CASE_STATUS_TYPES.new,
    });
  });

  it('should get the cases calendared for a trial session', async () => {
    const result = await getCalendaredCasesForTrialSession({
      applicationContext,
      trialSessionId: 'testId111',
    });

    expect(result).toEqual([
      {
        disposition: 'something',
        docketEntries: [
          {
            docketEntryId: 'abc-123',
          },
        ],
        docketNumber: MOCK_CASE.docketNumber,
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
