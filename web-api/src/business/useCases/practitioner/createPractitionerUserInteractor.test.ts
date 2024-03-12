import {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { UnauthorizedError } from '@web-api/errors/errors';
import { admissionsClerkUser, petitionerUser } from '@shared/test/mockUsers';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createPractitionerUserInteractor } from './createPractitionerUserInteractor';

describe('createPractitionerUserInteractor', () => {
  const mockUser: RawPractitioner = {
    admissionsDate: '2019-03-01',
    admissionsStatus: 'Active',
    barNumber: 'AT5678',
    birthYear: '2019',
    employer: 'Private',
    entityName: 'Practitioner',
    firmName: 'GW Law Offices',
    firstName: 'bob',
    lastName: 'sagot',
    name: 'Test Attorney',
    originalBarState: 'IL',
    practitionerType: 'Attorney',
    role: ROLES.privatePractitioner,
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    userId: '07044afe-641b-4d75-a84f-0698870b7650',
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(admissionsClerkUser);
    applicationContext
      .getPersistenceGateway()
      .createOrUpdatePractitionerUser.mockResolvedValue(({ user }) => user);
  });

  it('should throw an error when the user is unauthorized to create a practitioner user', async () => {
    applicationContext.getCurrentUser.mockReturnValue(petitionerUser);

    await expect(
      createPractitionerUserInteractor(applicationContext, {
        user: mockUser,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should return the practitioner`s bar number', async () => {
    const { barNumber } = await createPractitionerUserInteractor(
      applicationContext,
      {
        user: mockUser,
      },
    );

    expect(barNumber).toEqual(mockUser.barNumber);
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
