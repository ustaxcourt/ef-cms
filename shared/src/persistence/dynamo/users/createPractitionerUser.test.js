const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  createPractitionerUser,
  createUserRecords,
} = require('./createPractitionerUser');
const { ROLES } = require('../../../business/entities/EntityConstants');

const userId = '9b52c605-edba-41d7-b045-d5f992a499d3';

const privatePractitionerUser = {
  barNumber: 'pt1234', //intentionally lower case - should be converted to upper case when persisted
  name: 'Test Private Practitioner',
  role: ROLES.privatePractitioner,
  section: 'privatePractitioner',
};

const privatePractitionerUserWithSection = {
  barNumber: 'pt1234',
  email: 'test@example.com',
  name: 'Test Private Practitioner',
  role: ROLES.privatePractitioner,
  section: 'privatePractitioner',
};

const privatePractitionerUserWithoutBarNumber = {
  barNumber: '',
  name: 'Test Private Practitioner',
  role: ROLES.privatePractitioner,
  section: 'privatePractitioner',
};

const otherUser = {
  barNumber: 'pt1234',
  email: 'test@example.com',
  name: 'Test Other',
  role: ROLES.other,
  section: 'other',
};

describe('createPractitionerUser', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';

    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: async () =>
        Promise.resolve({
          Username: 'f7bea269-fa95-424d-aed8-2cb988df2073',
        }),
    });

    applicationContext.getCognito().adminCreateUser.mockReturnValue({
      promise: async () =>
        Promise.resolve({
          User: { Username: '123' },
        }),
    });

    applicationContext.getCognito().adminUpdateUserAttributes.mockReturnValue({
      promise: async () => Promise.resolve(),
    });

    applicationContext.getDocumentClient().put.mockReturnValue({
      promise: () => Promise.resolve(null),
    });
  });

  it('persists a private practitioner user with name and barNumber mapping records but does not call cognito adminCreateUser if there is no email address', async () => {
    await createUserRecords({
      applicationContext,
      user: privatePractitionerUser,
      userId,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: 'section|privatePractitioner',
        sk: `user|${userId}`,
      },
      TableName: 'efcms-dev',
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[1][0],
    ).toMatchObject({
      Item: {
        pk: `user|${userId}`,
        sk: `user|${userId}`,
        ...privatePractitionerUser,
      },
      TableName: 'efcms-dev',
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[2][0],
    ).toMatchObject({
      Item: {
        pk: 'privatePractitioner|Test Private Practitioner',
        sk: `user|${userId}`,
      },
      TableName: 'efcms-dev',
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[3][0],
    ).toMatchObject({
      Item: {
        pk: 'privatePractitioner|PT1234',
        sk: `user|${userId}`,
      },
      TableName: 'efcms-dev',
    });
  });

  it('does not persist mapping records for practitioner without barNumber', async () => {
    await createUserRecords({
      applicationContext,
      user: privatePractitionerUserWithoutBarNumber,
      userId,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0],
    ).toMatchObject({
      Item: {
        pk: 'section|privatePractitioner',
        sk: `user|${userId}`,
      },
      TableName: 'efcms-dev',
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[1][0],
    ).toMatchObject({
      Item: {
        pk: `user|${userId}`,
        sk: `user|${userId}`,
        ...privatePractitionerUserWithoutBarNumber,
      },
      TableName: 'efcms-dev',
    });

    await createPractitionerUser({
      applicationContext,
      user: privatePractitionerUserWithoutBarNumber,
    });

    expect(applicationContext.getCognito().adminCreateUser).not.toBeCalled();
    expect(applicationContext.getCognito().adminGetUser).not.toBeCalled();
    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).not.toBeCalled();
  });

  it('should call cognito adminCreateUser for a private practitioner user with email address', async () => {
    await createPractitionerUser({
      applicationContext,
      user: privatePractitionerUserWithSection,
    });

    expect(applicationContext.getCognito().adminCreateUser).toBeCalled();
    expect(applicationContext.getCognito().adminGetUser).not.toBeCalled();
    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).not.toBeCalled();
  });

  it('should call cognito adminCreateUser for a private practitioner user with email address and use a random uniqueId if the response does not contain a username (for local testing)', async () => {
    applicationContext.getCognito().adminCreateUser.mockReturnValue({
      promise: async () => Promise.resolve({}),
    });

    await createPractitionerUser({
      applicationContext,
      user: privatePractitionerUserWithSection,
    });

    expect(applicationContext.getCognito().adminCreateUser).toBeCalled();
    expect(applicationContext.getCognito().adminGetUser).not.toBeCalled();
    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).not.toBeCalled();
  });

  it('should call cognito adminGetUser and adminUpdateUserAttributes if adminCreateUser throws an error', async () => {
    applicationContext.getCognito().adminCreateUser.mockReturnValue({
      promise: async () => {
        throw new Error('bad!');
      },
    });

    await createPractitionerUser({
      applicationContext,
      user: privatePractitionerUserWithSection,
    });

    expect(applicationContext.getCognito().adminCreateUser).toBeCalled();
    expect(applicationContext.getCognito().adminGetUser).toBeCalled();
    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).toBeCalled();
  });

  it('should throw an error when attempting to create a user that is not role private or IRS practitioner', async () => {
    await expect(
      createPractitionerUser({ applicationContext, user: otherUser }),
    ).rejects.toThrow(
      'Practitioner users must have either private or IRS practitioner role',
    );
  });

  describe('createUserRecords', () => {
    it('attempts to persist a private practitioner user with name and barNumber mapping records', async () => {
      await createUserRecords({
        applicationContext,
        user: privatePractitionerUser,
        userId,
      });

      expect(applicationContext.getDocumentClient().put.mock.calls.length).toBe(
        4,
      );
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          pk: 'section|privatePractitioner',
          sk: `user|${userId}`,
        },
        TableName: 'efcms-dev',
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          pk: `user|${userId}`,
          sk: `user|${userId}`,
          ...privatePractitionerUser,
        },
        TableName: 'efcms-dev',
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[2][0],
      ).toMatchObject({
        Item: {
          pk: 'privatePractitioner|Test Private Practitioner',
          sk: `user|${userId}`,
        },
        TableName: 'efcms-dev',
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[3][0],
      ).toMatchObject({
        Item: {
          pk: 'privatePractitioner|PT1234',
          sk: `user|${userId}`,
        },
        TableName: 'efcms-dev',
      });
    });

    it('does not persist mapping records for private practitioner without barNumber', async () => {
      await createUserRecords({
        applicationContext,
        user: privatePractitionerUserWithoutBarNumber,
        userId,
      });

      expect(applicationContext.getDocumentClient().put.mock.calls.length).toBe(
        2,
      );
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          pk: 'section|privatePractitioner',
          sk: `user|${userId}`,
        },
        TableName: 'efcms-dev',
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          pk: `user|${userId}`,
          sk: `user|${userId}`,
          ...privatePractitionerUserWithoutBarNumber,
        },
        TableName: 'efcms-dev',
      });
    });
  });
});
