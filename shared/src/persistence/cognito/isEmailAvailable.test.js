const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { isEmailAvailable } = require('./isEmailAvailable');

describe('isEmailAvailable', () => {
  const mockEmail = 'hello@example.com';
  const mockFoundUser = { email: mockEmail };

  it('returns false when there is a corresponding user with the provided email found in cognito', async () => {
    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: async () => ({ mockFoundUser }),
    });

    const result = await isEmailAvailable({
      applicationContext,
      email: mockEmail,
    });

    expect(result).toBeFalsy();
  });

  it('returns true when there is no corresponding user with the provided email found in cognito', async () => {
    applicationContext.getCognito().adminGetUser.mockRejectedValue({
      promise: async () => new Error('User does not exist'),
    });

    const result = await isEmailAvailable({
      applicationContext,
      email: mockEmail,
    });

    expect(result).toBeTruthy();
  });
});
