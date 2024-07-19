import { ROLES } from '@shared/business/entities/EntityConstants';
import { UserStatusType } from '@aws-sdk/client-cognito-identity-provider';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { checkEmailAvailabilityInteractor } from './checkEmailAvailabilityInteractor';
import {
  mockPetitionsClerkUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';

describe('checkEmailAvailabilityInteractor', () => {
  const mockEmail = 'test@example.com';

  it('should throw an error when the logged in user is unauthorized to check email availability', async () => {
    await expect(
      checkEmailAvailabilityInteractor(
        applicationContext,
        {
          email: mockEmail,
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('Unauthorized to manage emails.');
  });

  it('should attempt to retrieve the user by email', async () => {
    await checkEmailAvailabilityInteractor(
      applicationContext,
      {
        email: mockEmail,
      },
      mockPrivatePractitionerUser,
    );

    expect(
      applicationContext.getUserGateway().getUserByEmail.mock.calls[0][1],
    ).toMatchObject({
      email: mockEmail,
    });
  });

  it('should return true when the specified email is not already in use', async () => {
    applicationContext.getUserGateway().getUserByEmail.mockReturnValue();

    const result = await checkEmailAvailabilityInteractor(
      applicationContext,
      {
        email: mockEmail,
      },
      mockPrivatePractitionerUser,
    );

    expect(result.isEmailAvailable).toEqual(true);
  });

  it('should return false when the specified email is already in use', async () => {
    applicationContext.getUserGateway().getUserByEmail.mockReturnValue({
      accountStatus: UserStatusType.CONFIRMED,
      email: mockEmail,
      name: 'Test Petitioner',
      role: ROLES.petitioner,
      userId: '85e2ca3e-6521-4b10-8edb-91c934c78c43',
    });

    const result = await checkEmailAvailabilityInteractor(
      applicationContext,
      {
        email: mockEmail,
      },
      mockPrivatePractitionerUser,
    );

    expect(result.isEmailAvailable).toEqual(false);
  });
});
