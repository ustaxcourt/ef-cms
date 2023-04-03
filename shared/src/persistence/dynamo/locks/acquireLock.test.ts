import { MOCK_LOCK } from '../../../test/mockLock';
import { acquireLock, getLock, removeLock } from './acquireLock';
import { applicationContext } from '../../../business/test/createTestApplicationContext';

describe('acquireLock', () => {
  it('should persist a record with the specified lockName and lockId', async () => {
    await acquireLock({
      applicationContext,
      lockId: 'some-uuid',
      lockName: 'some pk',
      user: applicationContext.getCurrentUser(),
    });

    expect(applicationContext.getDocumentClient().put).toHaveBeenCalledWith({
      Item: {
        pk: 'some pk',
        sk: 'lock|some-uuid',
        timestamp: expect.anything(),
        ttl: expect.anything(),
        user: expect.anything(),
      },
      TableName: expect.anything(),
    });
  });
});

describe('getLock', () => {
  it('returns a lock from persistence if it found one', async () => {
    applicationContext.getDocumentClient().queryFull.mockReturnValue({
      promise: () => Promise.resolve([MOCK_LOCK]),
    });

    const result = await getLock({
      applicationContext,
      lockName: 'some pk',
    });
    expect(result).toMatchObject(MOCK_LOCK);
  });
  it('returns undefined from persistence if it did not find one', async () => {
    applicationContext.getDocumentClient().queryFull.mockReturnValue({
      promise: () => Promise.resolve([]),
    });

    const result = await getLock({
      applicationContext,
      lockName: 'some pk',
    });
    expect(result).toBeUndefined();
  });
});

describe('removeLock', () => {
  it('deletes the specified lock from persistence', async () => {
    await removeLock({
      applicationContext,
      lockId: 'some-uuid',
      lockName: 'some pk',
    });

    expect(applicationContext.getDocumentClient().delete).toHaveBeenCalledWith({
      Key: {
        pk: 'some pk',
        sk: 'lock|some-uuid',
      },
      TableName: expect.anything(),
    });
  });
});
