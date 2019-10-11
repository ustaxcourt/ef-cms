const sinon = require('sinon');
const { updateUserOnCase } = require('./updateUserOnCase');

describe('updateUserOnCase', () => {
  let putStub;
  beforeEach(() => {
    putStub = sinon.stub().returns({
      promise: async () => null,
    });
  });

  it('calls update of user record for the given user / case association', async () => {
    const applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        put: putStub,
      }),
    };
    await updateUserOnCase({
      applicationContext,
      caseId: '456',
      userToUpdate: {
        email: 'useremail@example.com',
        userId: '123',
      },
    });
    expect(putStub.getCall(0).args[0]).toMatchObject({
      Item: {
        email: 'useremail@example.com',
        pk: '123|case',
        sk: '456',
      },
      applicationContext: { environment: { stage: 'dev' } },
    });
  });
});
