import {
  PETITIONS_SECTION,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createOrUpdateUser, createUserRecords } from './createOrUpdateUser';

const JUDGES_CHAMBERS_WITH_LEGACY = applicationContext
  .getPersistenceGateway()
  .getJudgesChambersWithLegacy();

describe('createOrUpdateUser', () => {
  const userId = '9b52c605-edba-41d7-b045-d5f992a499d3';
  const petitionsClerkUser = {
    email: 'test@example.com',
    name: 'Test Petitionsclerk',
    password: 'tempPass',
    role: ROLES.petitionsClerk,
    section: PETITIONS_SECTION,
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
  const caseServicesSupervisorUser = {
    name: 'Test Case Services Supervisor',
    role: ROLES.caseServicesSupervisor,
    section: 'caseServicesSupervisor',
  };

  beforeAll(() => {
    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Username: '562d6260-aa9b-4010-af99-536d3872c752',
        }),
    });

    applicationContext.getCognito().adminCreateUser.mockReturnValue({
      promise: () =>
        Promise.resolve({
          User: { Username: '562d6260-aa9b-4010-af99-536d3872c752' },
        }),
    });

    applicationContext.getCognito().adminUpdateUserAttributes.mockReturnValue({
      promise: () => Promise.resolve(),
    });

    applicationContext.getCognito().adminDisableUser.mockReturnValue({
      promise: () => Promise.resolve(),
    });

    applicationContext.getDocumentClient().put.mockResolvedValue(null);
  });

  it('should create a user only if the user does not already exist', async () => {
    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: () => {
        const error = new Error();
        (error as any).code = 'UserNotFoundException';
        return Promise.reject(error);
      },
    });

    await createOrUpdateUser({
      applicationContext,
      disableCognitoUser: false,
      password: petitionsClerkUser.password,
      user: petitionsClerkUser as any,
    });

    expect(
      applicationContext.getCognito().adminDisableUser,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).not.toHaveBeenCalled();
  });

  it('should create a user and cognito record, but disable the cognito user', async () => {
    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: () => {
        const error = new Error();
        (error as any).code = 'UserNotFoundException';
        return Promise.reject(error);
      },
    });

    await createOrUpdateUser({
      applicationContext,
      disableCognitoUser: true,
      password: petitionsClerkUser.password,
      user: petitionsClerkUser as any,
    });

    expect(applicationContext.getCognito().adminCreateUser).toHaveBeenCalled();
    expect(applicationContext.getCognito().adminDisableUser).toHaveBeenCalled();
    expect(applicationContext.getCognito().adminGetUser).toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).not.toHaveBeenCalled();
  });

  it('should call adminCreateUser with the correct UserAttributes', async () => {
    await createOrUpdateUser({
      applicationContext,
      disableCognitoUser: false,
      password: petitionsClerkUser.password,
      user: petitionsClerkUser as any,
    });
    expect(
      applicationContext.getCognito().adminCreateUser,
    ).toHaveBeenCalledWith({
      MessageAction: 'SUPPRESS',
      UserAttributes: [
        {
          Name: 'email_verified',
          Value: 'True',
        },
        {
          Name: 'email',
          Value: 'test@example.com',
        },
        {
          Name: 'custom:role',
          Value: 'petitionsclerk',
        },
        {
          Name: 'name',
          Value: 'Test Petitionsclerk',
        },
      ],
      UserPoolId: undefined,
      Username: 'test@example.com',
    });
  });

  it('should attempt to update the user if the user already exists', async () => {
    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Username: '562d6260-aa9b-4010-af99-536d3872c752',
        }),
    });

    await createOrUpdateUser({
      applicationContext,
      disableCognitoUser: false,
      password: petitionsClerkUser.password,
      user: petitionsClerkUser as any,
    });

    expect(
      applicationContext.getCognito().adminCreateUser,
    ).not.toHaveBeenCalled();
    expect(applicationContext.getCognito().adminGetUser).toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).toHaveBeenCalled();
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
        ...privatePractitionerUser,
        pk: `user|${userId}`,
        sk: `user|${userId}`,
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[1][0],
    ).toMatchObject({
      Item: {
        pk: 'privatePractitioner|TEST PRIVATE PRACTITIONER',
        sk: `user|${userId}`,
      },
    });
    expect(
      applicationContext.getDocumentClient().put.mock.calls[2][0],
    ).toMatchObject({
      Item: {
        pk: 'privatePractitioner|PT1234',
        sk: `user|${userId}`,
      },
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
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          ...petitionsClerkUser,
          pk: `user|${userId}`,
          sk: `user|${userId}`,
        },
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
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          pk: 'section|judge',
          sk: `user|${userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[2][0],
      ).toMatchObject({
        Item: {
          ...judgeUser,
          pk: `user|${userId}`,
          sk: `user|${userId}`,
        },
      });
    });

    it('attempts to persist a legacy judge user with a section mapping record for the chambers and the judge', async () => {
      const judgeUser = {
        name: 'Legacy Judge Ginsburg',
        role: ROLES.legacyJudge,
        section:
          JUDGES_CHAMBERS_WITH_LEGACY.LEGACY_JUDGES_CHAMBERS_SECTION.section,
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
          pk: `section|${JUDGES_CHAMBERS_WITH_LEGACY.LEGACY_JUDGES_CHAMBERS_SECTION.section}`,
          sk: `user|${userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          pk: 'section|judge',
          sk: `user|${userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[2][0],
      ).toMatchObject({
        Item: {
          ...judgeUser,
          pk: `user|${userId}`,
          sk: `user|${userId}`,
        },
      });
    });

    it('does not persist mapping records for practitioner without barNumber', async () => {
      await createUserRecords({
        applicationContext,
        user: privatePractitionerUserWithoutBarNumber,
        userId,
      });

      expect(applicationContext.getDocumentClient().put.mock.calls.length).toBe(
        1,
      );
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          ...privatePractitionerUserWithoutBarNumber,
          pk: `user|${userId}`,
          sk: `user|${userId}`,
        },
      });
    });

    it('attempts to persist a private practitioner user with name and barNumber mapping records', async () => {
      await createUserRecords({
        applicationContext,
        user: privatePractitionerUser,
        userId,
      });

      expect(applicationContext.getDocumentClient().put.mock.calls.length).toBe(
        3,
      );
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          ...privatePractitionerUser,
          pk: `user|${userId}`,
          sk: `user|${userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          pk: 'privatePractitioner|TEST PRIVATE PRACTITIONER',
          sk: `user|${userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[2][0],
      ).toMatchObject({
        Item: {
          pk: 'privatePractitioner|PT1234',
          sk: `user|${userId}`,
        },
      });
    });

    it('should persist a case services supervisor user with 3 section user mapping records (docket, petitions, and case services)', async () => {
      await createUserRecords({
        applicationContext,
        user: caseServicesSupervisorUser,
        userId,
      });

      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          pk: `section|${caseServicesSupervisorUser.section}`,
          sk: `user|${userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          pk: 'section|docket',
          sk: `user|${userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[2][0],
      ).toMatchObject({
        Item: {
          pk: 'section|petitions',
          sk: `user|${userId}`,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[3][0],
      ).toMatchObject({
        Item: {
          pk: `user|${userId}`,
          sk: `user|${userId}`,
        },
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
          ...privatePractitionerUserWithoutSection,
          pk: `user|${userId}`,
          sk: `user|${userId}`,
        },
      });
    });
  });
});
