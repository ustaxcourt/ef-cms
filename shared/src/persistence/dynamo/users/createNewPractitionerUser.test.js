const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { createNewPractitionerUser } = require('./createNewPractitionerUser');
const { ROLES } = require('../../../business/entities/EntityConstants');

describe('createNewPractitionerUser', () => {
  it('should not log an error when creating a new cognito account for a practitioner user', async () => {
    await createNewPractitionerUser({
      applicationContext,
      user: {
        email: 'practitioner@example.com',
        name: 'Test Private Practitioner',
        role: ROLES.privatePractitioner,
        section: 'practitioner',
      },
    });

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
