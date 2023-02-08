import { ROLES } from '../../../business/entities/EntityConstants';
import { applicationContext } from '../../../business/test/createTestApplicationContext';
import { updatePractitionerUser } from './updatePractitionerUser';

describe('updatePractitionerUser', () => {
  const userId = '9b52c605-edba-41d7-b045-d5f992a499d3';
  const updatedEmail = 'test@example.com';
  const pendingEmail = 'pendingEmailExample@example.com';

  const updatedUser: {
    barNumber: string;
    email: string;
    role: string;
    name: string;
    section: string;
    pendingEmail?: string;
    userId: string;
  } = {
    barNumber: 'PT1234',
    email: updatedEmail,
    name: 'Test Practitioner',
    role: ROLES.privatePractitioner,
    section: 'privatePractitioner',
    userId,
  };

  beforeEach(() => {
    applicationContext.getCognito().adminUpdateUserAttributes.mockReturnValue({
      promise: () => null,
    });

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(updatedUser);

    applicationContext
      .getPersistenceGateway()
      .updateUserRecords.mockReturnValue(updatedUser);
  });

  it("should log an error when an error occurs while updating the user's cognito attributes", async () => {
    applicationContext.getCognito().adminUpdateUserAttributes.mockReturnValue({
      promise: () => Promise.reject(new Error('User not found')),
    });

    await expect(
      updatePractitionerUser({
        applicationContext,
        user: updatedUser as any,
      }),
    ).rejects.toThrow('User not found');
    expect(applicationContext.logger.error).toHaveBeenCalled();
  });

  it('should return updated practitioner data when the update was successful', async () => {
    const results = await updatePractitionerUser({
      applicationContext,
      user: updatedUser as any,
    });

    expect(applicationContext.logger.error).not.toHaveBeenCalled();
    expect(results).toMatchObject({
      barNumber: expect.anything(),
      name: expect.anything(),
      role: expect.anything(),
      section: expect.anything(),
      userId: expect.anything(),
    });
  });

  it("should update an existing practitioner user's Cognito attributes using the users email", async () => {
    await updatePractitionerUser({
      applicationContext,
      user: updatedUser as any,
    });

    expect(applicationContext.logger.error).not.toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        Username: updatedEmail,
      }),
    );
  });

  it("should update an existing practitioner user's Cognito attributes using the users pending email", async () => {
    updatedUser.email = undefined;
    updatedUser.pendingEmail = pendingEmail;

    await updatePractitionerUser({
      applicationContext,
      user: updatedUser as any,
    });

    expect(applicationContext.logger.error).not.toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        Username: pendingEmail,
      }),
    );
  });
});
