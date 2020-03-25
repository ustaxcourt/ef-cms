const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { onDisconnectInteractor } = require('./onDisconnectInteractor');

describe('deleteUserConnection', () => {
  it('attempts to delete the user connection', async () => {
    await onDisconnectInteractor({
      applicationContext,
      connectionId: 'abc',
    });

    expect(
      applicationContext.getPersistenceGateway().deleteUserConnection,
    ).toHaveBeenCalled();
  });
});
