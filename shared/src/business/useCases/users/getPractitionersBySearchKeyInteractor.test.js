const {
  getPractitionersBySearchKeyInteractor,
} = require('./getPractitionersBySearchKeyInteractor');
const { User } = require('../../entities/User');

describe('getPractitionersBySearchKeyInteractor', () => {
  let applicationContext;

  it('should throw an error when not authorized', async () => {
    let error;
    try {
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return {
            name: 'Olivia Jade',
            role: User.ROLES.petitioner,
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          };
        },
        getPersistenceGateway: () => ({
          getUsersBySearchKey: async () => [],
        }),
      };
      await getPractitionersBySearchKeyInteractor({
        applicationContext,
        searchKey: 'something',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('should return users from persistence', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          name: 'Olivia Jade',
          role: User.ROLES.petitionsClerk,
          userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        };
      },
      getPersistenceGateway: () => ({
        getUsersBySearchKey: async () => [
          {
            name: 'Test Practitioner',
            userId: 'f3e91236-495b-4412-b684-1cffe59ed9d9',
          },
        ],
      }),
    };

    const result = await getPractitionersBySearchKeyInteractor({
      applicationContext,
      searchKey: 'Test Practitioner',
    });

    expect(result).toMatchObject([{ name: 'Test Practitioner' }]);
  });
});
