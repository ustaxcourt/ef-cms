const {
  getRespondentsBySearchKeyInteractor,
} = require('./getRespondentsBySearchKeyInteractor');
const { User } = require('../../entities/User');

describe('getRespondentsBySearchKeyInteractor', () => {
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
      await getRespondentsBySearchKeyInteractor({
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
            name: 'Test Respondent',
            userId: '7d9eca44-4d10-44f2-9210-e7eed047f3c5',
          },
        ],
      }),
    };

    const result = await getRespondentsBySearchKeyInteractor({
      applicationContext,
      searchKey: 'Test Respondent',
    });

    expect(result).toMatchObject([{ name: 'Test Respondent' }]);
  });
});
