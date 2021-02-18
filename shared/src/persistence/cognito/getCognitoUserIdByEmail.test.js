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

    const result = await getCognitoUserIdByEmail({
      applicationContext,
      email: mockEmail,
    });

    expect(result).toEqual(mockUserId);
  });

  it('returns the cognito custom user id if one is present when there is a corresponding user with the provided email found in cognito', async () => {
    const customMockUserId = '84cf1080-559f-4ba4-913b-27398b475bd7';

    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: async () => ({
        ...mockFoundUser,
        UserAttributes: [{ Name: 'custom:userId', Value: customMockUserId }],
      }),
    });

    const result = await getCognitoUserIdByEmail({
      applicationContext,
      email: mockEmail,
    });

    expect(result).toEqual(customMockUserId);
  });

  it('returns null when there is no corresponding user with the provided email found in cognito', async () => {
    applicationContext.getCognito().adminGetUser.mockRejectedValue({
      promise: async () => new Error('User does not exist'),
    });

    const result = await getCognitoUserIdByEmail({
      applicationContext,
      email: mockEmail,
    });

    expect(result).toBe(null);
  });
});
