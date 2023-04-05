import { MOCK_LOCK } from '../../test/mockLock';
import { ServiceUnavailableError } from '../../errors/errors';
import { acquireLock } from './acquireLock';
import { applicationContext } from '../test/createTestApplicationContext';

describe('acquireLock', () => {
  it('gets the current lock from persistence for the given prefix and identifier', async () => {
    await acquireLock({
      applicationContext,
      identifier: '123-45',
      onLockError: new ServiceUnavailableError('The case is currently locked'),
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

  describe('lockName is locked', () => {
    beforeEach(() => {
      applicationContext
        .getPersistenceGateway()
        .getLock.mockReturnValue(MOCK_LOCK);
    });
    it('throws a ServiceUnavailableError error if the persistence gateway returns a lock for the given lockName', async () => {
      await expect(
        acquireLock({
          applicationContext,
          identifier: '123-45',
          onLockError: new ServiceUnavailableError(
            'The case is currently locked',
          ),
          prefix: 'case',
        }),
      ).rejects.toThrow(ServiceUnavailableError);
    });
  });

  describe('lockName is not locked', () => {
    beforeEach(() => {
      applicationContext
        .getPersistenceGateway()
        .getLock.mockReturnValue(undefined);
    });
    it('creates a new lock in persistence with for the given lockName', async () => {
      await acquireLock({
        applicationContext,
        identifier: '123-45',
        onLockError: new ServiceUnavailableError(
          'The case is currently locked',
        ),
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
  });
});
