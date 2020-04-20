const client = require('../../dynamodbClientService');
const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  getEligibleCasesForTrialSession,
} = require('./getEligibleCasesForTrialSession');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('getEligibleCasesForTrialSession', () => {
  let getCaseByCaseIdSpy;

  beforeEach(() => {
    getCaseByCaseIdSpy = jest.fn().mockResolvedValue({
      ...MOCK_CASE,
      irsPractitioners: [{ userId: 'abc-123' }],
      privatePractitioners: [{ userId: 'abc-123' }],
    });

    client.query = jest.fn().mockReturnValue([
      {
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        pk: 'eligible-for-trial-case-catalog',
        sk:
          'WashingtonDistrictofColumbia-R-A-20181212000000-c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
    ]);

    client.batchGet = jest
      .fn()
      .mockReturnValue([{ ...MOCK_CASE, pk: MOCK_CASE.caseId }]);
  });

  it('should get the cases for a trial session', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockImplementation(getCaseByCaseIdSpy);
    const result = await getEligibleCasesForTrialSession({
      applicationContext,
    });
    expect(getCaseByCaseIdSpy).toHaveBeenCalled();
    expect(result).toEqual([
      {
        ...MOCK_CASE,
        irsPractitioners: [{ userId: 'abc-123' }],
        pk: MOCK_CASE.caseId,
        privatePractitioners: [{ userId: 'abc-123' }],
      },
    ]);
  });
});
