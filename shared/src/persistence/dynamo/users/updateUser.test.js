const sinon = require('sinon');
const { updateUser } = require('./updateUser');

describe('updateUser', () => {
  let applicationContext;
  let putStub;

  const userId = '9b52c605-edba-41d7-b045-d5f992a499d3';

  beforeEach(() => {
    putStub = sinon.stub().returns({
      promise: async () => null,
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        put: putStub,
      }),
    };
  });

  it('makes put request with the given user data for the matching user id', async () => {
    const user = {
      name: 'Test User',
      role: 'petitionsclerk',
      section: 'petitions',
      userId,
    };
    await updateUser({
      applicationContext,
      user,
    });

    expect(putStub.getCall(0).args[0]).toMatchObject({
      Item: {
        pk: userId,
        sk: userId,
        ...user,
      },
    });
  });
});
