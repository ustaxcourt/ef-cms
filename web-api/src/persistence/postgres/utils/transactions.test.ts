import * as dbModule from '@web-api/persistence/postgres/databaseConnection';
import * as settleModule from '@web-api/utilities/settlePromises';
import {
  ConnectionStore,
  ConnectionInfo,
} from '@web-api/persistence/postgres/databaseConnection';
import {
  inTransaction,
  onTransactionCommit,
  withTransaction,
} from '@web-api/persistence/postgres/utils/transactions';

jest.mock('@web-api/utilities/settlePromises');
jest.mock('@web-api/persistence/postgres/databaseConnection');

describe('inTransaction', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return false when no store is present', () => {
    jest.spyOn(ConnectionStore, 'getStore').mockReturnValue(undefined);
    expect(inTransaction()).toBe(false);
  });

  it('should return false when store has no currentTransaction', () => {
    jest
      .spyOn(ConnectionStore, 'getStore')
      .mockReturnValue({} as ConnectionInfo);
    expect(inTransaction()).toBe(false);
  });

  it('should return true when store.currentTransaction is truthy', () => {
    jest
      .spyOn(ConnectionStore, 'getStore')
      .mockReturnValue({ currentTransaction: {} } as ConnectionInfo);
    expect(inTransaction()).toBe(true);
  });
});

describe('onTransactionCommit', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error when called outside of a transaction', () => {
    jest.spyOn(ConnectionStore, 'getStore').mockReturnValue(undefined);
    expect(() => onTransactionCommit(async () => {})).toThrow();
  });

  it('should add the callback into the store when in a transaction', () => {
    const store: ConnectionInfo & {
      onCommitCallbacks: Array<() => Promise<void>>;
    } = {
      currentTransaction: {},
      onCommitCallbacks: [],
    } as any;
    jest.spyOn(ConnectionStore, 'getStore').mockReturnValue(store);

    const cb = jest.fn().mockResolvedValue(undefined);
    onTransactionCommit(cb);

    expect(store.onCommitCallbacks).toContain(cb);
  });
});

describe('withTransaction', () => {
  const fakeDb = {
    transaction: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.resetAllMocks();
    // Default: no active transaction
    jest.spyOn(ConnectionStore, 'getStore').mockReturnValue(undefined);
  });

  it('should execute callback and not try to start a new transaction when in a nested transaction', async () => {
    jest.spyOn(ConnectionStore, 'getStore').mockReturnValue({
      currentTransaction: {},
    } as ConnectionInfo);

    const userFn = jest.fn().mockResolvedValue('OK');
    const result = await withTransaction(userFn);

    expect(userFn).toHaveBeenCalledTimes(1);
    expect(result).toBe('OK');

    expect(dbModule.getDb).not.toHaveBeenCalled();
  });

  it('should start a new transaction, execute the callback, commit, and run onCommit callbacks when not in a nested transaction', async () => {
    const settleSpy = jest
      .spyOn(settleModule, 'settlePromises')
      .mockResolvedValue([]);

    const mockTrx = {};
    fakeDb.transaction.mockReturnValue({
      execute: async (cb: (trx: any) => Promise<any>) => {
        return cb(mockTrx);
      },
    });
    jest.spyOn(dbModule, 'getDb').mockResolvedValue(fakeDb);

    jest
      .spyOn(ConnectionStore, 'run')
      .mockImplementation(
        <T>(
          store: ConnectionInfo,
          callback: (...args: any[]) => T,
          ...args: any[]
        ): T => {
          jest.spyOn(ConnectionStore, 'getStore').mockReturnValue(store);
          return callback(...args);
        },
      );

    // Prepare user function that registers two onCommit callbacks
    const cb1 = jest.fn().mockResolvedValue(undefined);
    const cb2 = jest.fn().mockResolvedValue(undefined);
    const userFn = jest.fn().mockImplementation(() => {
      onTransactionCommit(cb1);
      onTransactionCommit(cb2);
      return 'RESULT';
    });

    const result = await withTransaction(userFn);

    // Verify that we asked the DB for a transaction and ran the callback successfully
    expect(dbModule.getDb).toHaveBeenCalledTimes(1);
    expect(fakeDb.transaction).toHaveBeenCalledTimes(1);
    expect(userFn).toHaveBeenCalledTimes(1);
    expect(result).toBe('RESULT');

    // Ensure callbacks were registered and then settled
    expect(settleSpy).toHaveBeenCalledTimes(1);
    const settledArgs = settleSpy.mock.calls[0][0];
    expect(Array.isArray(settledArgs)).toBe(true);
    expect(settledArgs).toHaveLength(2);
  });

  it('should not call settlePromises if there are no onCommit callbacks', async () => {
    const settleSpy = jest
      .spyOn(settleModule, 'settlePromises')
      .mockResolvedValue([]);

    fakeDb.transaction.mockReturnValue({
      execute: async (cb: (trx: any) => Promise<any>) => cb({}),
    });
    jest.spyOn(dbModule, 'getDb').mockResolvedValue(fakeDb);
    jest
      .spyOn(ConnectionStore, 'run')
      .mockImplementation(
        <T>(
          store: ConnectionInfo,
          callback: (...args: any[]) => T,
          ...args: any[]
        ): T => {
          jest.spyOn(ConnectionStore, 'getStore').mockReturnValue(store);
          return callback(...args);
        },
      );

    const userFn = jest.fn().mockResolvedValue('NO CALLBACKS');
    const result = await withTransaction(userFn);

    expect(result).toBe('NO CALLBACKS');
    expect(settleSpy).not.toHaveBeenCalled();
  });
});
