import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { batchDelete, get } from '../../dynamodbClientService';
import { deleteUserConnection } from './deleteUserConnection';

jest.mock('../../dynamodbClientService');

const getMock = get as jest.Mock;
const batchDeleteMock = batchDelete as jest.Mock;

describe('deleteUserConnection', () => {
  it('attempts to to delete the user connection', async () => {
    getMock.mockReturnValueOnce({
      connectionId: '123',
      pk: 'connection|123',
      sk: 'connection|123',
      userId: 'abc',
    });
    getMock.mockReturnValueOnce({
      pk: 'user|abc',
      sk: 'connection|123',
    });

    await deleteUserConnection({
      applicationContext,
      connectionId: '123',
    });

    expect(batchDeleteMock.mock.calls[0][0].items).toEqual([
      {
        connectionId: '123',
        pk: 'connection|123',
        sk: 'connection|123',
        userId: 'abc',
      },
      { pk: 'user|abc', sk: 'connection|123' },
    ]);
  });

  it('if no connection is found given the connectionId, nothing else happens', async () => {
    getMock.mockReturnValueOnce(null);

    await deleteUserConnection({
      applicationContext,
      connectionId: '123',
    });

    expect(batchDeleteMock).not.toHaveBeenCalled();
  });

  it('if no user connection is found given the connectionId, it only deletes the connection', async () => {
    getMock.mockReturnValueOnce({
      connectionId: '123',
      pk: 'connection|123',
      sk: 'connection|123',
      userId: 'abc',
    });

    getMock.mockReturnValueOnce({});

    await deleteUserConnection({
      applicationContext,
      connectionId: '123',
    });

    expect(batchDeleteMock.mock.calls[0][0].items).toEqual([
      {
        connectionId: '123',
        pk: 'connection|123',
        sk: 'connection|123',
        userId: 'abc',
      },
      {},
    ]);
  });
});
