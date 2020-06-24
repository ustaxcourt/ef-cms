const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { createUser, createUserRecords } = require('./createUser');
const { ROLES } = require('../../../business/entities/EntityConstants');

const userId = '9b52c605-edba-41d7-b045-d5f992a499d3';

const petitionsClerkUser = {
  name: 'Test Petitionsclerk',
  role: ROLES.petitionsClerk,
  section: 'petitions',
};

const privatePractitionerUser = {
  barNumber: 'pt1234', //intentionally lower case - should be converted to upper case when persisted
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

describe('createUser', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';

    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: async () =>
        Promise.resolve({
          Username: '562d6260-aa9b-4010-af99-536d3872c752',
        }),
    });

    applicationContext.getCognito().adminCreateUser.mockReturnValue({
      promise: async () =>
        Promise.resolve({
          User: { Username: '562d6260-aa9b-4010-af99-536d3872c752' },
        }),
    });

    applicationContext.getCognito().adminUpdateUserAttributes.mockReturnValue({
      promise: async () => Promise.resolve(),
    });

    applicationContext.getDocumentClient().put.mockReturnValue({
      promise: () => Promise.resolve(null),
    });
  });

  it('should call adminCreateUser', async () => {
    const petitionsclerkUser = {
      name: 'Test Petitionsclerk',
      role: ROLES.petitionsClerk,
      section: 'petitions',
    };

    await createUser({ applicationContext, user: petitionsclerkUser });

    expect(applicationContext.getCognito().adminCreateUser).toBeCalled();
    expect(applicationContext.getCognito().adminGetUser).not.toBeCalled();
    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).not.toBeCalled();
  });

  it('should call adminGetUser and adminUpdateUserAttributes if adminCreateUser throws an error', async () => {
    applicationContext.getCognito().adminCreateUser.mockReturnValue({
      promise: async () => {
        throw new Error('bad!');
      },
    });

    await createUser({ applicationContext, user: petitionsClerkUser });

    expect(applicationContext.getCognito().adminCreateUser).toBeCalled();
    expect(applicationContext.getCognito().adminGetUser).toBeCalled();
    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).toBeCalled();
  });

  it('attempts to persist a private practitioner user with name and barNumber mapping records', async () => {
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

  describe('createUserRecords', () => {
    it('attempts to persist a petitionsclerk user with a section mapping record', async () => {
      await createUserRecords({
        applicationContext,
        user: petitionsClerkUser,
        userId,
      });

      expect(applicationContext.getDocumentClient().put.mock.calls.length).toBe(
        2,
      );
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          pk: 'section|petitions',
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
          ...petitionsClerkUser,
        },
        TableName: 'efcms-dev',
      });
    });

    it('attempts to persist a judge user with a section mapping record for the chambers and the judge', async () => {
      const judgeUser = {
        name: 'Judge Adam',
        role: ROLES.judge,
        section: 'adamsChambers',
      };

      await createUserRecords({
        applicationContext,
        user: judgeUser,
        userId,
      });
      expect(applicationContext.getDocumentClient().put.mock.calls.length).toBe(
        3,
      );
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          pk: 'section|adamsChambers',
          sk: `user|${userId}`,
        },
        TableName: 'efcms-dev',
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          pk: 'section|judge',
          sk: `user|${userId}`,
        },
        TableName: 'efcms-dev',
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[2][0],
      ).toMatchObject({
        Item: {
          pk: `user|${userId}`,
          sk: `user|${userId}`,
          ...judgeUser,
        },
        TableName: 'efcms-dev',
      });
    });

    it('does not persist mapping records for practitioner without barNumber', async () => {
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
    });

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

    it('does not persist mapping records for practitioner without barNumber', async () => {
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

    it('does not persist section mapping record if user does not have a section', async () => {
      const privatePractitionerUserWithoutSection = {
        name: 'Test Private Practitioner',
        role: ROLES.privatePractitioner,
      };

      await createUserRecords({
        applicationContext,
        user: privatePractitionerUserWithoutSection,
        userId,
      });

      expect(applicationContext.getDocumentClient().put.mock.calls.length).toBe(
        1,
      );
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          pk: `user|${userId}`,
          sk: `user|${userId}`,
          ...privatePractitionerUserWithoutSection,
        },
        TableName: 'efcms-dev',
      });
    });
  });
});
