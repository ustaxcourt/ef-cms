const { onDisconnectInteractor } = require('./onDisconnectInteractor');

describe('deleteUserConnection', () => {
  let applicationContext;
  let deleteUserConnectionStub;

  beforeEach(() => {
    deleteUserConnectionStub = jest.fn();

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getCurrentUser: () => ({ userId: 'abc' }),
      getPersistenceGateway: () => ({
        deleteUserConnection: deleteUserConnectionStub,
      }),
    };
  });

  it('attempts to delete the user connection', async () => {
    await onDisconnectInteractor({
      applicationContext,
      connectionId: 'abc',
    });
    expect(deleteUserConnectionStub).toHaveBeenCalled();
  });
});
