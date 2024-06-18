import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getPrivatePractitionersBySearchKeyInteractor } from './getPrivatePractitionersBySearchKeyInteractor';

let user;
describe('getPrivatePractitionersBySearchKeyInteractor', () => {
  beforeEach(() => {
    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockImplementation(() => user);
  });

  it('should throw an error when not authorized', async () => {
    let error;
    user = {
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.petitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
    applicationContext
      .getPersistenceGateway()
      .getUsersBySearchKey.mockResolvedValue([]);

    try {
      await getPrivatePractitionersBySearchKeyInteractor(applicationContext, {
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
          barNumber: 'PT1234',
          name: 'Test Practitioner',
          role: ROLES.privatePractitioner,
          userId: 'f3e91236-495b-4412-b684-1cffe59ed9d9',
        },
      ]);

    const result = await getPrivatePractitionersBySearchKeyInteractor(
      applicationContext,
      {
        searchKey: 'Test Practitioner',
      },
    );

    expect(result).toMatchObject([{ name: 'Test Practitioner' }]);
  });
});
