const {
  createAttorneyUser,
  createUserRecords,
} = require('./createAttorneyUser');
const { User } = require('../../../business/entities/User');

describe('createAttorneyUser', () => {
  let applicationContext;
  let putStub;
  let adminCreateUserStub;
  const adminGetUserStub = jest.fn().mockReturnValue({
    promise: async () => ({
      Username: 'f7bea269-fa95-424d-aed8-2cb988df2073',
    }),
  });
  const adminUpdateUserAttributesStub = jest.fn().mockReturnValue({
    promise: async () => null,
  });

  const userId = '9b52c605-edba-41d7-b045-d5f992a499d3';

  beforeEach(() => {
    putStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });
    adminCreateUserStub = jest.fn().mockReturnValue({
      promise: async () => ({
        User: { Username: '123' },
      }),
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getCognito: () => ({
        adminCreateUser: adminCreateUserStub,
        adminGetUser: adminGetUserStub,
        adminUpdateUserAttributes: adminUpdateUserAttributesStub,
      }),
      getDocumentClient: () => ({
        put: putStub,
      }),
      getUniqueId: () => 'cd287d54-34aa-4bc5-b3f3-b9e45035e06b',
    };
  });

  it('persists a private practitioner user with name and barNumber mapping records but does not call cognito adminCreateUser if there is no email address', async () => {
    const privatePractitionerUser = {
      barNumber: 'PT1234',
      name: 'Test Private Practitioner',
      role: User.ROLES.privatePractitioner,
      section: 'privatePractitioner',
    };
    await createUserRecords({
      applicationContext,
      user: privatePractitionerUser,
      userId,
    });

    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        pk: 'section|privatePractitioner',
        sk: `user|${userId}`,
      },
      TableName: 'efcms-dev',
    });
    expect(putStub.mock.calls[1][0]).toMatchObject({
      Item: {
        pk: `user|${userId}`,
        sk: `user|${userId}`,
        ...privatePractitionerUser,
      },
      TableName: 'efcms-dev',
    });
    expect(putStub.mock.calls[2][0]).toMatchObject({
      Item: {
        pk: 'privatePractitioner|Test Private Practitioner',
        sk: `user|${userId}`,
      },
      TableName: 'efcms-dev',
    });
    expect(putStub.mock.calls[3][0]).toMatchObject({
      Item: {
        pk: 'privatePractitioner|PT1234',
        sk: `user|${userId}`,
      },
      TableName: 'efcms-dev',
    });
  });

  it('does not persist mapping records for practitioner without barNumber', async () => {
    const privatePractitionerUser = {
      barNumber: '',
      name: 'Test Private Practitioner',
      role: User.ROLES.privatePractitioner,
      section: 'privatePractitioner',
    };
    await createUserRecords({
      applicationContext,
      user: privatePractitionerUser,
      userId,
    });

    expect(putStub.mock.calls[0][0]).toMatchObject({
      Item: {
        pk: 'section|privatePractitioner',
        sk: `user|${userId}`,
      },
      TableName: 'efcms-dev',
    });
    expect(putStub.mock.calls[1][0]).toMatchObject({
      Item: {
        pk: `user|${userId}`,
        sk: `user|${userId}`,
        ...privatePractitionerUser,
      },
      TableName: 'efcms-dev',
    });

    await createAttorneyUser({
      applicationContext,
      user: privatePractitionerUser,
    });
    expect(adminCreateUserStub).not.toBeCalled();
    expect(adminGetUserStub).not.toBeCalled();
    expect(adminUpdateUserAttributesStub).not.toBeCalled();
  });

  it('should call cognito adminCreateUser for a private practitioner user with email address', async () => {
    const privatePractitionerUser = {
      barNumber: 'PT1234',
      email: 'test@example.com',
      name: 'Test Private Practitioner',
      role: User.ROLES.privatePractitioner,
      section: 'privatePractitioner',
    };

    await createAttorneyUser({
      applicationContext,
      user: privatePractitionerUser,
    });
    expect(adminCreateUserStub).toBeCalled();
    expect(adminGetUserStub).not.toBeCalled();
    expect(adminUpdateUserAttributesStub).not.toBeCalled();
  });

  it('should call cognito adminCreateUser for a private practitioner user with email address and use a random uniqueId if the response does not contain a username (for local testing)', async () => {
    adminCreateUserStub = jest.fn().mockReturnValue({
      promise: async () => ({}),
    });

    const privatePractitionerUser = {
      barNumber: 'PT1234',
      email: 'test@example.com',
      name: 'Test Private Practitioner',
      role: User.ROLES.privatePractitioner,
      section: 'privatePractitioner',
    };

    await createAttorneyUser({
      applicationContext,
      user: privatePractitionerUser,
    });
    expect(adminCreateUserStub).toBeCalled();
    expect(adminGetUserStub).not.toBeCalled();
    expect(adminUpdateUserAttributesStub).not.toBeCalled();
  });

  it('should call cognito adminGetUser and adminUpdateUserAttributes if adminCreateUser throws an error', async () => {
    adminCreateUserStub = jest.fn().mockImplementation(() => {
      throw new Error('bad!');
    });

    const privatePractitionerUser = {
      barNumber: 'PT1234',
      email: 'test@example.com',
      name: 'Test Private Practitioner',
      role: User.ROLES.privatePractitioner,
      section: 'privatePractitioner',
    };

    await createAttorneyUser({
      applicationContext,
      user: privatePractitionerUser,
    });
    expect(adminCreateUserStub).toBeCalled();
    expect(adminGetUserStub).toBeCalled();
    expect(adminUpdateUserAttributesStub).toBeCalled();
  });

  it('should throw an error when attempting to create a user that is not role private or IRS practitioner', async () => {
    const otherUser = {
      barNumber: 'PT1234',
      email: 'test@example.com',
      name: 'Test Other',
      role: User.ROLES.other,
      section: 'other',
    };

    await expect(
      createAttorneyUser({ applicationContext, user: otherUser }),
    ).rejects.toThrow(
      'Attorney users must have either private or IRS practitioner role',
    );
  });

  describe('createUserRecords', () => {
    it('attempts to persist a private practitioner user with name and barNumber mapping records', async () => {
      const privatePractitionerUser = {
        barNumber: 'PT1234',
        name: 'Test Private Practitioner',
        role: User.ROLES.privatePractitioner,
        section: 'privatePractitioner',
      };
      await createUserRecords({
        applicationContext,
        user: privatePractitionerUser,
        userId,
      });

      expect(putStub.mock.calls.length).toBe(4);
      expect(putStub.mock.calls[0][0]).toMatchObject({
        Item: {
          pk: 'section|privatePractitioner',
          sk: `user|${userId}`,
        },
        TableName: 'efcms-dev',
      });
      expect(putStub.mock.calls[1][0]).toMatchObject({
        Item: {
          pk: `user|${userId}`,
          sk: `user|${userId}`,
          ...privatePractitionerUser,
        },
        TableName: 'efcms-dev',
      });
      expect(putStub.mock.calls[2][0]).toMatchObject({
        Item: {
          pk: 'privatePractitioner|Test Private Practitioner',
          sk: `user|${userId}`,
        },
        TableName: 'efcms-dev',
      });
      expect(putStub.mock.calls[3][0]).toMatchObject({
        Item: {
          pk: 'privatePractitioner|PT1234',
          sk: `user|${userId}`,
        },
        TableName: 'efcms-dev',
      });
    });

    it('does not persist mapping records for private practitioner without barNumber', async () => {
      const privatePractitionerUser = {
        barNumber: '',
        name: 'Test Private Practitioner',
        role: User.ROLES.privatePractitioner,
        section: 'privatePractitioner',
      };
      await createUserRecords({
        applicationContext,
        user: privatePractitionerUser,
        userId,
      });

      expect(putStub.mock.calls.length).toBe(2);
      expect(putStub.mock.calls[0][0]).toMatchObject({
        Item: {
          pk: 'section|privatePractitioner',
          sk: `user|${userId}`,
        },
        TableName: 'efcms-dev',
      });
      expect(putStub.mock.calls[1][0]).toMatchObject({
        Item: {
          pk: `user|${userId}`,
          sk: `user|${userId}`,
          ...privatePractitionerUser,
        },
        TableName: 'efcms-dev',
      });
    });
  });
});
