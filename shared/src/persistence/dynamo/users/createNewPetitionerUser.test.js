const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { createNewPetitionerUser } = require('./createNewPetitionerUser');
const { ROLES } = require('../../../business/entities/EntityConstants');

describe('createNewPetitionerUser', () => {
  beforeEach(() => {});

  it('should call adminCreateUser with the user email, name, and userId', async () => {
    const mockEmail = 'petitioner@example.com';
    const mockName = 'Bob Ross';
    const mockUserId = 'e6df170d-bc7d-428b-b0f2-decb3f9b83a8';

    await createNewPetitionerUser({
      applicationContext,
      user: {
        name: mockName,
        pendingEmail: mockEmail,
        role: ROLES.petitioner,
        section: 'petitioner',
        userId: mockUserId,
      },
    });

    expect(
      applicationContext.getCognito().adminCreateUser.mock.calls[0][0],
    ).toMatchObject({
      UserAttributes: expect.arrayContaining([
        {
          Name: 'email',
          Value: mockEmail,
        },
        {
          Name: 'name',
          Value: mockName,
        },
        {
          Name: 'custom:userId',
          Value: mockUserId,
        },
      ]),
      Username: mockEmail,
    });
  });

  it('should call client.put with the petitioner user record', async () => {
    const mockUserId = 'e6df170d-bc7d-428b-b0f2-decb3f9b83a8';
    const mockUser = {
      name: 'Bob Ross',
      pendingEmail: 'petitioner@example.com',
      role: ROLES.petitioner,
      section: 'petitioner',
      userId: mockUserId,
    };

    await createNewPetitionerUser({
      applicationContext,
      user: mockUser,
    });

    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0].Item,
    ).toMatchObject({
      ...mockUser,
      pk: `user|${mockUserId}`,
      sk: `user|${mockUserId}`,
      userId: mockUserId,
    });
  });
});
