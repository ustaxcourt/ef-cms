const sinon = require('sinon');
const { onDisconnectInteractor } = require('./onDisconnectInteractor');

describe('onDisconnectInteractor', () => {
  let applicationContext;

  it('deletes user connections from persistence', async () => {
    let error;
    let deleteUserConnectionSpy = sinon.stub().returns(Promise.resolve(true));

    try {
      applicationContext = {
        getPersistenceGateway: () => ({
          deleteUserConnection: deleteUserConnectionSpy,
        }),
      };
      await onDisconnectInteractor({
        applicationContext,
        connectionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(deleteUserConnectionSpy.called).toEqual(true);
    expect(deleteUserConnectionSpy.getCall(0).args[0]).toMatchObject({
      connectionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });
});
