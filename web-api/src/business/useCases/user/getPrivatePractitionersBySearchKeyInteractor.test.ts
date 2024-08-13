import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getPrivatePractitionersBySearchKeyInteractor } from './getPrivatePractitionersBySearchKeyInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';

let user;
describe('getPrivatePractitionersBySearchKeyInteractor', () => {
  beforeEach(() => {
    applicationContext.environment.stage = 'local';
  });

  it('should throw an error when not authorized', async () => {
    let error;
    user = mockPetitionerUser;
    applicationContext
      .getPersistenceGateway()
      .getUsersBySearchKey.mockResolvedValue([]);

    try {
      await getPrivatePractitionersBySearchKeyInteractor(
        applicationContext,
        {
          searchKey: 'something',
        },
        user,
      );
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('should return users from persistence', async () => {
    user = mockPetitionsClerkUser;
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
      user,
    );

    expect(result).toMatchObject([{ name: 'Test Practitioner' }]);
  });
});
