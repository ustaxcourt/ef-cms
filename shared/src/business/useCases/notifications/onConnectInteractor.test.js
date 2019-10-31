const { onConnectInteractor } = require('./onConnectInteractor');

describe('onConnectInteractor', () => {
  let applicationContext;
  let saveUserConnectionStub;

  beforeEach(() => {
    saveUserConnectionStub = jest.fn();

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getCurrentUser: () => ({ userId: 'abc' }),
      getPersistenceGateway: () => ({
        saveUserConnection: saveUserConnectionStub,
      }),
    };
  });

  it('attempts to save the user connection', async () => {
    await onConnectInteractor({
      applicationContext,
      connectionId: 'abc',
      endpoint: {},
    });
    expect(saveUserConnectionStub).toHaveBeenCalled();
  });
});
