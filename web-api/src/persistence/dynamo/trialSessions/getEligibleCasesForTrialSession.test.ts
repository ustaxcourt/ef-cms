import { MOCK_CASE } from '../../../../../shared/src/test/mockCase';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { batchGet, query } from '../../dynamodbClientService';
import { getEligibleCasesForTrialSession } from './getEligibleCasesForTrialSession';

const limit = 5;
const skPrefix = 'trialSession';

jest.mock('../../dynamodbClientService', () => ({
  batchGet: jest.fn(),
  query: jest.fn(),
}));
const queryMock = query as jest.Mock;
const batchGetMock = batchGet as jest.Mock;

describe('getEligibleCasesForTrialSession', () => {
  let getCaseByDocketNumberSpy;

  beforeEach(() => {
    getCaseByDocketNumberSpy = jest.fn().mockResolvedValue({
      ...MOCK_CASE,
      irsPractitioners: [{ userId: 'abc-123' }],
      privatePractitioners: [{ userId: 'abc-123' }],
    });

    queryMock.mockReturnValue([
      {
        docketNumber: MOCK_CASE.docketNumber,
        pk: 'eligible-for-trial-case-catalog',
        sk: 'WashingtonDistrictofColumbia-R-A-20181212000000-101-18',
      },
    ]);
    batchGetMock.mockReturnValue([
      { ...MOCK_CASE, pk: MOCK_CASE.docketNumber },
    ]);
  });

  it('should get the cases for a trial session', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(getCaseByDocketNumberSpy);
    const result = await getEligibleCasesForTrialSession({
      applicationContext,
      limit,
      skPrefix,
    });
    expect(getCaseByDocketNumberSpy).toHaveBeenCalled();
    expect(result).toEqual([
      {
        ...MOCK_CASE,
        irsPractitioners: [{ userId: 'abc-123' }],
        pk: MOCK_CASE.docketNumber,
        privatePractitioners: [{ userId: 'abc-123' }],
      },
    ]);
  });

  it('should remove duplicate docketNumbers returned by the eligible-for-trial-case-catalog query', async () => {
    queryMock.mockReturnValueOnce([
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

    await getEligibleCasesForTrialSession({
      applicationContext,
      limit,
      skPrefix,
    });
    expect(batchGetMock).toHaveBeenCalledWith({
      applicationContext,
      keys: [
        {
          pk: `case|${MOCK_CASE.docketNumber}`,
          sk: `case|${MOCK_CASE.docketNumber}`,
        },
      ],
    });
  });

  it('should return the eligible cases in a timely manner', async () => {
    const CASES_TO_TEST = 105;
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return {
          ...MOCK_CASE,
          irsPractitioners: [{ userId: 'abc-123' }],
          privatePractitioners: [{ userId: 'abc-123' }],
        };
      });

    batchGetMock.mockReturnValueOnce(
      new Array(CASES_TO_TEST).fill({
        ...MOCK_CASE,
        pk: MOCK_CASE.docketNumber,
      }),
    );

    await getEligibleCasesForTrialSession({
      applicationContext,
      limit,
      skPrefix,
    });
  }, 1000);
});
