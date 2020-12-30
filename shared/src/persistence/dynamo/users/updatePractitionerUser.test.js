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

  it('should log an error', async () => {
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: async () => ({
        Item: {
          barNumber: 'PT1234',
          name: 'Test Practitioner',
          role: ROLES.inactivePractitioner,
          section: 'inactivePractitioner',
        },
      }),
    });
    const updatedUser = {
      barNumber: 'PT1234',
      name: 'Test Practitioner',
      role: ROLES.inactivePractitioner,
      section: 'inactivePractitioner',
    };

    await updatePractitionerUser({
      applicationContext,
      user: updatedUser,
    });

    expect(applicationContext.logger.error).toHaveBeenCalled();
  });
  it('should not log an error', async () => {
    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: () => null,
    });
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: async () => ({
        Item: {
          barNumber: 'PT1234',
          name: 'Test Practitioner',
          role: ROLES.inactivePractitioner,
          section: 'inactivePractitioner',
        },
      }),
    });
    const updatedUser = {
      barNumber: 'PT1234',
      name: 'Test Practitioner',
      role: ROLES.inactivePractitioner,
      section: 'inactivePractitioner',
    };

    await updatePractitionerUser({
      applicationContext,
      user: updatedUser,
    });

    expect(applicationContext.logger.error).not.toHaveBeenCalled();
  });

  it('attempts to update a private practitioner user to inactivePractitioner', async () => {
    const oldUser = {
      barNumber: 'PT1234',
      name: 'Test Private Practitioner',
      role: ROLES.privatePractitioner,
      section: 'privatePractitioner',
    };
    const updatedUser = {
      barNumber: 'PT1234',
      name: 'Test Private Practitioner',
      role: ROLES.inactivePractitioner,
      section: 'inactivePractitioner',
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
        pk: 'inactivePractitioner|Test Private Practitioner',
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

describe('updatePractitionerUser - with a cognito response', () => {
  beforeEach(() => {
    applicationContext.getCognito().adminUpdateUserAttributes.mockReturnValue({
      promise: () => null,
    });
  });

  it("should not log an error when updating a practitioner's Cognito attributes", async () => {
    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: () => ({
        Username: 'inactivePractitionerUsername',
      }),
    });
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: async () => ({
        Item: {
          barNumber: 'PT1234',
          name: 'Test Practitioner',
          role: ROLES.inactivePractitioner,
          section: 'inactivePractitioner',
        },
      }),
    });

    const updatedUser = {
      barNumber: 'PT1234',
      name: 'Test Practitioner',
      role: ROLES.inactivePractitioner,
      section: 'inactivePractitioner',
    };

    await updatePractitionerUser({
      applicationContext,
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

  it('should not log an error when creating a cognito practitioner user', async () => {
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

    const updatedUser = {
      email: 'practitioner@example.com',
      name: 'Test Admissions Clerk',
      role: ROLES.admissionsclerk,
      section: 'admissionsclerk',
    };

    await updatePractitionerUser({
      applicationContext,
      user: updatedUser,
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
});
