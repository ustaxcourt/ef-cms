const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  getIrsPractitionersBySearchKeyInteractor,
} = require('./getIrsPractitionersBySearchKeyInteractor');
const { ROLES } = require('../../entities/EntityConstants');

let user;

describe('getIrsPractitionersBySearchKeyInteractor', () => {
  beforeEach(() => {
    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockImplementation(() => user);
  });

  it('should throw an error when not authorized', async () => {
    user = {
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.petitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    applicationContext
      .getPersistenceGateway()
      .getUsersBySearchKey.mockResolvedValue([]);

    let error;
    try {
      await getIrsPractitionersBySearchKeyInteractor({
        applicationContext,
        searchKey: 'something',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('should return users from persistence', async () => {
    user = {
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.petitionsClerk,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    applicationContext
      .getPersistenceGateway()
      .getUsersBySearchKey.mockResolvedValue([
        {
          name: 'Test Respondent',
          userId: '7d9eca44-4d10-44f2-9210-e7eed047f3c5',
        },
      ]);

    const result = await getIrsPractitionersBySearchKeyInteractor({
      applicationContext,
      searchKey: 'Test Respondent',
    });

    expect(result).toMatchObject([{ name: 'Test Respondent' }]);
  });
});
