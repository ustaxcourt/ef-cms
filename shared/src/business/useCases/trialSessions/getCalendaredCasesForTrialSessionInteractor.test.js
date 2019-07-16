const {
  getCalendaredCasesForTrialSessionInteractor,
} = require('./getCalendaredCasesForTrialSessionInteractor');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

const { MOCK_CASE } = require('../../../test/mockCase');

describe('getCalendaredCasesForTrialSessionInteractor', () => {
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
        getCalendaredCasesForTrialSession: () => [MOCK_CASE],
      }),
    };

    await expect(
      getCalendaredCasesForTrialSessionInteractor({
        applicationContext,
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).rejects.toThrowError(UnauthorizedError);
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
        getCalendaredCasesForTrialSession: () => [MOCK_CASE],
      }),
    };

    await expect(
      getCalendaredCasesForTrialSessionInteractor({
        applicationContext,
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).resolves.not.toThrow();
  });
});
