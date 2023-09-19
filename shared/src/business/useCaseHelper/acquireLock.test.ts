import { ALLOWLIST_FEATURE_FLAGS } from '../../business/entities/EntityConstants';
import { MOCK_LOCK } from '../../test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { acquireLock, checkLock, removeLock, withLocking } from './acquireLock';
import { applicationContext } from '../test/createTestApplicationContext';

const onLockError = new ServiceUnavailableError('The case is currently locked');

describe('acquireLock', () => {
  let mockCall: Parameters<typeof acquireLock>[0];
  let mockFeatureFlagValue = true;
  let mockLock;

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockImplementation(() => ({
        [ALLOWLIST_FEATURE_FLAGS.ENTITY_LOCKING_FEATURE_FLAG.key]:
          mockFeatureFlagValue,
      }));
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockCall = {
      applicationContext,
      identifiers: ['case|123-45'],
      onLockError,
      retries: 0,
    };
    mockFeatureFlagValue = true; // enabled
    mockLock = undefined; // unlocked
  });

  it('does not call persistence if no identifier is passed in', async () => {
    mockCall.identifiers = undefined;
    await acquireLock(mockCall);
    expect(
      applicationContext.getPersistenceGateway().getLock,
    ).not.toHaveBeenCalled();
  });

  it('gets the current lock from persistence for the given identifier', async () => {
    await acquireLock(mockCall);
    expect(
      applicationContext.getPersistenceGateway().getLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: 'case|123-45',
    });
  });

  it('gets the current lock for the given array of identifiers', async () => {
    mockCall.identifiers = ['case|123-45', 'case|678-90'];
    await acquireLock(mockCall);
    expect(
      applicationContext.getPersistenceGateway().getLock,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getPersistenceGateway().getLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: 'case|123-45',
    });
    expect(
      applicationContext.getPersistenceGateway().getLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: 'case|678-90',
    });
  });

  describe('is locked', () => {
    beforeEach(() => {
      mockLock = MOCK_LOCK;
    });

    describe('feature flag enabled', () => {
      it('throws the onLockError provided', async () => {
        await expect(acquireLock(mockCall)).rejects.toThrow(
          ServiceUnavailableError,
        );
        expect(
          applicationContext.getPersistenceGateway().createLock,
        ).not.toHaveBeenCalled();
      });

      it('does not create a lock for any of the cases if one of the cases is locked', async () => {
        mockCall.identifiers = ['123-45', '678-90'];
        applicationContext
          .getPersistenceGateway()
          .getLock.mockReturnValueOnce(undefined)
          .mockReturnValueOnce(MOCK_LOCK);
        await expect(acquireLock(mockCall)).rejects.toThrow(
          ServiceUnavailableError,
        );

        expect(
          applicationContext.getPersistenceGateway().createLock,
        ).not.toHaveBeenCalled();
      });

      it('attempts to acquire the lock only once before throwing an error if retries is not specified', async () => {
        await expect(acquireLock(mockCall)).rejects.toThrow(
          ServiceUnavailableError,
        );
        expect(
          applicationContext.getPersistenceGateway().getLock,
        ).toHaveBeenCalledTimes(1);
      });

      it('attempts to acquire the lock multiple times before throwing an error if retries is specified', async () => {
        mockCall.retries = 5;
        await expect(acquireLock(mockCall)).rejects.toThrow(
          ServiceUnavailableError,
        );
        expect(
          applicationContext.getPersistenceGateway().getLock,
        ).toHaveBeenCalledTimes(1 + mockCall.retries);
      });

      it('waits the specified number of milliseconds before trying to acquire the lock if retries and waitTime are specified', async () => {
        mockCall.retries = 5;
        mockCall.waitTime = 1000;
        await expect(acquireLock(mockCall)).rejects.toThrow(
          ServiceUnavailableError,
        );
        expect(
          applicationContext.getPersistenceGateway().getLock,
        ).toHaveBeenCalledTimes(1 + mockCall.retries);
        expect(applicationContext.getUtilities().sleep).toHaveBeenCalledTimes(
          mockCall.retries,
        );
        expect(applicationContext.getUtilities().sleep).toHaveBeenCalledWith(
          mockCall.waitTime,
        );
      });

      it('calls the onLockError function if one is provided', async () => {
        const mockCallbackFunction = jest.fn();
        mockCall.onLockError = mockCallbackFunction;
        mockCall.options = { foo: 'bar' };
        await expect(acquireLock(mockCall)).rejects.toThrow();
        expect(mockCallbackFunction).toHaveBeenCalled();
        expect(mockCallbackFunction).toHaveBeenCalledWith(
          applicationContext,
          mockCall.options,
        );
      });

      it('throws a ServiceUnavailableError if onLockError function is provided', async () => {
        mockCall.onLockError = jest.fn();
        await expect(acquireLock(mockCall)).rejects.toThrow(
          ServiceUnavailableError,
        );
      });
    });

    describe('feature flag disabled', () => {
      beforeEach(() => {
        mockFeatureFlagValue = false;
      });

      it('does not throw the onLockError error provided', async () => {
        await expect(acquireLock(mockCall)).resolves.not.toThrow();

        expect(
          applicationContext.getPersistenceGateway().createLock,
        ).toHaveBeenCalled();
      });

      it('does not call the onLockError function provided', async () => {
        const mockCallbackFunction = jest.fn();
        mockCall.onLockError = mockCallbackFunction;
        await expect(acquireLock(mockCall)).resolves.not.toThrow();
        expect(mockCallbackFunction).not.toHaveBeenCalled();
        expect(
          applicationContext.getPersistenceGateway().createLock,
        ).toHaveBeenCalled();
      });
    });
  });

  describe('is not locked', () => {
    beforeEach(() => {
      mockLock = undefined;
    });

    it('creates a new lock in persistence', async () => {
      await acquireLock(mockCall);
      expect(
        applicationContext.getPersistenceGateway().createLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifier: mockCall.identifiers![0],
        ttl: 30,
      });
    });
  });
});

describe('withLocking', () => {
  const mockInteractor = jest.fn();
  const getLockInfo = jest
    .fn()
    .mockImplementation((_applicationContext, options) => ({
      identifiers: [`case|${options.docketNumber}`],
      ttl: 60,
    }));
  let func;
  let mockFeatureFlagValue;
  let mockLock;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockImplementation(() => ({
        [ALLOWLIST_FEATURE_FLAGS.ENTITY_LOCKING_FEATURE_FLAG.key]:
          mockFeatureFlagValue,
      }));
  });

  beforeEach(() => {
    func = withLocking(mockInteractor, getLockInfo, onLockError);
  });

  describe('is locked', () => {
    beforeEach(() => {
      mockLock = MOCK_LOCK; // locked
    });

    describe('feature flag is disabled', () => {
      beforeEach(() => {
        mockFeatureFlagValue = false; // disabled
      });

      it('does not throw a ServiceUnavailableError if the feature flag is false and we could not acquire the lock on the specified identifier', async () => {
        await expect(
          func(applicationContext, { docketNumber: '123-45' }),
        ).resolves.not.toThrow();
        expect(mockInteractor).toHaveBeenCalledTimes(1);
        expect(mockInteractor).toHaveBeenCalledWith(applicationContext, {
          docketNumber: '123-45',
        });
      });

      it('creates a lock for the specified entity', async () => {
        await func(applicationContext, { docketNumber: '123-45' });

        expect(
          applicationContext.getPersistenceGateway().createLock,
        ).toHaveBeenCalledWith({
          applicationContext,
          identifier: 'case|123-45',
          ttl: 60,
        });
      });

      it('logs a warning that the entity was locked', async () => {
        await func(applicationContext, { docketNumber: '123-45' });
        expect(applicationContext.logger.warn).toHaveBeenCalledWith(
          'Entity is currently locked',
          { currentLock: MOCK_LOCK },
        );
      });
    });

    describe('feature flag is enabled', () => {
      beforeEach(() => {
        mockFeatureFlagValue = true; // enabled
      });

      it('throws the onLockError error', async () => {
        await expect(
          func(applicationContext, { docketNumber: '123-45' }),
        ).rejects.toThrow(onLockError);
      });

      it('does not call the callbackFunction', async () => {
        await expect(
          func(applicationContext, { docketNumber: '123-45' }),
        ).rejects.toThrow(ServiceUnavailableError);
        expect(mockInteractor).not.toHaveBeenCalled();
      });

      it('calls the onLockError function if one is provided', async () => {
        const onLockErrorFunction = jest.fn();
        func = withLocking(mockInteractor, getLockInfo, onLockErrorFunction);
        await expect(
          func(applicationContext, { docketNumber: '123-45' }),
        ).rejects.toThrow(ServiceUnavailableError);
        expect(onLockErrorFunction).toHaveBeenCalledWith(applicationContext, {
          docketNumber: '123-45',
        });
      });

      it('throws a ServiceUnavailableError if an onLockError function is provided', async () => {
        func = withLocking(mockInteractor, getLockInfo, jest.fn());
        await expect(
          func(applicationContext, { docketNumber: '123-45' }),
        ).rejects.toThrow(ServiceUnavailableError);
      });
    });
  });

  describe('is not locked', () => {
    beforeEach(() => {
      mockLock = undefined; // unlocked
    });

    it('creates the lock for the specified identifier', async () => {
      await func(applicationContext, { docketNumber: '123-45' });
      expect(
        applicationContext.getPersistenceGateway().createLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifier: 'case|123-45',
        ttl: 60,
      });
      expect(
        applicationContext.getPersistenceGateway().createLock,
      ).toHaveBeenCalledTimes(1);
    });

    it('calls the specified callback function', async () => {
      await func(applicationContext, { docketNumber: '123-45' });
      expect(mockInteractor).toHaveBeenCalledTimes(1);
      expect(mockInteractor).toHaveBeenCalledWith(applicationContext, {
        docketNumber: '123-45',
      });
    });

    it('removes the lock for the specified identifier', async () => {
      await func(applicationContext, { docketNumber: '123-45' });
      expect(
        applicationContext.getPersistenceGateway().removeLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifiers: ['case|123-45'],
      });
      expect(
        applicationContext.getPersistenceGateway().removeLock,
      ).toHaveBeenCalledTimes(1);
    });

    it('returns the results of the callback function', async () => {
      mockInteractor.mockReturnValue(
        'Serve the public trust, protect the innocent, uphold the law.',
      );
      const result = await func(applicationContext, { docketNumber: '123-45' });
      expect(result).toBe(
        'Serve the public trust, protect the innocent, uphold the law.',
      );
    });

    it('removes the lock if the callback function throws an error', async () => {
      mockInteractor.mockRejectedValueOnce(new Error('something went wrong'));
      await expect(
        func(applicationContext, { docketNumber: '123-45' }),
      ).rejects.toThrow('something went wrong');
      expect(
        applicationContext.getPersistenceGateway().removeLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifiers: ['case|123-45'],
      });
      expect(
        applicationContext.getPersistenceGateway().removeLock,
      ).toHaveBeenCalledTimes(1);
    });

    it('rethrows the error if if the callback function throws an error', async () => {
      mockInteractor.mockRejectedValueOnce(new Error('something went wrong'));
      await expect(
        func(applicationContext, { docketNumber: '123-45' }),
      ).rejects.toThrow('something went wrong');
    });
  });
});

describe('checkLock', () => {
  let mockLock;
  let mockFeatureFlagValue;
  let mockCall;

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getAllFeatureFlagsInteractor.mockImplementation(() => ({
        [ALLOWLIST_FEATURE_FLAGS.ENTITY_LOCKING_FEATURE_FLAG.key]:
          mockFeatureFlagValue,
      }));

    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined; // unlocked
    mockFeatureFlagValue = true; // enabled
    mockCall = {
      applicationContext,
      identifier: 'case|123-45',
    };
  });

  it('calls persistence to see if a lock exists for the specified identifier', async () => {
    await checkLock(mockCall);
    expect(
      applicationContext.getPersistenceGateway().getLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: 'case|123-45',
    });
  });

  describe('is not locked', () => {
    beforeEach(() => {
      mockLock = undefined;
    });

    it('resolves successfully if a lock is not found in persistence', async () => {
      await expect(checkLock(mockCall)).resolves.not.toThrow(
        ServiceUnavailableError,
      );
    });
  });

  describe('is locked', () => {
    beforeEach(() => {
      mockLock = MOCK_LOCK; // locked
    });

    describe('feature flag enabled', () => {
      beforeEach(() => {
        mockFeatureFlagValue = true; // disabled
      });

      it('throws ServiceUnavailableError if onLockError is not specified', async () => {
        mockCall.onLockError = undefined;
        await expect(checkLock(mockCall)).rejects.toThrow(
          ServiceUnavailableError,
        );
      });

      it('throws the specified error if one is specified', async () => {
        mockCall.onLockError = new Error('oh no something went wrong');
        await expect(checkLock(mockCall)).rejects.toThrow(mockCall.onLockError);
      });

      it('calls the specified onLockError function', async () => {
        const mockCallbackFunction = jest.fn();
        mockCall.onLockError = mockCallbackFunction;
        await expect(checkLock(mockCall)).rejects.toThrow(
          ServiceUnavailableError,
        );
        expect(mockCallbackFunction).toHaveBeenCalled();
      });

      it('calls the specified onLockError function with applicationContext and options passed in', async () => {
        const mockCallbackFunction = jest.fn();
        mockCall.onLockError = mockCallbackFunction;
        mockCall.options = { foo: 'bar' };

        await expect(checkLock(mockCall)).rejects.toThrow(
          ServiceUnavailableError,
        );
        expect(mockCallbackFunction).toHaveBeenCalled();
        expect(mockCallbackFunction).toHaveBeenCalledWith(
          applicationContext,
          mockCall.options,
        );
      });
    });

    describe('feature flag disabled', () => {
      beforeEach(() => {
        mockFeatureFlagValue = false; // disabled
      });
      it('does not throw an error', async () => {
        await expect(checkLock(mockCall)).resolves.not.toThrow();
      });
    });
  });
});

describe('removeLock', () => {
  let mockCall;
  beforeEach(() => {
    mockCall = {
      applicationContext,
      identifiers: ['case|123-45'],
    };
  });

  it('removes the specified lock from persistence', async () => {
    await removeLock(mockCall);
    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: ['case|123-45'],
    });
  });

  it('removes an array of specified locks from persistence', async () => {
    mockCall.identifiers = ['123-11', '123-22', '123-33'];
    await removeLock(mockCall);
    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: ['123-11', '123-22', '123-33'],
    });
  });
});
