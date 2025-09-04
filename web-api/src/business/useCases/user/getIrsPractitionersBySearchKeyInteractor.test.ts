jest.mock('@web-api/persistence/postgres/users/getPractitionersBySearchKey');
import { getPractitionersBySearchKey as getPractitionersBySearchKeyMock } from '@web-api/persistence/postgres/users/getPractitionersBySearchKey';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getIrsPractitionersBySearchKeyInteractor } from './getIrsPractitionersBySearchKeyInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

describe('getIrsPractitionersBySearchKeyInteractor', () => {
  const getPractitionersBySearchKey = jest.mocked(
    getPractitionersBySearchKeyMock,
  );
  beforeEach(() => {
    applicationContext.environment.stage = 'local';
  });

  it('should throw an error when not authorized', async () => {
    getPractitionersBySearchKey.mockResolvedValue([]);

    let error;
    try {
      await getIrsPractitionersBySearchKeyInteractor(
        {
          searchKey: 'something',
        },
        mockPetitionerUser,
      );
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized');
  });

  it('should return users from persistence', async () => {
    getPractitionersBySearchKey.mockResolvedValue([
      {
        barNumber: 'PT1234',
        name: 'Test Practitioner',
        role: ROLES.irsPractitioner,
        userId: '7d9eca44-4d10-44f2-9210-e7eed047f3c5',
      } as DbUser,
    ]);

    const result = await getIrsPractitionersBySearchKeyInteractor(
      {
        searchKey: 'Test Practitioner',
      },
      mockPetitionsClerkUser,
    );

    expect(result).toMatchObject([{ name: 'Test Practitioner' }]);
  });
});
