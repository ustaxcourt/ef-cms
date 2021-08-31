const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteUserConnection } = require('./deleteUserConnection');

describe('deleteUserConnection', () => {
  it('attempts to to delete the user connection', async () => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () =>
        Promise.resolve({
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
        'efcms-local': [
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
