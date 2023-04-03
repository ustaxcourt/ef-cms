import { MOCK_LOCK } from '../../test/mockLock';
import { MOCK_USERS } from '../../test/mockUsers';
import { ServiceUnavailableError } from '../../errors/errors';
import { acquireLock } from './acquireLock';
import { applicationContext } from '../test/createTestApplicationContext';

describe('acquireLock', () => {
  it('gets the current lock from persistence for the given lockName', async () => {
    await acquireLock({
      applicationContext,
      lockName: 'foo',
    });
    expect(
      applicationContext.getPersistenceGateway().getLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      lockName: 'foo',
    });
  });

  describe('lockName is locked', () => {
    beforeEach(() => {
      applicationContext
        .getPersistenceGateway()
        .getLock.mockReturnValue(MOCK_LOCK);
    });
    it('throws an error if the persistence gateway returns a lock for the given lockName', async () => {
      await expect(
        acquireLock({
          applicationContext,
          lockName: 'foo',
        }),
      ).rejects.toThrow(ServiceUnavailableError);
    });
  });

  describe('lockName is not locked', () => {
    beforeEach(() => {
      applicationContext
        .getPersistenceGateway()
        .getLock.mockReturnValue(undefined);
      applicationContext.getCurrentUser.mockReturnValue(
        MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
      );
    });
    it('creates a new lock in persistence with for the given lockName', async () => {
      await acquireLock({
        applicationContext,
        lockName: 'foo',
      });
      expect(
        applicationContext.getPersistenceGateway().acquireLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        lockId: expect.anything(),
        lockName: 'foo',
        user: expect.anything(),
      });
    });
    it('includes user information in the lock it creates in in persistence', async () => {
      await acquireLock({
        applicationContext,
        lockName: 'foo',
      });
      expect(
        applicationContext.getPersistenceGateway().acquireLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        lockId: expect.anything(),
        lockName: 'foo',
        user: {
          ...MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
        },
      });
    });
    it('returns the unique identifier of the lock so that it can be removed later', async () => {
      applicationContext.getUniqueId.mockReturnValue('some-uuid');

      const result = await acquireLock({
        applicationContext,
        lockName: 'foo',
      });

      expect(result).toBe('some-uuid');
    });
  });
});
