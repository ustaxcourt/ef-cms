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
        'efcms-local': expect.arrayContaining([
          expect.objectContaining({
            DeleteRequest: {
              Key: {
                pk: 'user|abc',
                sk: 'connection|123',
              },
            },
          }),
          expect.objectContaining({
            DeleteRequest: {
              Key: {
                pk: 'connection|123',
                sk: 'connection|123',
              },
            },
          }),
        ]),
      },
    });
  });

  it('if no connection is found given the connectionId, nothing else happens', async () => {
    // the connection must have expired via ttl
    applicationContext.getDocumentClient().get.mockReturnValueOnce({
      promise: () => Promise.resolve({}),
    });

    await deleteUserConnection({
      applicationContext,
      connectionId: '123',
    });

    expect(
      applicationContext.getDocumentClient().batchWrite,
    ).not.toHaveBeenCalled();
  });

  it('if no user connection is found given the connectionId, it only deletes the connection', async () => {
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
    // the user connection must have expired via ttl
    applicationContext.getDocumentClient().get.mockReturnValueOnce({
      promise: () => Promise.resolve({}),
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
