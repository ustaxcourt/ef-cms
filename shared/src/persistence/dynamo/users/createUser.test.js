const { createUser, createUserRecords } = require('./createUser');
const { User } = require('../../../business/entities/User');

describe('createUser', () => {
  let applicationContext;
  let putStub;
  let adminCreateUserStub;
  const adminGetUserStub = jest.fn().mockReturnValue({
    promise: async () => ({
      Username: '562d6260-aa9b-4010-af99-536d3872c752',
    }),
  });
  const adminUpdateUserAttributesStub = jest.fn().mockReturnValue({
    promise: async () => null,
  });

  const userId = '9b52c605-edba-41d7-b045-d5f992a499d3';

  beforeEach(() => {
    jest.clearAllMocks();

    putStub = jest.fn().mockReturnValue({
      promise: async () => null,
    });
    adminCreateUserStub = jest.fn().mockReturnValue({
      promise: async () => ({
        User: { Username: '562d6260-aa9b-4010-af99-536d3872c752' },
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
    };
  });

  it('should call adminCreateUser', async () => {
    const petitionsclerkUser = {
      name: 'Test Petitionsclerk',
      role: User.ROLES.petitionsClerk,
      section: 'petitions',
    };
    await createUser({ applicationContext, user: petitionsclerkUser });

    expect(adminCreateUserStub).toBeCalled();
    expect(adminGetUserStub).not.toBeCalled();
    expect(adminUpdateUserAttributesStub).not.toBeCalled();
  });

  it('should call adminGetUser and adminUpdateUserAttributes if adminCreateUser throws an error', async () => {
    adminCreateUserStub = jest.fn().mockImplementation(() => {
      throw new Error('bad!');
    });

    const petitionsclerkUser = {
      name: 'Test Petitionsclerk',
      role: User.ROLES.petitionsClerk,
      section: 'petitions',
    };
    await createUser({ applicationContext, user: petitionsclerkUser });

    expect(adminCreateUserStub).toBeCalled();
    expect(adminGetUserStub).toBeCalled();
    expect(adminUpdateUserAttributesStub).toBeCalled();
  });

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

  describe('createUserRecords', () => {
    it('attempts to persist a petitionsclerk user with a section mapping record', async () => {
      const petitionsclerkUser = {
        name: 'Test Petitionsclerk',
        role: User.ROLES.petitionsClerk,
        section: 'petitions',
      };
      await createUserRecords({
        applicationContext,
        user: petitionsclerkUser,
        userId,
      });

      expect(putStub.mock.calls.length).toBe(2);
      expect(putStub.mock.calls[0][0]).toMatchObject({
        Item: {
          pk: 'section|petitions',
          sk: `user|${userId}`,
        },
        TableName: 'efcms-dev',
      });
      expect(putStub.mock.calls[1][0]).toMatchObject({
        Item: {
          pk: `user|${userId}`,
          sk: `user|${userId}`,
          ...petitionsclerkUser,
        },
        TableName: 'efcms-dev',
      });
    });

    it('attempts to persist a judge user with a section mapping record for the chambers and the judge', async () => {
      const judgeUser = {
        name: 'Judge Adam',
        role: User.ROLES.judge,
        section: 'adamsChambers',
      };
      await createUserRecords({
        applicationContext,
        user: judgeUser,
        userId,
      });

      expect(putStub.mock.calls.length).toBe(3);
      expect(putStub.mock.calls[0][0]).toMatchObject({
        Item: {
          pk: 'section|adamsChambers',
          sk: `user|${userId}`,
        },
        TableName: 'efcms-dev',
      });
      expect(putStub.mock.calls[1][0]).toMatchObject({
        Item: {
          pk: 'section|judge',
          sk: `user|${userId}`,
        },
        TableName: 'efcms-dev',
      });
      expect(putStub.mock.calls[2][0]).toMatchObject({
        Item: {
          pk: `user|${userId}`,
          sk: `user|${userId}`,
          ...judgeUser,
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
    });

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

    it('does not persist section mapping record if user does not have a section', async () => {
      const privatePractitionerUser = {
        name: 'Test Private Practitioner',
        role: User.ROLES.privatePractitioner,
      };
      await createUserRecords({
        applicationContext,
        user: privatePractitionerUser,
        userId,
      });

      expect(putStub.mock.calls.length).toBe(1);
      expect(putStub.mock.calls[0][0]).toMatchObject({
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
