const { UnauthorizedError, NotFoundError } = require('../../../errors/errors');
const { getUsersInSection } = require('./getUsersInSection.interactor');

const MOCK_SECTION = [
  {
    userId: 'petitioner1@example.com',
    role: 'petitions',
    name: 'Test Petitioner',
  },
  {
    userId: 'petitioner2@example.com',
    role: 'petitions',
    name: 'Test Petitioner',
  },
];
describe('Get users in section', () => {
  it('retrieves the users in the petitions section', async () => {
    const applicationContext = {
      getPersistenceGateway: () => {
        return {
          getUsersInSection: () => Promise.resolve(MOCK_SECTION),
        };
      },
      getCurrentUser: () => {
        return {
          userId: 'petitionsclerk',
          role: 'petitionsclerk',
        };
      },
      environment: { stage: 'local' },
    };
    const sectionToGet = { section: 'petitions' };
    const section = await getUsersInSection({
      sectionToGet,
      applicationContext,
    });
    expect(section.length).toEqual(2);
    expect(section[0].userId).toEqual('petitioner1@example.com');
  });

  it('returns notfounderror when section not found', async () => {
    const applicationContext = {
      getPersistenceGateway: () => {
        return {
          getUsersInSection: () => Promise.resolve(MOCK_SECTION),
        };
      },
      getCurrentUser: () => {
        return {
          userId: 'petitionsclerk',
          role: 'petitionsclerk',
        };
      },
      environment: { stage: 'local' },
    };
    let result = 'error';
    try {
      const sectionToGet = { section: 'unknown' };
      await getUsersInSection({
        sectionToGet,
        applicationContext,
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
      getPersistenceGateway: () => {
        return {
          getUsersInSection: () => Promise.resolve(MOCK_SECTION),
        };
      },
      getCurrentUser: () => {
        return {
          userId: 'taxpayer',
          role: 'petitioner',
        };
      },
      environment: { stage: 'local' },
    };
    let result = 'error';
    try {
      const sectionToGet = { section: 'unknown' };
      await getUsersInSection({
        sectionToGet,
        applicationContext,
      });
    } catch (e) {
      if (e instanceof UnauthorizedError) {
        result = 'error';
      }
    }
    expect(result).toEqual('error');
  });
});
