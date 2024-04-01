import { ROLES } from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { createNewPetitionerUser } from './createNewPetitionerUser';

describe('createNewPetitionerUser', () => {
  const mockUser = {
    entityName: 'User',
    name: 'Bob Ross',
    pendingEmail: 'petitioner@example.com',
    role: ROLES.petitioner,
    section: 'petitioner',
    userId: 'e6df170d-bc7d-428b-b0f2-decb3f9b83a8',
  };

  it('should make a call to create the specified user in persistence', async () => {
    await createNewPetitionerUser({
      applicationContext,
      user: mockUser,
    });

    expect(applicationContext.getUserGateway().createUser).toHaveBeenCalledWith(
      applicationContext,
      {
        attributesToUpdate: {
          email: mockUser.pendingEmail,
          name: mockUser.name,
          role: mockUser.role,
          userId: mockUser.userId,
        },
        email: mockUser.pendingEmail,
        resendInvitationEmail: false,
      },
    );
    expect(
      applicationContext.getDocumentClient().put.mock.calls[0][0].Item,
    ).toMatchObject({
      ...mockUser,
      pk: `user|${mockUser.userId}`,
      sk: `user|${mockUser.userId}`,
      userId: mockUser.userId,
    });
  });
});
