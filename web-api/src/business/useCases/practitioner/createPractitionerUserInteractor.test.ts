import {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createPractitionerUserInteractor } from './createPractitionerUserInteractor';
import {
  mockAdmissionsClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';

describe('createPractitionerUserInteractor', () => {
  const mockUser: RawPractitioner = {
    admissionsDate: '2019-03-01',
    admissionsStatus: 'Active',
    barNumber: 'AT5678',
    birthYear: '2019',
    entityName: 'Practitioner',
    firmName: 'GW Law Offices',
    firstName: 'bob',
    lastName: 'sagot',
    name: 'Test Attorney',
    originalBarState: 'IL',
    practiceType: 'Private',
    practitionerType: 'Attorney',
    role: ROLES.privatePractitioner,
    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
    userId: '07044afe-641b-4d75-a84f-0698870b7650',
  };

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .createOrUpdatePractitionerUser.mockResolvedValue(mockUser);
  });

  it('should throw an error when the user is unauthorized to create a practitioner user', async () => {
    await expect(
      createPractitionerUserInteractor(
        applicationContext,
        {
          user: mockUser,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should return the practitioner`s bar number', async () => {
    const { barNumber } = await createPractitionerUserInteractor(
      applicationContext,
      {
        user: mockUser,
      },
      mockAdmissionsClerkUser,
    );

    expect(barNumber).toEqual(mockUser.barNumber);
  });

  it('should set practitioner.pendingEmail to practitioner.email and set practitioner.email to undefined', async () => {
    const mockEmail = 'testing@example.com';

    await createPractitionerUserInteractor(
      applicationContext,
      {
        user: {
          ...mockUser,
          email: mockEmail,
        },
      },
      mockAdmissionsClerkUser,
    );

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
