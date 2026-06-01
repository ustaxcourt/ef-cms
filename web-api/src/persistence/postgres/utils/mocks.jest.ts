import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@web-api/persistence/postgres/utils/operation/tryGetLocks', () =>
  mockFactory('tryGetLocks', [{ successfullyLocked: true, identifier: 'abc' }]),
);

jest.mock('@web-api/persistence/postgres/utils/transactions', () => {
  const onCommitCallbacks: (() => Promise<void>)[] = [];
  return {
    withTransaction: jest.fn(async (fn: () => Promise<unknown>) => {
      try {
        const result = await fn();
        // Run all onCommit callbacks after the transaction succeeds
        for (const cb of onCommitCallbacks) {
          await cb();
        }
        onCommitCallbacks.length = 0; // Clear callbacks
        return result;
      } catch (error) {
        // Transaction failed - clear callbacks without running them
        onCommitCallbacks.length = 0;
        throw error;
      }
    }),
    inTransaction: jest.fn(() => false),
    onTransactionCommit: jest.fn((cb: () => Promise<void>) => {
      onCommitCallbacks.push(cb);
    }),
  };
});
