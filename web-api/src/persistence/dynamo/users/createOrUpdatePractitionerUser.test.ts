import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  createOrUpdatePractitionerUser,
  createUserRecords,
} from './createOrUpdatePractitionerUser';

describe('createOrUpdatePractitionerUser', () => {
  const oldEnv = process.env;

  afterAll(() => {
    process.env = oldEnv;
  });

  const userId = '9b52c605-edba-41d7-b045-d5f992a499d3';
  const privatePractitionerUser = {
    barNumber: 'pt1234',
    email: 'test@example.com',
    name: 'Test Private Practitioner',
    role: ROLES.privatePractitioner,
    section: 'privatePractitioner',
    userId,
  };
  const irsPractitionerUser = {
    barNumber: 'pt1234',
    email: 'test@example.com',
    name: 'Test IRS Practitioner',
    role: ROLES.irsPractitioner,
    section: 'privatePractitioner',
  };
  const inactivePractitionerUser = {
    barNumber: 'pt1234',
    email: 'test@example.com',
    name: 'Test Inactive Practitioner',
    role: ROLES.inactivePractitioner,
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
    role: 'other',
    section: 'other',
  };

  const setupNonExistingUserMock = () => {
    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: () => {
        const error = new Error();
        (error as any).code = 'UserNotFoundException';
        return Promise.reject(error);
      },
    });
  };

  beforeAll(() => {
    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Username: 'f7bea269-fa95-424d-aed8-2cb988df2073',
        }),
    });

    applicationContext.getCognito().adminCreateUser.mockReturnValue({
      promise: () =>
        Promise.resolve({
          User: { Username: userId },
        }),
    });

    applicationContext.getCognito().adminUpdateUserAttributes.mockReturnValue({
      promise: () => Promise.resolve(),
    });

    applicationContext.getDocumentClient().put.mockResolvedValue(null);
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
        ...privatePractitionerUserWithoutBarNumber,
        pk: `user|${userId}`,
        sk: `user|${userId}`,
      },
    });

    await createOrUpdatePractitionerUser({
      applicationContext,
      user: privatePractitionerUserWithoutBarNumber as any,
    });

    expect(
      applicationContext.getCognito().adminCreateUser,
    ).not.toHaveBeenCalled();
    expect(applicationContext.getCognito().adminGetUser).not.toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).not.toHaveBeenCalled();
  });

  it('should call cognito adminCreateUser for a private practitioner user with email address', async () => {
    setupNonExistingUserMock();

    await createOrUpdatePractitionerUser({
      applicationContext,
      user: privatePractitionerUserWithSection as any,
    });

    expect(
      applicationContext.getCognito().adminCreateUser.mock.calls[0][0].Username,
    ).toBe(privatePractitionerUserWithSection.email);
    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).not.toHaveBeenCalled();
  });

  it('should call cognito adminCreateUser for a private practitioner user with pendingEmail when it is defined', async () => {
    const mockPendingEmail = 'noone@example.com';
    setupNonExistingUserMock();

    await createOrUpdatePractitionerUser({
      applicationContext,
      user: {
        ...privatePractitionerUserWithSection,
        email: undefined,
        pendingEmail: mockPendingEmail,
      } as any,
    });

    expect(
      applicationContext.getCognito().adminCreateUser.mock.calls[0][0].Username,
    ).toBe(mockPendingEmail);
  });

  it('should call cognito adminCreateUser for an IRS practitioner user with email address', async () => {
    setupNonExistingUserMock();

    await createOrUpdatePractitionerUser({
      applicationContext,
      user: irsPractitionerUser as any,
    });

    expect(applicationContext.getCognito().adminCreateUser).toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).not.toHaveBeenCalled();
  });

  it('should call cognito adminCreateUser for an inactive practitioner user with email address', async () => {
    setupNonExistingUserMock();

    await createOrUpdatePractitionerUser({
      applicationContext,
      user: inactivePractitionerUser as any,
    });

    expect(applicationContext.getCognito().adminCreateUser).toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).not.toHaveBeenCalled();
  });

  it('should call cognito adminCreateUser for a private practitioner user with email address and use a random uniqueId if the response does not contain a username (for local testing)', async () => {
    applicationContext.getCognito().adminCreateUser.mockReturnValue({
      promise: () => Promise.resolve({}),
    });
    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: () => {
        const error = new Error();
        (error as any).code = 'UserNotFoundException';
        return Promise.reject(error);
      },
    });

    await createOrUpdatePractitionerUser({
      applicationContext,
      user: privatePractitionerUserWithSection as any,
    });

    expect(applicationContext.getCognito().adminCreateUser).toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).not.toHaveBeenCalled();
  });

  it('should call cognito adminGetUser and adminUpdateUserAttributes if adminCreateUser throws an error', async () => {
    applicationContext.getCognito().adminCreateUser.mockReturnValue({
      promise: () => Promise.reject(new Error('bad!')),
    });

    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Username: '562d6260-aa9b-4010-af99-536d3872c752',
        }),
    });

    await createOrUpdatePractitionerUser({
      applicationContext,
      user: privatePractitionerUserWithSection as any,
    });

    expect(
      applicationContext.getCognito().adminCreateUser,
    ).not.toHaveBeenCalled();
    expect(applicationContext.getCognito().adminGetUser).toHaveBeenCalled();
    expect(
      applicationContext.getCognito().adminUpdateUserAttributes,
    ).toHaveBeenCalled();
  });

  it('should throw an error when attempting to create a user that is not role private, IRS practitioner or inactive practitioner', async () => {
    await expect(
      createOrUpdatePractitionerUser({
        applicationContext,
        user: otherUser as any,
      }),
    ).rejects.toThrow(
      `Role must be ${ROLES.privatePractitioner}, ${ROLES.irsPractitioner}, or ${ROLES.inactivePractitioner}`,
    );
  });

  it('should call adminCreateUser with the correct UserAttributes', async () => {
    applicationContext.getCognito().adminCreateUser.mockReturnValue({
      promise: () =>
        Promise.resolve({
          User: { Username: '123' },
        }),
    });

    setupNonExistingUserMock();

    await createOrUpdatePractitionerUser({
      applicationContext,
      user: privatePractitionerUser as any,
    });

    expect(
      applicationContext.getCognito().adminCreateUser,
    ).toHaveBeenCalledWith({
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
          Value: 'privatePractitioner',
        },
        {
          Name: 'name',
          Value: 'Test Private Practitioner',
        },
      ],
      UserPoolId: undefined,
      Username: 'test@example.com',
    });
  });

  it('should call adminCreateUser with the correct params when USE_COGNITO_LOCAL is true', async () => {
    process.env.USE_COGNITO_LOCAL = 'true';
    process.env.USER_POOL_ID = 'localUserPoolId';

    // setupNonExistingUserMock();

    await createOrUpdatePractitionerUser({
      applicationContext,
      user: privatePractitionerUser as any,
    });

    expect(
      applicationContext.getCognito().adminCreateUser,
    ).toHaveBeenCalledWith({
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
          Value: 'privatePractitioner',
        },
        {
          Name: 'name',
          Value: 'Test Private Practitioner',
        },
      ],
      UserPoolId: 'localUserPoolId',
      Username: 'test@example.com',
    });
  });

  describe('createUserRecords', () => {
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

    it('does not persist mapping records for private practitioner without barNumber', async () => {
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
  });
});
