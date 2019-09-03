const {
  getEligibleCasesForTrialSessionInteractor,
} = require('./getEligibleCasesForTrialSessionInteractor');
const { User } = require('../../entities/User');

const { MOCK_CASE } = require('../../../test/mockCase');

const MOCK_TRIAL = {
  maxCases: 100,
  sessionType: 'Regular',
  startDate: '2025-12-01T00:00:00.000Z',
  term: 'Fall',
  termYear: '2025',
  trialLocation: 'Birmingham, AL',
};

describe('getEligibleCasesForTrialSessionInteractor', () => {
  let applicationContext;

  it('throws an exception when it fails to find the cases for a trial session', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Petitioner',
          role: 'petitioner',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        getEligibleCasesForTrialSession: () => [MOCK_CASE],
        getTrialSessionById: () => MOCK_TRIAL,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    let error;

    try {
      await getEligibleCasesForTrialSessionInteractor({
        applicationContext,
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
  });

  it('should find the cases for a trial session successfully', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Docket Clerk',
          role: 'docketclerk',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        getEligibleCasesForTrialSession: () => [MOCK_CASE],
        getTrialSessionById: () => MOCK_TRIAL,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    let error;

    try {
      await getEligibleCasesForTrialSessionInteractor({
        applicationContext,
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      });
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
  });
});
