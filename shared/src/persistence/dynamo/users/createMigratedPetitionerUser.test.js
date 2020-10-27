const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const {
  createMigratedPetitionerUser,
  createUserRecords,
} = require('./createMigratedPetitionerUser');
const { ROLES } = require('../../../business/entities/EntityConstants');

describe('createMigratedPetitionerUser', () => {
  const userId = '9b52c605-edba-41d7-b045-d5f992a499d3';
  const petitionerUser = {
    email: 'petitioner@example.com',
    name: 'Test Petitioner',
    role: ROLES.petitioner,
  };

  beforeAll(() => {
    applicationContext.getCognito().adminCreateUser.mockReturnValue({
      promise: async () =>
        Promise.resolve({
          User: { Username: '562d6260-aa9b-4010-af99-536d3872c752' },
        }),
    });

    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: async () =>
        Promise.resolve({
          Username: '562d6260-aa9b-4010-af99-536d3872c752',
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
    await createMigratedPetitionerUser({
      applicationContext,
      user: petitionerUser,
    });

    expect(applicationContext.getCognito().adminCreateUser).toBeCalled();
  });

  it('should call adminCreateUser with the correct UserAttributes', async () => {
    await createMigratedPetitionerUser({
      applicationContext,
      user: petitionerUser,
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
          Value: 'petitioner@example.com',
        },
        {
          Name: 'custom:role',
          Value: 'petitioner',
        },
        {
          Name: 'name',
          Value: 'Test Petitioner',
        },
      ],
      UserPoolId: undefined,
      Username: 'petitioner@example.com',
    });
  });

  it('should call applicationContext.logger.error if adminCreateUser throws an error', async () => {
    applicationContext.getCognito().adminCreateUser.mockReturnValue({
      promise: async () => {
        throw new Error('bad!');
      },
    });

    await createMigratedPetitionerUser({
      applicationContext,
      user: petitionerUser,
    });

    expect(applicationContext.getCognito().adminCreateUser).toBeCalled();
    expect(applicationContext.logger.error).toBeCalledWith(new Error('bad!'));
  });

  describe('createUserRecords', () => {
    it('attempts to persist a petitioner user record with an email mapping record', async () => {
      await createUserRecords({
        applicationContext,
        user: petitionerUser,
        userId,
      });

      expect(applicationContext.getDocumentClient().put.mock.calls.length).toBe(
        2,
      );
      expect(
        applicationContext.getDocumentClient().put.mock.calls[0][0],
      ).toMatchObject({
        Item: {
          pk: `user|${userId}`,
          sk: `user|${userId}`,
          ...petitionerUser,
          userId,
        },
      });
      expect(
        applicationContext.getDocumentClient().put.mock.calls[1][0],
      ).toMatchObject({
        Item: {
          pk: `user-email|${petitionerUser.email}`,
          sk: `user|${userId}`,
          userId,
        },
      });
    });
  });
});
