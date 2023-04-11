import { MOCK_LOCK } from '../../test/mockLock';
import { ServiceUnavailableError } from '../../errors/errors';
import { acquireLock } from './acquireLock';
import { applicationContext } from '../test/createTestApplicationContext';

describe('acquireLock', () => {
  const onLockError = new ServiceUnavailableError(
    'The case is currently locked',
  );
  it('gets the current lock from persistence for the given prefix and identifier', async () => {
    await acquireLock({
      applicationContext,
      identifier: '123-45',
      onLockError,
      prefix: 'case',
    });
    expect(
      applicationContext.getPersistenceGateway().getLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: '123-45',
      prefix: 'case',
    });
  });

  it('gets the current lock for the given prefix and an array of identifiers', async () => {
    await acquireLock({
      applicationContext,
      identifier: ['123-45', '678-90'],
      onLockError,
      prefix: 'case',
    });

    expect(
      applicationContext.getPersistenceGateway().getLock,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getPersistenceGateway().getLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: '123-45',
      prefix: 'case',
    });
    expect(
      applicationContext.getPersistenceGateway().getLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: '678-90',
      prefix: 'case',
    });
  });

  describe('is locked', () => {
    beforeEach(() => {
      applicationContext
        .getPersistenceGateway()
        .getLock.mockReturnValue(MOCK_LOCK);
    });
    it('throws a ServiceUnavailableError error if the persistence gateway returns a lock for the given prefix and identifier', async () => {
      await expect(
        acquireLock({
          applicationContext,
          identifier: '123-45',
          onLockError,
          prefix: 'case',
        }),
      ).rejects.toThrow(ServiceUnavailableError);
      expect(
        applicationContext.getPersistenceGateway().createLock,
      ).not.toHaveBeenCalled();
    });
    it('does not create a lock for any of the cases if one of the cases is locked', async () => {
      applicationContext
        .getPersistenceGateway()
        .getLock.mockReturnValueOnce(undefined)
        .mockReturnValueOnce(MOCK_LOCK);
      await expect(
        acquireLock({
          applicationContext,
          identifier: ['123-45', '678-90'],
          onLockError,
          prefix: 'case',
        }),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(
        applicationContext.getPersistenceGateway().createLock,
      ).not.toHaveBeenCalled();
    });
  });

  describe('is not locked', () => {
    beforeEach(() => {
      applicationContext
        .getPersistenceGateway()
        .getLock.mockReturnValue(undefined);
    });
    it('creates a new lock in persistence', async () => {
      await acquireLock({
        applicationContext,
        identifier: '123-45',
        onLockError,
        prefix: 'case',
      });
      expect(
        applicationContext.getPersistenceGateway().createLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifier: '123-45',
        prefix: 'case',
        ttl: 30,
      });
    });
  });
});
