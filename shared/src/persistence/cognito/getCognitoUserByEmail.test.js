const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { getCognitoUserByEmail } = require('./getCognitoUserByEmail');

describe('getCognitoUserByEmail', () => {
  const mockEmail = 'hello@example.com';
  const mockFoundUser = { email: mockEmail };

  it('returns a user when found in cognito', async () => {
    applicationContext.getCognito().listUsers.mockReturnValue({
      promise: async () => ({ Users: [mockFoundUser] }),
    });

    const result = await getCognitoUserByEmail({
      applicationContext,
      email: mockEmail,
    });

    expect(result).toBe(mockFoundUser);
  });

  it('returns null when no associated user is found in cognito', async () => {
    applicationContext.getCognito().listUsers.mockReturnValue({
      promise: async () => {
        return { Users: [] };
      },
    });

    const result = await getCognitoUserByEmail({
      applicationContext,
      email: mockEmail,
    });

    expect(result).toBe(null);
  });
});
