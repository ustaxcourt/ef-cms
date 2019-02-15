const { createUser } = require('./createUser.interactor');

const MOCK_USER = {
  userId: 'petitioner1@example.com',
  role: 'petitions',
  name: 'Test Petitioner',
};
describe('create user', () => {
  it('creates the user', async () => {
    const applicationContext = {
      getPersistenceGateway: () => {
        return {
          createUser: () => Promise.resolve(MOCK_USER),
        };
      },
      getCurrentUser: () => {
        return {
          userId: 'admin',
          role: 'admin',
        };
      },
      environment: { stage: 'local' },
    };
    const userToCreate = { userId: 'petitioner1@example.com' };
    const user = await createUser({
      userToCreate,
      applicationContext,
    });
    expect(user).not.toBeUndefined();
  });
});
