const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { createNewPractitionerUser } = require('./createNewPractitionerUser');
const { ROLES } = require('../../../business/entities/EntityConstants');

describe('createNewPractitionerUser', () => {
  beforeEach(() => {
    applicationContext.getCognito().adminUpdateUserAttributes.mockReturnValue({
      promise: () => null,
    });
  });

  it('should not log an error when creating a new cognito account for a practitioner user', async () => {
    applicationContext.getCognito().adminGetUser.mockReturnValue({
      promise: () => ({
        Username: 'practitionerusername',
      }),
    });
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: async () => ({
        Item: {
          name: 'Test Private Practitioner',
          role: ROLES.privatePractitioner,
          section: 'practitioner',
        },
      }),
    });

    await createNewPractitionerUser({
      applicationContext,
      user: {
        email: 'practitioner@example.com',
        name: 'Test Private Practitioner',
        role: ROLES.privatePractitioner,
        section: 'practitioner',
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
            Value: ROLES.privatePractitioner,
          },
          {
            Name: 'name',
            Value: 'Test Private Practitioner',
          },
        ]),
        Username: 'practitioner@example.com',
      }),
    );
  });
});
