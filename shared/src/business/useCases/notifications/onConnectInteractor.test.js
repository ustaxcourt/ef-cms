const sinon = require('sinon');
const { onConnectInteractor } = require('./onConnectInteractor');
const { User } = require('../../entities/User');

describe('onConnectInteractor', () => {
  let applicationContext;

  it('saves user connection to persistence', async () => {
    let error;
    let saveUserConnectionSpy = sinon.stub().returns(Promise.resolve(true));

    try {
      applicationContext = {
        getCurrentUser: () => {
          return new User({
            name: 'Olivia Jade',
            role: 'petitionsclerk',
            userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          });
        },
        getPersistenceGateway: () => ({
          saveUserConnection: saveUserConnectionSpy,
        }),
      };
      await onConnectInteractor({
        applicationContext,
        connectionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        endpoint: 'xyz',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(saveUserConnectionSpy.called).toEqual(true);
    expect(saveUserConnectionSpy.getCall(0).args[0]).toMatchObject({
      connectionId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      endpoint: 'xyz',
    });
  });
});
