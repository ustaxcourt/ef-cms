import { UserNotFoundException } from '@aws-sdk/client-cognito-identity-provider';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { isEmailAvailable } from './isEmailAvailable';

describe('isEmailAvailable', () => {
  const mockEmail = 'hello@example.com';
  const mockFoundUser = { email: mockEmail };

  it('returns false when there is a corresponding user with the provided email found in cognito', async () => {
    applicationContext
      .getCognito()
      .adminGetUser.mockReturnValue({ mockFoundUser });

    await expect(
      isEmailAvailable({
        applicationContext,
        email: mockEmail,
      }),
    ).resolves.toBeFalsy();
  });

  it('returns true when there is no corresponding user with the provided email found in cognito', async () => {
    applicationContext
      .getCognito()
      .adminGetUser.mockRejectedValue(
        new UserNotFoundException({ $metadata: {}, message: '' }),
      );

    await expect(
      isEmailAvailable({
        applicationContext,
        email: mockEmail,
      }),
    ).resolves.toBeTruthy();
  });
});
