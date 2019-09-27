const sinon = require('sinon');
const { deleteUserConnection } = require('./deleteUserConnection');

describe('deleteUserConnection', () => {
  let applicationContext;
  let deleteStub;
  let queryStub;

  beforeEach(() => {
    deleteStub = jest.fn(() => ({ promise: async () => null }));
    queryStub = sinon.stub().returns({
      promise: async () => ({
        Items: [{ pk: 'connections-123', sk: 'abc' }],
      }),
    });

    applicationContext = {
      environment: {
        stage: 'dev',
      },
      getDocumentClient: () => ({
        delete: deleteStub,
        query: queryStub,
      }),
    };
  });

  it('attempts to to delete the user connection', async () => {
    await deleteUserConnection({
      applicationContext,
      connectionId: 'abc',
    });

    expect(deleteStub).toHaveBeenCalledWith({
      Key: {
        pk: 'connections-123',
        sk: 'abc',
      },
      TableName: 'efcms-dev',
    });
  });
});
