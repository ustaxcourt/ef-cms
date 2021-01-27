const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  checkEmailAvailabilityInteractor,
} = require('./checkEmailAvailabilityInteractor');

describe('checkEmailAvailabilityInteractor', () => {
  const mockEmail = 'test@example.com';

  it('should attempt to retrieve the user by email', async () => {
    await checkEmailAvailabilityInteractor({
      applicationContext,
      email: mockEmail,
    });

    expect(
      applicationContext.getPersistenceGateway().getCognitoUserByEmail.mock
        .calls[0][0],
    ).toMatchObject({
      email: mockEmail,
    });
  });

  it('should return true when the specified email is not already in use', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCognitoUserByEmail.mockReturnValue(false);

    const result = await checkEmailAvailabilityInteractor({
      applicationContext,
      email: mockEmail,
    });

    expect(result).toBeTruthy();
  });

  it('should return false when the specified email is already in use', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCognitoUserByEmail.mockReturnValue(true);

    const result = await checkEmailAvailabilityInteractor({
      applicationContext,
      email: mockEmail,
    });

    expect(result).toBeFalsy();
  });
});
