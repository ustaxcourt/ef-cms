const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { getCognitoUserIdByEmail } = require('./getCognitoUserIdByEmail');

describe('getCognitoUserIdByEmail', () => {
  const mockEmail = 'hello@example.com';
  const mockUserId = 'dc09201b-8196-4abb-8a4b-2ce5889461fe';
  const mockFoundUser = {
    UserAttributes: [],
    Username: mockUserId,
    email: mockEmail,
  };

  it('returns the cognito user id when there is a corresponding user with the provided email found in cognito', async () => {
    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: async () => mockFoundUser,
    });

    await expect(
      getCognitoUserIdByEmail({
        applicationContext,
        email: mockEmail,
      }),
    ).resolves.toEqual(mockUserId);
  });

  it('returns the cognito custom user id if one is present when there is a corresponding user with the provided email found in cognito', async () => {
    const customMockUserId = '84cf1080-559f-4ba4-913b-27398b475bd7';

    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: async () => ({
        ...mockFoundUser,
        UserAttributes: [{ Name: 'custom:userId', Value: customMockUserId }],
      }),
    });

    await expect(
      getCognitoUserIdByEmail({
        applicationContext,
        email: mockEmail,
      }),
    ).resolves.toEqual(customMockUserId);
  });

  it('returns null when there is no corresponding user with the provided email found in cognito', async () => {
    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: () => Promise.reject(new Error('User does not exist')),
    });

    await expect(
      getCognitoUserIdByEmail({
        applicationContext,
        email: mockEmail,
      }),
    ).resolves.toBe(null);
  });
});
