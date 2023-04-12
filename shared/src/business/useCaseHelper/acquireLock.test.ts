import { MOCK_LOCK } from '../../test/mockLock';
import { ServiceUnavailableError } from '../../errors/errors';
import { acquireLock, checkLock, removeLock, withLocking } from './acquireLock';
import { applicationContext } from '../test/createTestApplicationContext';

const onLockError = new ServiceUnavailableError('The case is currently locked');

describe('acquireLock', () => {
  let mockCall;
  let mockFeatureFlagValue;

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockImplementation(
        () => mockFeatureFlagValue,
      );
  });

  beforeEach(() => {
    mockCall = {
      applicationContext,
      identifier: '123-45',
      onLockError,
      prefix: 'case',
    };
    mockFeatureFlagValue = true; // enabled
  });

  it('gets the current lock from persistence for the given prefix and identifier', async () => {
    await acquireLock(mockCall);
    expect(
      applicationContext.getPersistenceGateway().getLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: '123-45',
      prefix: 'case',
    });
  });

  it('gets the current lock for the given prefix and an array of identifiers', async () => {
    mockCall.identifier = ['123-45', '678-90'];
    await acquireLock(mockCall);

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
      await expect(acquireLock(mockCall)).rejects.toThrow(
        ServiceUnavailableError,
      );
      expect(
        applicationContext.getPersistenceGateway().createLock,
      ).not.toHaveBeenCalled();
    });

    it('does not throw a ServiceUnavailableError error if the feature flag is disabled', async () => {
      mockFeatureFlagValue = false;
      await expect(acquireLock(mockCall)).resolves.not.toThrow();

      expect(
        applicationContext.getPersistenceGateway().createLock,
      ).toHaveBeenCalled();
    });

    it('does not create a lock for any of the cases if one of the cases is locked', async () => {
      mockCall.identifier = ['123-45', '678-90'];
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

describe('withLocking', () => {
  const callbackFunction = jest.fn().mockReturnValue('salad');
  const getLockInfo = jest.fn().mockImplementation(options => ({
    identifier: options.docketNumber,
    prefix: 'case',
    ttl: 60,
  }));
  const func = withLocking(callbackFunction, getLockInfo, onLockError);
  let mockFeatureFlagValue;
  let mockLock;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockImplementation(
        () => mockFeatureFlagValue,
      );
  });

  beforeEach(() => {
    mockLock = undefined; // unlocked
    mockFeatureFlagValue = true; // enabled
  });

  it('creates the lock for the specified prefix and identifier', async () => {
    await func(applicationContext, { docketNumber: '123-45' });
    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: '123-45',
      prefix: 'case',
      ttl: 60,
    });
    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledTimes(1);
  });

  it('throws a ServiceUnavailableError if the specified prefix and identifier are locked', async () => {
    mockLock = MOCK_LOCK; // locked
    await expect(
      func(applicationContext, { docketNumber: '123-45' }),
    ).rejects.toThrow(ServiceUnavailableError);
  });

  it('calls the specified callback function', async () => {
    await func(applicationContext, { docketNumber: '123-45' });
    expect(callbackFunction).toHaveBeenCalledTimes(1);
    expect(callbackFunction).toHaveBeenCalledWith(applicationContext, {
      docketNumber: '123-45',
    });
  });

  it('does not throw a ServiceUnavailableError if the feature flag is false and we could not acquire the lock on the specified prefix and identifier', async () => {
    mockLock = MOCK_LOCK; // locked
    mockFeatureFlagValue = false; // disabled

    await expect(
      func(applicationContext, { docketNumber: '123-45' }),
    ).resolves.not.toThrow();
    expect(callbackFunction).toHaveBeenCalledTimes(1);
    expect(callbackFunction).toHaveBeenCalledWith(applicationContext, {
      docketNumber: '123-45',
    });
  });

  it('removes the lock for the specified prefix and identifier', async () => {
    await func(applicationContext, { docketNumber: '123-45' });
    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: '123-45',
      prefix: 'case',
    });
    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledTimes(1);
  });
  it('returns the results of the callback function', async () => {
    callbackFunction.mockReturnValue(
      'Serve the public trust, protect the innocent, uphold the law.',
    );
    const result = await func(applicationContext, { docketNumber: '123-45' });
    expect(result).toBe(
      'Serve the public trust, protect the innocent, uphold the law.',
    );
  });
  it('removes the lock if the callback function throws an error', async () => {
    callbackFunction.mockRejectedValueOnce(new Error('something went wrong'));
    await expect(
      func(applicationContext, { docketNumber: '123-45' }),
    ).rejects.toThrow('something went wrong');
    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: '123-45',
      prefix: 'case',
    });
    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledTimes(1);
  });
  it('rethrows the error if if the callback function throws an error', async () => {
    callbackFunction.mockRejectedValueOnce(new Error('something went wrong'));
    await expect(
      func(applicationContext, { docketNumber: '123-45' }),
    ).rejects.toThrow('something went wrong');
  });
});

describe('checkLock', () => {
  let mockLock;
  let mockFeatureFlagValue;

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockImplementation(
        () => mockFeatureFlagValue,
      );

    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined; // unlocked
    mockFeatureFlagValue = true; // enabled
  });

  it('calls persistence to see if a lock exists for the specified identifier and prefix', async () => {
    await checkLock({
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

  it('throws the specified onLockError if a lock is found in persistence', async () => {
    mockLock = MOCK_LOCK;
    await expect(
      checkLock({
        applicationContext,
        identifier: '123-45',
        onLockError,
        prefix: 'case',
      }),
    ).rejects.toThrow(ServiceUnavailableError);
  });

  it('does not throw the specified onLockError if the feature flag is disabled and a lock is found in persistence', async () => {
    mockFeatureFlagValue = false; // disabled
    mockLock = MOCK_LOCK; // locked
    await expect(
      checkLock({
        applicationContext,
        identifier: '123-45',
        onLockError,
        prefix: 'case',
      }),
    ).resolves.not.toThrow();
  });

  it('resolves successfully if a lock is not found in persistence', async () => {
    await expect(
      checkLock({
        applicationContext,
        identifier: '123-45',
        onLockError,
        prefix: 'case',
      }),
    ).resolves.not.toThrow(ServiceUnavailableError);
  });
});

describe('removeLock', () => {
  it('removes the specified lock from persistence', async () => {
    await removeLock({
      applicationContext,
      identifier: '123-45',
      prefix: 'case',
    });
    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledTimes(1);
    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: '123-45',
      prefix: 'case',
    });
  });
  it('removes an array of specified locks from persistence', async () => {
    await removeLock({
      applicationContext,
      identifier: ['123-11', '123-22', '123-33'],
      prefix: 'case',
    });
    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledTimes(3);
    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: '123-11',
      prefix: 'case',
    });
    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: '123-22',
      prefix: 'case',
    });
    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: '123-33',
      prefix: 'case',
    });
  });
});
