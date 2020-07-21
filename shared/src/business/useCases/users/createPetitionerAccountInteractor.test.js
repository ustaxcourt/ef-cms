const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  createPetitionerAccountInteractor,
} = require('./createPetitionerAccountInteractor');
const { ROLES } = require('../../entities/EntityConstants');

describe('createPetitionerAccountInteractor', () => {
  it('should attempt to persist the petitioner', async () => {
    applicationContext
      .getPersistenceGateway()
      .persistUser.mockReturnValue(null);

    await createPetitionerAccountInteractor({
      applicationContext,
      email: 'test@example.com',
      name: 'Cody',
      userId: '2fa6da8d-4328-4a20-a5d7-b76637e1dc02',
    });

    expect(
      applicationContext.getPersistenceGateway().persistUser.mock.calls[0][0]
        .user,
    ).toMatchObject({
      email: 'test@example.com',
      entityName: 'User',
      name: 'Cody',
      role: ROLES.petitioner,
      userId: '2fa6da8d-4328-4a20-a5d7-b76637e1dc02',
    });
  });

  it('should validate the user entity', async () => {
    applicationContext
      .getPersistenceGateway()
      .persistUser.mockReturnValue(null);

    let error = null;
    try {
      await createPetitionerAccountInteractor({
        applicationContext,
        name: 'Cody',
        userId: '2fa6da8d-4328-4a20-a5d7-b76637e1dc02',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
  });
});
