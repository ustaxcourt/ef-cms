import '@web-api/persistence/postgres/cases/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  getCasesByDocketNumbers as getCasesByDocketNumbersMock,
  SelectableCaseFields,
} from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { getEligibleCasesForTrialSession } from './getEligibleCasesForTrialSession';
import { query } from '../../dynamodbClientService';

const limit = 5;
const skPrefix = 'trialSession';

jest.mock('../../dynamodbClientService', () => ({
  batchGet: jest.fn(),
  query: jest.fn(),
}));
const queryMock = query as jest.Mock;

describe('getEligibleCasesForTrialSession', () => {
  const getCasesByDocketNumbers =
    getCasesByDocketNumbersMock as jest.MockedFunction<
      (args: {
        docketNumbers: string[];
        excludeFields?: SelectableCaseFields[];
      }) => Promise<Omit<RawCase, 'consolidatedCases'>[]>
    >;

  beforeEach(() => {
    getCasesByDocketNumbers.mockResolvedValue([
      {
        ...MOCK_CASE,
        irsPractitioners: [{ userId: 'abc-123' }],
        privatePractitioners: [{ userId: 'abc-123' }],
      },
    ]);

    queryMock.mockResolvedValue([
      {
        docketNumber: MOCK_CASE.docketNumber,
        pk: 'eligible-for-trial-case-catalog',
        sk: 'WashingtonDistrictofColumbia-R-A-20181212000000-101-18',
      },
    ]);
  });

  it('should get the cases for a trial session', async () => {
    const result = await getEligibleCasesForTrialSession({
      applicationContext,
      limit,
      skPrefix,
    });
    expect(getCasesByDocketNumbers).toHaveBeenCalled();
    expect(result).toEqual([
      {
        ...MOCK_CASE,
        irsPractitioners: [{ userId: 'abc-123' }],
        privatePractitioners: [{ userId: 'abc-123' }],
      },
    ]);
  });

  it('should remove duplicate docketNumbers returned by the eligible-for-trial-case-catalog query', async () => {
    queryMock.mockResolvedValue([
      {
        docketNumber: MOCK_CASE.docketNumber,
        pk: 'eligible-for-trial-case-catalog',
        sk: 'WashingtonDistrictofColumbia-R-D-20181212654321-101-18',
      },
      {
        docketNumber: MOCK_CASE.docketNumber,
        pk: 'eligible-for-trial-case-catalog',
        sk: 'WashingtonDistrictofColumbia-R-D-20181212000000-101-18',
      },
    ]);

    const result = await getEligibleCasesForTrialSession({
      applicationContext,
      limit,
      skPrefix,
    });
    expect(result).toMatchObject([{ docketNumber: '101-18' }]);
  });

  it('should return the eligible cases in a timely manner', async () => {
    const CASES_TO_TEST = 105;
    getCasesByDocketNumbers.mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      return [
        {
          ...MOCK_CASE,
          irsPractitioners: [{ userId: 'abc-123' }],
          privatePractitioners: [{ userId: 'abc-123' }],
        },
      ];
    });

    queryMock.mockResolvedValue(
      new Array(CASES_TO_TEST).fill({
        docketNumber: MOCK_CASE.docketNumber,
        pk: 'eligible-for-trial-case-catalog',
        sk: 'WashingtonDistrictofColumbia-R-A-20181212000000-101-18',
      }),
    );

    await getEligibleCasesForTrialSession({
      applicationContext,
      limit,
      skPrefix,
    });
  }, 1000);
});
