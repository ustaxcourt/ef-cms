import { mockFactory } from '@shared/test/mockFactory';

jest.mock('@web-api/persistence/postgres/utils/operation/tryGetLocks', () =>
  mockFactory('tryGetLocks', [{ successfullyLocked: true, identifier: 'abc' }]),
);

jest.mock('@web-api/persistence/postgres/utils/transactions', () => {
  const onCommitCallbacks: (() => Promise<void>)[] = [];
  return {
    withTransaction: jest.fn(async (fn: () => Promise<unknown>) => {
      const result = await fn();
      // Run all onCommit callbacks after the transaction
      for (const cb of onCommitCallbacks) {
        await cb();
      }
      onCommitCallbacks.length = 0; // Clear callbacks
      return result;
    }),
    inTransaction: jest.fn(() => false),
    onTransactionCommit: jest.fn((cb: () => Promise<void>) => {
      onCommitCallbacks.push(cb);
    }),
  };
});
