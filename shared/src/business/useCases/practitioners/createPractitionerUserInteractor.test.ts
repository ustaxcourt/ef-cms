import { ROLES, SERVICE_INDICATOR_TYPES } from '../../entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../test/createTestApplicationContext';
import { createPractitionerUserInteractor } from './createPractitionerUserInteractor';

describe('create practitioner user', () => {
  const mockUser = {
    admissionsDate: '2019-03-01',
    admissionsStatus: 'Active',
    barNumber: 'AT5678',
    birthYear: 2019,
    employer: 'Private',
    firmName: 'GW Law Offices',
    firstName: 'bob',
    lastName: 'sagot',
    name: 'Test Attorney',
    originalBarState: 'IL',
    practitionerType: 'Attorney',
    role: ROLES.privatePractitioner,
    userId: '07044afe-641b-4d75-a84f-0698870b7650',
  } as any;

  let testUser;

  beforeEach(() => {
    testUser = {
      role: ROLES.admissionsClerk,
      userId: 'admissionsclerk',
    };

    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockImplementation(() => testUser);
    applicationContext
      .getPersistenceGateway()
      .createOrUpdatePractitionerUser.mockResolvedValue(mockUser);
  });

  it('creates the practitioner user', async () => {
    const user = await createPractitionerUserInteractor(applicationContext, {
      user: mockUser,
    });
    expect(user).not.toBeUndefined();
  });

  it('throws unauthorized for a non-internal user', async () => {
    testUser = {
      role: ROLES.petitioner,
      userId: '6a2a8f95-0223-442e-8e55-5f094c6bca15',
    };

    await expect(
      createPractitionerUserInteractor(applicationContext, {
        user: mockUser,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should set practitioner.pendingEmail to practitioner.email and set practitioner.email to undefined', async () => {
    const mockEmail = 'testing@example.com';

    await createPractitionerUserInteractor(applicationContext, {
      user: {
        ...mockUser,
        email: mockEmail,
      },
    });

    const mockUserCall =
      applicationContext.getPersistenceGateway().createOrUpdatePractitionerUser
        .mock.calls[0][0].user;

    expect(mockUserCall.email).toBeUndefined();
    expect(mockUserCall.pendingEmail).toEqual(mockEmail);
    expect(mockUserCall.serviceIndicator).toEqual(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );
  });
});
