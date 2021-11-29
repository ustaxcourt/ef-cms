const {
  applicationContext,
} = require('../../../business/test/createTestApplicationContext');
const { deleteUserConnection } = require('./deleteUserConnection');

describe('deleteUserConnection', () => {
  it('attempts to to delete the user connection', async () => {
    applicationContext.getDocumentClient().get.mockReturnValueOnce({
      promise: () =>
        Promise.resolve({
          Item: {
            connectionId: '123',
            pk: 'connection|123',
            sk: 'connection|123',
            userId: 'abc',
          },
        }),
    });
    applicationContext.getDocumentClient().get.mockReturnValueOnce({
      promise: () =>
        Promise.resolve({
          Item: {
            pk: 'user|abc',
            sk: 'connection|123',
          },
        }),
    });

    await deleteUserConnection({
      applicationContext,
      connectionId: '123',
    });

    expect(
      applicationContext.getDocumentClient().batchWrite,
    ).toHaveBeenCalledWith({
      RequestItems: {
        'efcms-local': [
          {
            DeleteRequest: {
              Key: {
                pk: 'user|abc',
                sk: 'connection|123',
              },
            },
          },
          {
            DeleteRequest: {
              Key: {
                pk: 'connection|123',
                sk: 'connection|123',
              },
            },
          },
        ],
      },
    });
  });
});
