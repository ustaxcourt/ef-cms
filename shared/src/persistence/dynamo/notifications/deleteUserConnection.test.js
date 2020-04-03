const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteUserConnection } = require('./deleteUserConnection');

describe('deleteUserConnection', () => {
  beforeAll(() => {
    applicationContext.environment.stage = 'dev';
  });

  it('attempts to to delete the user connection', async () => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: async () => ({
        Items: [{ pk: 'connections-123', sk: 'abc' }],
      }),
    });

    await deleteUserConnection({
      applicationContext,
      connectionId: 'abc',
    });

    expect(
      applicationContext.getDocumentClient().batchWrite,
    ).toHaveBeenCalledWith({
      RequestItems: {
        'efcms-dev': [
          {
            DeleteRequest: {
              Key: {
                pk: 'connections-123',
                sk: 'abc',
              },
            },
          },
        ],
      },
    });
  });
});
