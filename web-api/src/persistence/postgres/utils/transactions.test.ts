import {
  inTransaction,
  onTransactionCommit,
  withTransaction,
} from '@web-api/persistence/postgres/utils/transactions';

const mockExecute = jest.fn().mockResolvedValue(undefined);
const fakeReader = { executeQuery: mockExecute };

function loadTransactionModule() {
  // I could not get these tests to work without reloading the module
  jest.resetModules();
  jest.doMock('@web-api/database', () => ({
    getDbReader: cb => cb(fakeReader),
  }));
  return require('./transactions') as {
    inTransaction: typeof inTransaction;
    withTransaction: typeof withTransaction;
    onTransactionCommit: typeof onTransactionCommit;
  };
}

describe('database transactions', () => {
  beforeEach(() => {
    mockExecute.mockClear();
  });

  describe('inTransaction', () => {
    it('inTransaction should return true insider of transaction', async () => {
      const { inTransaction, withTransaction } = loadTransactionModule();
      const result = await withTransaction(() => {
        return Promise.resolve(inTransaction());
      });
      expect(result).toBe(true);
    });

    it('inTransaction should return false outside of transaction', () => {
      const { inTransaction } = loadTransactionModule();
      expect(inTransaction()).toBe(false);
    });
  });

  describe('withTransaction', () => {
    it('should run a successful transaction', async () => {
      const { withTransaction } = loadTransactionModule();
      const result = await withTransaction(() => {
        return Promise.resolve('ok');
      });
      expect(result).toBe('ok');

      const sqls = mockExecute.mock.calls.map(c => c[0].sql);
      expect(sqls).toEqual(['BEGIN', 'COMMIT']);
    });

    it('should roll back on error in root transaction', async () => {
      const { withTransaction } = loadTransactionModule();
      await expect(
        withTransaction(() => {
          throw new Error('fail');
        }),
      ).rejects.toThrow('fail');

      const sqls = mockExecute.mock.calls.map(c => c[0].sql);
      expect(sqls).toEqual(['BEGIN', 'ROLLBACK']);
    });

    it('should use savepoints for nested transactions', async () => {
      const { withTransaction } = loadTransactionModule();
      await withTransaction(() =>
        withTransaction(() => {
          return Promise.resolve('nested');
        }),
      );

      const sqls = mockExecute.mock.calls.map(c => c[0].sql);
      console.log(sqls);
      expect(sqls[1]).toMatch(/^SAVEPOINT/);
      expect(sqls[2]).toMatch(/^RELEASE SAVEPOINT/);
      expect(sqls).toEqual(expect.arrayContaining(['BEGIN', 'COMMIT']));
    });

    it('should roll back to savepoint on inner failure and roll back outer transaction', async () => {
      const { withTransaction } = loadTransactionModule();
      await expect(
        withTransaction(async () => {
          await withTransaction(() => {
            throw new Error('inner fail');
          });
        }),
      ).rejects.toThrow('inner fail');

      const sqls = mockExecute.mock.calls.map(c => c[0].sql);
      expect(sqls[1]).toMatch(/^SAVEPOINT/);
      expect(sqls[2]).toMatch(/^ROLLBACK TO SAVEPOINT/);
      expect(sqls[3]).toBe('ROLLBACK');
    });

    it('calls onCommit callbacks after commit', async () => {
      const { withTransaction, onTransactionCommit } = loadTransactionModule();
      const cb = jest.fn().mockResolvedValue([]);
      await withTransaction(() => {
        onTransactionCommit(cb);
        return Promise.resolve('done');
      });
      expect(cb).toHaveBeenCalled();
    });
  });

  it('onTransactionCommit throws an error outside of transaction', () => {
    const { onTransactionCommit } = loadTransactionModule();
    expect(() => onTransactionCommit(() => Promise.resolve())).toThrow();
  });
});
