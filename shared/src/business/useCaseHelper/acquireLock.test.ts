import { MOCK_CASE } from '../../test/mockCase';
import { MOCK_USERS } from '../../test/mockUsers';
import { ServiceUnavailableError } from '../../errors/errors';
import { acquireLock } from './acquireLock';
import { applicationContext } from '../test/createTestApplicationContext';

const mockLock = {
  pk: `case|${MOCK_CASE.docketNumber}`,
  sk: 'lock|21af52db-508a-4962-a702-fa1aba9f8a37',
  ttl: 1680530219,
  user: 'Someone else',
};

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
        .getLock.mockReturnValue(mockLock);
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
  });
});
