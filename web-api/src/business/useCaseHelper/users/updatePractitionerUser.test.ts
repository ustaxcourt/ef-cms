jest.mock('@web-api/persistence/postgres/users/upsertUsers');
import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
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
    applicationContext.getUserGateway().updateUser.mockResolvedValue();
  });

  it("should log an error when an error occurs while updating the user's cognito attributes", async () => {
    applicationContext
      .getUserGateway()
      .updateUser.mockRejectedValue(new Error('User not found'));

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
    expect(applicationContext.getUserGateway().updateUser).toHaveBeenCalledWith(
      applicationContext,
      {
        attributesToUpdate: {
          role: updatedUser.role,
        },
        email: updatedEmail,
      },
    );
  });

  it('should throw an error when neither email nor pendingEmail is set', async () => {
    await expect(
      updatePractitionerUser({
        applicationContext,
        user: {
          ...updatedUser,
          email: undefined,
          pendingEmail: undefined,
        } as any,
      }),
    ).rejects.toThrow('expected an email when updating a user record');
  });

  it("should update an existing practitioner user's Cognito attributes using the users pending email", async () => {
    updatedUser.email = undefined as any;
    updatedUser.pendingEmail = pendingEmail;

    await updatePractitionerUser({
      applicationContext,
      user: updatedUser as any,
    });

    expect(applicationContext.logger.error).not.toHaveBeenCalled();
    expect(applicationContext.getUserGateway().updateUser).toHaveBeenCalledWith(
      applicationContext,
      {
        attributesToUpdate: {
          role: updatedUser.role,
        },
        email: pendingEmail,
      },
    );
  });
});
