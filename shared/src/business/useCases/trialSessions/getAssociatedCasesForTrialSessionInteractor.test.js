const {
  getAssociatedCasesForTrialSession,
} = require('./getAssociatedCasesForTrialSessionInteractor');
const { User } = require('../../entities/User');

const { MOCK_CASE } = require('../../../test/mockCase');

describe('getAssociatedCasesForTrialSessionInteractor', () => {
  let applicationContext;

  it('throws an exception when the user is unauthorized', async () => {
    applicationContext = {
      getCurrentUser: () => {
        return new User({
          name: 'Petitioner',
          role: 'petitioner',
          userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
        });
      },
      getPersistenceGateway: () => ({
        getAssociatedCasesForTrialSession: () => [MOCK_CASE],
      }),
    };

    await expect(
      getAssociatedCasesForTrialSession({
        applicationContext,
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).rejects.toThrow();
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
        getAssociatedCasesForTrialSession: () => [MOCK_CASE],
      }),
    };

    await expect(
      getAssociatedCasesForTrialSession({
        applicationContext,
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).resolves.not.toThrow();
  });
});
