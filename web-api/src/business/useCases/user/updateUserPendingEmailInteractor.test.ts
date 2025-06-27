import '@web-api/persistence/postgres/users/mocks.jest';
import { UnauthorizedError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import { updateUserPendingEmailInteractor } from './updateUserPendingEmailInteractor';
import { validUser } from '@shared/test/mockUsers';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { updateUser as updateUserMock } from '@web-api/persistence/postgres/users/updateUser';

const getUserById = getUserByIdMock as jest.Mock;
const updateUser = updateUserMock as jest.Mock;

describe('updateUserPendingEmailInteractor', () => {
  const pendingEmail = 'hello@example.com';
  let mockUser;

  beforeEach(() => {
    mockUser = {
      ...validUser,
      ...mockPrivatePractitionerUser,
      admissionsDate: '2019-03-01',
      admissionsStatus: 'Active',
      barNumber: 'RA3333',
      birthYear: '1950',
      entityName: 'Practitioner',
      firstName: 'Alden',
      lastName: 'Rivas',
      name: 'Alden Rivas',
      originalBarState: 'FL',
      practiceType: 'Private',
      practitionerType: 'Attorney',
    };

    getUserById.mockResolvedValue(mockUser);
    updateUser.mockResolvedValue(mockUser);
    applicationContext
      .getPersistenceGateway()
      .isEmailAvailable.mockReturnValue(true);
  });

  it('should throw unauthorized error when user does not have permission to manage emails', async () => {
    await expect(
      updateUserPendingEmailInteractor(
        applicationContext,
        {
          pendingEmail,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw an error when the pendingEmail address is not available in cognito', async () => {
    applicationContext
      .getPersistenceGateway()
      .isEmailAvailable.mockReturnValue(false);

    await expect(
      updateUserPendingEmailInteractor(
        applicationContext,
        {
          pendingEmail,
        },
        mockPrivatePractitionerUser,
      ),
    ).rejects.toThrow('Email is not available');
  });

  it('should make a call to getUserById with the logged in user.userId', async () => {
    await updateUserPendingEmailInteractor(
      applicationContext,
      {
        pendingEmail,
      },
      mockPrivatePractitionerUser,
    );

    expect(getUserById.mock.calls[0][0]).toMatchObject({
      userId: mockUser.userId,
    });
  });

  it('should update the user record in persistence with the pendingEmail value', async () => {
    await updateUserPendingEmailInteractor(
      applicationContext,
      {
        pendingEmail,
      },
      mockPrivatePractitionerUser,
    );

    expect(getUserById.mock.calls[0][0].userId).toEqual(
      mockPrivatePractitionerUser.userId,
    );
  });

  it('should return the updated User entity when currentUser.role is petitioner', async () => {
    const mockUserPetitioner = { ...validUser, ...mockPetitionerUser };
    getUserById.mockResolvedValueOnce(mockUserPetitioner);
    updateUser.mockResolvedValueOnce(mockUserPetitioner);

    const results = await updateUserPendingEmailInteractor(
      applicationContext,
      {
        pendingEmail,
      },
      mockPetitionerUser,
    );

    expect(results.entityName).toBe('User');
    expect(results).toMatchObject({
      ...mockUserPetitioner,
      pendingEmail,
      pendingEmailVerificationToken: expect.anything(),
    });
  });

  it('should return the updated Practitioner entity when currentUser.role is NOT petitioner', async () => {
    const results = await updateUserPendingEmailInteractor(
      applicationContext,
      {
        pendingEmail,
      },
      mockPrivatePractitionerUser,
    );

    expect(results.entityName).toBe('Practitioner');
    expect(results).toMatchObject({
      ...mockUser,
      pendingEmail,
      pendingEmailVerificationToken: expect.anything(),
    });
  });

  it('should call applicationContext.getUseCaseHelpers().sendEmailVerificationLink to send the verification link to the user', async () => {
    await updateUserPendingEmailInteractor(
      applicationContext,
      {
        pendingEmail,
      },
      mockPrivatePractitionerUser,
    );

    expect(
      applicationContext.getUseCaseHelpers().sendEmailVerificationLink.mock
        .calls[0][0],
    ).toMatchObject({
      pendingEmail,
      pendingEmailVerificationToken: expect.anything(),
    });
  });
});
