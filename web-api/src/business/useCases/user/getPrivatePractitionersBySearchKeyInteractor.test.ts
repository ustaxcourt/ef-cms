import '@web-api/persistence/postgres/practitioners/mocks.jest';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { getPrivatePractitionersBySearchKeyInteractor } from './getPrivatePractitionersBySearchKeyInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { getPractitionersBySearchKey as getPractitionersBySearchKeyMock } from '@web-api/persistence/postgres/practitioners/getPractitionersBySearchKey';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';

const getPractitionersBySortKey = getPractitionersBySearchKeyMock as jest.Mock;
let user;
describe('getPrivatePractitionersBySearchKeyInteractor', () => {
  it('should throw an error when not authorized', async () => {
    let error;
    user = mockPetitionerUser;
    getPractitionersBySortKey.mockResolvedValue([]);

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
    getPractitionersBySortKey.mockResolvedValue([
      new PrivatePractitioner({
        barNumber: 'PT1234',
        name: 'Test Practitioner',
        role: ROLES.privatePractitioner,
        userId: 'f3e91236-495b-4412-b684-1cffe59ed9d9',
      }),
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
