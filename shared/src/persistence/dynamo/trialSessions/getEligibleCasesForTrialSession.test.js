const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  getEligibleCasesForTrialSession,
} = require('./getEligibleCasesForTrialSession');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getEligibleCasesForTrialSession', () => {
  let getCaseByDocketNumberSpy;

  beforeEach(() => {
    getCaseByDocketNumberSpy = jest.fn().mockResolvedValue({
      ...MOCK_CASE,
      irsPractitioners: [{ userId: 'abc-123' }],
      privatePractitioners: [{ userId: 'abc-123' }],
    });

    client.query = jest.fn().mockReturnValue([
      {
        docketNumber: MOCK_CASE.docketNumber,
        pk: 'eligible-for-trial-case-catalog',
        sk: 'WashingtonDistrictofColumbia-R-A-20181212000000-101-18',
      },
    ]);

    client.batchGet = jest
      .fn()
      .mockReturnValue([{ ...MOCK_CASE, pk: MOCK_CASE.docketNumber }]);
  });

  it('should get the cases for a trial session', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(getCaseByDocketNumberSpy);
    const result = await getEligibleCasesForTrialSession({
      applicationContext,
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
});
