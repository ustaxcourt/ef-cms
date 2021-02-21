const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  updatePractitionerUser,
  updateUserRecords,
} = require('./updatePractitionerUser');
const { ROLES } = require('../../../business/entities/EntityConstants');

describe('updatePractitionerUser', () => {
  const userId = '9b52c605-edba-41d7-b045-d5f992a499d3';

  const updatedUser = {
    barNumber: 'PT1234',
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
    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: () => Promise.reject(new Error('User not found')),
    });
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: async () => ({
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
    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: () => null,
    });
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: async () => ({
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
    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: () => ({
        Username: 'inactivePractitionerUsername',
      }),
    });
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: async () => ({
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
        Username: 'inactivePractitionerUsername',
      }),
    );
  });

  it('should not log an error when creating a new cognito account for a practitioner user', async () => {
    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: () => ({
        Username: 'admissionsclerkUsername',
      }),
    });
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: async () => ({
        Item: {
          name: 'Test Admissions Clerk',
          role: ROLES.admissionsclerk,
          section: 'admissionsclerk',
        },
      }),
    });

    await updatePractitionerUser({
      applicationContext,
      isNewAccount: true,
      user: {
        email: 'practitioner@example.com',
        name: 'Test Admissions Clerk',
        role: ROLES.admissionsclerk,
        section: 'admissionsclerk',
      },
    });

    expect(applicationContext.logger.error).not.toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminCreateUser,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        UserAttributes: expect.arrayContaining([
          {
            Name: 'email_verified',
            Value: 'True',
          },
          {
            Name: 'email',
            Value: 'practitioner@example.com',
          },
          {
            Name: 'custom:role',
            Value: ROLES.admissionsclerk,
          },
          {
            Name: 'name',
            Value: 'Test Admissions Clerk',
          },
        ]),
        Username: 'practitioner@example.com',
      }),
    );
  });

  describe('updateUserRecords', () => {
    it('should successfully update a private practitioner user to inactivePractitioner', async () => {
      const oldUser = {
        barNumber: 'PT1234',
        name: 'Test Private Practitioner',
        role: ROLES.privatePractitioner,
        section: 'privatePractitioner',
      };

      await updateUserRecords({
        applicationContext,
        oldUser,
        updatedUser,
        userId,
      });

      expect(
        applicationContext.getDocumentClient().delete.mock.calls[0][0],
      ).toMatchObject({
        Key: {
          pk: 'section|privatePractitioner',
          sk: `user|${userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          pk: `user|${userId}`,
          sk: `user|${userId}`,
          ...updatedUser,
          userId,
        },
      });
      expect(
        applicationContext.getDocumentClient().delete.mock.calls[1][0],
      ).toMatchObject({
        Key: {
          pk: 'privatePractitioner|Test Private Practitioner',
          sk: `user|${userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().delete.mock.calls[2][0],
      ).toMatchObject({
        Key: {
          pk: 'privatePractitioner|PT1234',
          sk: `user|${userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          pk: 'inactivePractitioner|Test Practitioner',
          sk: `user|${userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[2][0],
      ).toMatchObject({
        Item: {
          pk: 'inactivePractitioner|PT1234',
          sk: `user|${userId}`,
        },
      });
    });
  });
});
