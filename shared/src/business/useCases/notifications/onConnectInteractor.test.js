const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { onConnectInteractor } = require('./onConnectInteractor');

describe('onConnectInteractor', () => {
  it('attempts to save the user connection', async () => {
    await onConnectInteractor({
      applicationContext,
      connectionId: 'abc',
      endpoint: {},
    });

    expect(
      applicationContext.getPersistenceGateway().saveUserConnection,
    ).toHaveBeenCalled();
  });
});
