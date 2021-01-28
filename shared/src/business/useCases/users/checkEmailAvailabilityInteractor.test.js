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

  it('should return true if the specified email is not already in use', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCognitoUserByEmail.mockReturnValue(null);

    const result = await checkEmailAvailabilityInteractor({
      applicationContext,
      email: mockEmail,
    });

    expect(result).toBeTruthy();
  });

  it('should return false if the specified email is already in use', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCognitoUserByEmail.mockReturnValue({
        userId: 'd3e736fc-d7b2-4e2e-a058-9789e6f1d129',
      });

    const result = await checkEmailAvailabilityInteractor({
      applicationContext,
      email: mockEmail,
    });

    expect(result).toBeFalsy();
  });
});
