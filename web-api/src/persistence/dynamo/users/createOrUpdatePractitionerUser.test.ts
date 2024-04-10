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
    applicationContext
      .getUserGateway()
      .getUserByEmail.mockResolvedValue(undefined);
  };

  it('should persist a private practitioner user with name and bar number mapping records but does NOT create a cognito account when they do not have an email address', async () => {
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

  it('should not persist mapping records for a practitioner that does NOT have a bar number', async () => {
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
    expect(
      applicationContext.getUserGateway().getUserByEmail,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUserGateway().updateUser,
    ).not.toHaveBeenCalled();
  });

  it('should create an account for a private practitioner user with email address', async () => {
    setupNonExistingUserMock();

    await createOrUpdatePractitionerUser({
      applicationContext,
      user: privatePractitionerUserWithSection as any,
    });

    expect(
      applicationContext.getUserGateway().createUser.mock.calls[0][1]
        .attributesToUpdate.email,
    ).toBe(privatePractitionerUserWithSection.email);
    expect(
      applicationContext.getUserGateway().updateUser,
    ).not.toHaveBeenCalled();
  });

  it('should create an account for a private practitioner user with pendingEmail when it is defined', async () => {
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
      applicationContext.getUserGateway().createUser.mock.calls[0][1]
        .attributesToUpdate.email,
    ).toBe(mockPendingEmail);
  });

  it('should create an account for an IRS practitioner user with email address', async () => {
    setupNonExistingUserMock();

    await createOrUpdatePractitionerUser({
      applicationContext,
      user: irsPractitionerUser as any,
    });

    expect(applicationContext.getUserGateway().createUser).toHaveBeenCalled();
    expect(
      applicationContext.getUserGateway().updateUser,
    ).not.toHaveBeenCalled();
  });

  it('should create an account for an inactive practitioner user with email address', async () => {
    setupNonExistingUserMock();

    await createOrUpdatePractitionerUser({
      applicationContext,
      user: inactivePractitionerUser as any,
    });

    expect(applicationContext.getUserGateway().createUser).toHaveBeenCalled();
    expect(
      applicationContext.getUserGateway().updateUser,
    ).not.toHaveBeenCalled();
  });

  it('should create an account for a private practitioner user with email address and use a random uniqueId if the response does not contain a username (for local testing)', async () => {
    setupNonExistingUserMock();

    await createOrUpdatePractitionerUser({
      applicationContext,
      user: privatePractitionerUserWithSection as any,
    });

    expect(applicationContext.getUserGateway().createUser).toHaveBeenCalled();
    expect(
      applicationContext.getUserGateway().updateUser,
    ).not.toHaveBeenCalled();
  });

  it('should throw an error when attempting to create a user that is NOT private practitioner, IRS practitioner or inactive practitioner', async () => {
    await expect(
      createOrUpdatePractitionerUser({
        applicationContext,
        user: otherUser as any,
      }),
    ).rejects.toThrow(
      `Role must be ${ROLES.privatePractitioner}, ${ROLES.irsPractitioner}, or ${ROLES.inactivePractitioner}`,
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
