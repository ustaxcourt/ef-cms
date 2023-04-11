import { MOCK_ACTIVE_LOCK, MOCK_EXPIRED_LOCK } from '../../../test/mockLock';
import { applicationContext } from '../../../business/test/createTestApplicationContext';
import { createLock, getLock, removeLock } from './acquireLock';

describe('createLock', () => {
  it('should persist a record with the specified prefix and identifier', async () => {
    await createLock({
      applicationContext,
      identifier: '123-45',
      prefix: 'case',
    });

    expect(applicationContext.getDocumentClient().put).toHaveBeenCalledWith({
      Item: {
        pk: 'case|123-45',
        sk: 'lock',
        timestamp: expect.anything(),
        ttl: expect.anything(),
      },
      TableName: expect.anything(),
    });
  });
});

describe('getLock', () => {
  it('returns a lock from persistence if it found one that expires in the future', async () => {
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Item: MOCK_ACTIVE_LOCK,
        }),
    });

    const result = await getLock({
      applicationContext,
      identifier: '123-45',
      prefix: 'case',
    });
    expect(result).toMatchObject(MOCK_ACTIVE_LOCK);
  });
  it('returns undefined from persistence if it did not find a lock', async () => {
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: () => Promise.resolve(),
    });

    const result = await getLock({
      applicationContext,
      identifier: '123-45',
      prefix: 'case',
    });
    expect(result).toBeUndefined();
  });

  it('returns undefined from persistence if the lock it found in persistence has expired', async () => {
    applicationContext.getDocumentClient().get.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Item: MOCK_EXPIRED_LOCK,
        }),
    });

    const result = await getLock({
      applicationContext,
      identifier: '123-45',
      prefix: 'case',
    });
    expect(result).toBeUndefined();
  });
});

describe('removeLock', () => {
  it('deletes the specified lock from persistence', async () => {
    await removeLock({
      applicationContext,
      identifier: '123-45',
      prefix: 'case',
    });

    expect(applicationContext.getDocumentClient().delete).toHaveBeenCalledWith({
      Key: {
        pk: 'case|123-45',
        sk: 'lock',
      },
      TableName: expect.anything(),
    });
  });
});
