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
describe('Get users in section', () => {
  it('retrieves the users in the petitions section', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getUsersInSection: () => Promise.resolve(MOCK_SECTION),
        };
      },
    };
    const sectionToGet = { section: 'petitions' };
    const section = await getUsersInSectionInteractor({
      applicationContext,
      sectionToGet,
    });
    expect(section.length).toEqual(2);
    expect(section[0].userId).toEqual('petitioner1@example.com');
  });

  it('returns notfounderror when section not found', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getUsersInSection: () => Promise.resolve(MOCK_SECTION),
        };
      },
    };
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
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitioner,
          userId: 'petitioner',
        };
      },
      getPersistenceGateway: () => {
        return {
          getUsersInSection: () => Promise.resolve(MOCK_SECTION),
        };
      },
    };
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
});
