const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getCalendaredCasesForTrialSessionInteractor,
} = require('./getCalendaredCasesForTrialSessionInteractor');
const { UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

const { MOCK_CASE } = require('../../../test/mockCase');

const mockJudge = {
  role: 'judge',
  section: 'judgeChambers',
  userId: '123',
};

let user;
let PARTY_TYPES;
let USER_ROLES;

describe('getCalendaredCasesForTrialSessionInteractor', () => {
  beforeEach(() => {
    ({ PARTY_TYPES, USER_ROLES } = applicationContext.getConstants());

    applicationContext.getCurrentUser.mockImplementation(() => user);
    applicationContext
      .getPersistenceGateway()
      .getCalendaredCasesForTrialSession.mockReturnValue([MOCK_CASE]);
    applicationContext
      .getUseCases()
      .getJudgeForUserChambersInteractor.mockReturnValue(mockJudge);
  });

  it('throws an exception when the user is unauthorized', async () => {
    user = new User({
      name: PARTY_TYPES.petitioner,
      role: USER_ROLES.petitioner,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    await expect(
      getCalendaredCasesForTrialSessionInteractor({
        applicationContext,
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).rejects.toThrowError(UnauthorizedError);
  });

  it('should find the cases for a trial session successfully', async () => {
    user = new User({
      name: 'Docket Clerk',
      role: USER_ROLES.docketClerk,
      userId: '6805d1ab-18d0-43ec-bafb-654e83405416',
    });

    await expect(
      getCalendaredCasesForTrialSessionInteractor({
        applicationContext,
        trialSessionId: '6805d1ab-18d0-43ec-bafb-654e83405416',
      }),
    ).resolves.not.toThrow();
  });
});
