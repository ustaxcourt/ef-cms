import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { checkEmailAvailabilityInteractor } from './checkEmailAvailabilityInteractor';

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
      checkEmailAvailabilityInteractor(applicationContext, {
        email: mockEmail,
      }),
    ).rejects.toThrow('Unauthorized to manage emails.');
  });

  it('should attempt to retrieve the user by email', async () => {
    await checkEmailAvailabilityInteractor(applicationContext, {
      email: mockEmail,
    });

    expect(
      applicationContext.getPersistenceGateway().isEmailAvailable.mock
        .calls[0][0],
    ).toMatchObject({
      email: mockEmail,
    });
  });

  it('should return true when the specified email is not already in use', async () => {
    applicationContext
      .getPersistenceGateway()
      .isEmailAvailable.mockReturnValue(true);

    const result = await checkEmailAvailabilityInteractor(applicationContext, {
      email: mockEmail,
    });

    expect(result).toBeTruthy();
  });

  it('should return false when the specified email is already in use', async () => {
    applicationContext
      .getPersistenceGateway()
      .isEmailAvailable.mockReturnValue(false);

    const result = await checkEmailAvailabilityInteractor(applicationContext, {
      email: mockEmail,
    });

    expect(result).toBeFalsy();
  });
});
