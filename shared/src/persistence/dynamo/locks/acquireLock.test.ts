import { FORMATS, formatNow } from '../../../business/utilities/DateHandler';
import { MOCK_LOCK } from '../../../test/mockLock';
import { applicationContext } from '../../../business/test/createTestApplicationContext';
import { createLock, getLock, removeLock } from './acquireLock';

const mockCurrentLock = {
  ...MOCK_LOCK,
  ttl: Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS)) + 10,
};

const mockExpiredLock = {
  ...MOCK_LOCK,
  ttl: Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS)) - 10,
};

describe('createLock', () => {
  it('should persist a record with the specified lockName and lockId', async () => {
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
          Item: mockCurrentLock,
        }),
    });

    const result = await getLock({
      applicationContext,
      identifier: '123-45',
      prefix: 'case',
    });
    expect(result).toMatchObject(mockCurrentLock);
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
          Item: mockExpiredLock,
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
