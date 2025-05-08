import '@web-api/persistence/postgres/practitioners/mocks.jest';
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getIrsPractitionersBySearchKeyInteractor } from './getIrsPractitionersBySearchKeyInteractor';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
} from '@shared/test/mockAuthUsers';
import { getPractitionersBySearchKey as getPractitionersBySearchKeyMock } from '@web-api/persistence/postgres/practitioners/getPractitionersBySearchKey';

const getPractitionersBySearchKey =
  getPractitionersBySearchKeyMock as jest.Mock;

describe('getIrsPractitionersBySearchKeyInteractor', () => {
  beforeEach(() => {
    applicationContext.environment.stage = 'local';
  });

  it('should throw an error when not authorized', async () => {
    applicationContext
      .getPersistenceGateway()
      .getUsersBySearchKey.mockResolvedValue([]);

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
      },
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
