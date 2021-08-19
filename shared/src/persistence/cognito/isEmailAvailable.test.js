const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { isEmailAvailable } = require('./isEmailAvailable');

describe('isEmailAvailable', () => {
  const mockEmail = 'hello@example.com';
  const mockFoundUser = { email: mockEmail };

  it('returns false when there is a corresponding user with the provided email found in cognito', async () => {
    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: () => Promise.resolve({ mockFoundUser }),
    });

    await expect(
      isEmailAvailable({
        applicationContext,
        email: mockEmail,
      }),
    ).resolves.toBeFalsy();
  });

  it('returns true when there is no corresponding user with the provided email found in cognito', async () => {
    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: () => Promise.reject(new Error('User does not exist')),
    });

    await expect(
      isEmailAvailable({
        applicationContext,
        email: mockEmail,
      }),
    ).resolves.toBeTruthy();
  });
});
