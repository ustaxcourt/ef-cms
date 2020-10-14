const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { createJudgeUserInteractor } = require('./createJudgeUserInteractor');
const { ROLES } = require('../../entities/EntityConstants');
const { UnauthorizedError } = require('../../../errors/errors');

const mockUser = {
  email: 'judgeFieri@example.com',
  entityName: 'User',
  judgeFullName: 'Guy S. B. Fieri',
  judgeTitle: 'Legacy Judge Fieri',
  name: 'Fieri',
  role: ROLES.legacyJudge,
  section: 'legacyJudgesChambers',
  userId: 'fa244bfb-2636-4d02-9f84-6a131eb16502',
};

describe('createJudgeUserInteractor', () => {
  let testUser;

  beforeEach(() => {
    testUser = {
      role: ROLES.admin,
      userId: 'f0c1d194-92e5-45b7-a381-7625a6a7bc0c',
    };

    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockImplementation(() => testUser);
    applicationContext
      .getPersistenceGateway()
      .createUser.mockResolvedValue(mockUser);
  });

  it('creates the judge user', async () => {
    const user = await createJudgeUserInteractor({
      applicationContext,
      user: mockUser,
    });

    expect(user).not.toBeUndefined();
  });

  it('makes a call to create the judge user in persistence', async () => {
    const currentJudge = {
      ...mockUser,
      role: ROLES.judge,
    };
    await createJudgeUserInteractor({
      applicationContext,
      user: currentJudge,
    });

    expect(
      applicationContext.getPersistenceGateway().createUser,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        disableCognitoUser: false,
        user: { ...currentJudge, userId: expect.anything() },
      }),
    );
  });

  it('makes a call to create a legacy judge user in persistence', async () => {
    const legacyJudgeUser = {
      ...mockUser,
      role: ROLES.legacyJudge,
    };
    await createJudgeUserInteractor({
      applicationContext,
      user: legacyJudgeUser,
    });

    expect(
      applicationContext.getPersistenceGateway().createUser,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        disableCognitoUser: true,
        user: { ...legacyJudgeUser, userId: expect.anything() },
      }),
    );
  });

  it('throws unauthorized for a non-admin user', async () => {
    testUser = {
      role: ROLES.petitioner,
      userId: '6a2a8f95-0223-442e-8e55-5f094c6bca15',
    };

    await expect(
      createJudgeUserInteractor({
        applicationContext,
        user: { ...mockUser, userId: expect.anything() },
      }),
    ).rejects.toThrow(UnauthorizedError);
  });
});
