jest.mock('@web-api/persistence/postgres/users/getPractitionersBySearchKey');
import { getPractitionersBySearchKey as getPractitionersBySearchKeyMock } from '@web-api/persistence/postgres/users/getPractitionersBySearchKey';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getPrivatePractitionersBySearchKeyInteractor } from './getPrivatePractitionersBySearchKeyInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

let user;
describe('getPrivatePractitionersBySearchKeyInteractor', () => {
  const getPractitionersBySearchKey = jest.mocked(
    getPractitionersBySearchKeyMock,
  );
  beforeEach(() => {
    applicationContext.environment.stage = 'local';
  });

  it('should throw an error when not authorized', async () => {
    let error;
    user = mockPetitionerUser;
    getPractitionersBySearchKey.mockResolvedValue([]);

    try {
      await getPrivatePractitionersBySearchKeyInteractor(
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
    getPractitionersBySearchKey.mockResolvedValue([
      {
        barNumber: 'PT1234',
        name: 'Test Practitioner',
        role: ROLES.privatePractitioner,
        userId: 'f3e91236-495b-4412-b684-1cffe59ed9d9',
      } as DbUser,
    ]);

    const result = await getPrivatePractitionersBySearchKeyInteractor(
      {
        searchKey: 'Test Practitioner',
      },
      user,
    );

    expect(result).toMatchObject([{ name: 'Test Practitioner' }]);
  });
});
