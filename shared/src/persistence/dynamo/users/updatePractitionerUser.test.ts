const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { ROLES } = require('../../../business/entities/EntityConstants');
const { updatePractitionerUser } = require('./updatePractitionerUser');

describe('updatePractitionerUser', () => {
  const userId = '9b52c605-edba-41d7-b045-d5f992a499d3';
  const updatedEmail = 'test@example.com';

  const updatedUser = {
    barNumber: 'PT1234',
    email: updatedEmail,
    name: 'Test Practitioner',
    role: ROLES.inactivePractitioner,
    section: 'inactivePractitioner',
  };

  beforeEach(() => {
    applicationContext.getCognito().adminUpdateUserAttributes.mockReturnValue({
      promise: () => null,
    });
  });

  it("should log an error when an error occurs while updating the user's cognito attributes", async () => {
    applicationContext.getCognito().adminUpdateUserAttributes.mockReturnValue({
      promise: () => Promise.reject(new Error('User not found')),
    });
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Item: updatedUser,
        }),
    });

    await expect(
      updatePractitionerUser({
        applicationContext,
        user: updatedUser,
      }),
    ).rejects.toThrow('User not found');
    expect(applicationContext.logger.error).toHaveBeenCalled();
  });

  it('should return updated practitioner data when the update was successful', async () => {
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Item: { ...updatedUser, userId },
        }),
    });

    const results = await updatePractitionerUser({
      applicationContext,
      user: { ...updatedUser, userId },
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

  it("should not log an error when updating an existing practitioner user's Cognito attributes", async () => {
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Item: updatedUser,
        }),
    });

    await updatePractitionerUser({
      applicationContext,
      isNewAccount: false,
      user: updatedUser,
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
});
