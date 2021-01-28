const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  checkEmailAvailabilityInteractor,
} = require('./checkEmailAvailabilityInteractor');
const { ROLES } = require('../../entities/EntityConstants');

describe('checkEmailAvailabilityInteractor', () => {
  const mockEmail = 'test@example.com';

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.privatePractitioner,
    });
  });

  it('should throw an error when the logged in user is unauthorized to check email availability', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
    });

    await expect(
      checkEmailAvailabilityInteractor({
        applicationContext,
        email: mockEmail,
      }),
    ).rejects.toThrow('Unauthorized to manage emails.');
  });

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
      .getCognitoUserByEmail.mockReturnValue(null);

    const result = await checkEmailAvailabilityInteractor({
      applicationContext,
      email: mockEmail,
    });

    expect(result).toBeTruthy();
  });

  it('should return false when the specified email is already in use', async () => {
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
