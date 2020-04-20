const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getUsersInSectionInteractor,
} = require('./getUsersInSectionInteractor');
const { NotFoundError, UnauthorizedError } = require('../../../errors/errors');
const { User } = require('../../entities/User');

const MOCK_SECTION = [
  {
    name: 'Test Petitioner',
    role: User.ROLES.petitioner,
    userId: 'petitioner1@example.com',
  },
  {
    name: 'Test Petitioner',
    role: User.ROLES.petitioner,
    userId: 'petitioner2@example.com',
  },
];

const MOCK_JUDGE_SECTION = [
  {
    name: 'Test Judge',
    role: User.ROLES.judge,
    userId: 'judge@example.com',
  },
  {
    name: 'Test Judge2',
    role: User.ROLES.judge,
    userId: 'judge2@example.com',
  },
];

describe('Get users in section', () => {
  it('retrieves the users in the petitions section', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue(MOCK_SECTION);
    const sectionToGet = { section: 'petitions' };
    const section = await getUsersInSectionInteractor({
      applicationContext,
      sectionToGet,
    });
    expect(section.length).toEqual(2);
    expect(section[0].userId).toEqual('petitioner1@example.com');
  });

  it('returns notfounderror when section not found', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue(MOCK_SECTION);
    let result = 'error';
    try {
      const sectionToGet = { section: 'unknown' };
      await getUsersInSectionInteractor({
        applicationContext,
        sectionToGet,
      });
    } catch (e) {
      if (e instanceof NotFoundError) {
        result = 'error';
      }
    }
    expect(result).toEqual('error');
  });

  it('returns unauthorizederror when user not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    });
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue(MOCK_SECTION);

    let result = 'error';
    try {
      const sectionToGet = { section: 'unknown' };
      await getUsersInSectionInteractor({
        applicationContext,
        sectionToGet,
      });
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        result = 'error';
      }
    }
    expect(result).toEqual('error');
  });

  it('retrieves the users in the judge section when the current user has the appropriate permissions', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.docketClerk,
      userId: 'docketClerk',
    });
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue(MOCK_JUDGE_SECTION);
    const sectionToGet = { section: 'judge' };
    const section = await getUsersInSectionInteractor({
      applicationContext,
      sectionToGet,
    });
    expect(section.length).toEqual(2);
    expect(section[0].userId).toEqual('judge@example.com');
  });

  it('returns unauthorizederror when the desired section is judge and current user does not have appropriate permissions', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    });
    applicationContext
      .getPersistenceGateway()
      .getUsersInSection.mockReturnValue(MOCK_JUDGE_SECTION);
    const sectionToGet = { section: 'judge' };
    await expect(
      getUsersInSectionInteractor({
        applicationContext,
        sectionToGet,
      }),
    ).rejects.toThrow('Unauthorized');
  });
});
