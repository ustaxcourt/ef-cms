import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock('@web-api/persistence/postgres/acquireOneDbConnection');
import { acquireLock } from '@web-api/persistence/postgres/utils/mutex';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { tryReleaseLocks as tryReleaseLocksMock } from '@web-api/persistence/postgres/utils/operation/tryReleaseLocks';
import { acquireOneDbConnection as acquireOneDbConnectionMock } from '@web-api/persistence/postgres/acquireOneDbConnection';
import { ConnectionBuilder } from 'kysely';
import { Database } from '@web-api/persistence/postgres/database-schema';

describe('mutex', () => {
  const tryGetLocks = jest.mocked(tryGetLocksMock);
  const tryReleaseLocks = jest.mocked(tryReleaseLocksMock);
  const fakeConn: ConnectionBuilder<Database> = {
    execute: jest.fn(),
  } as unknown as ConnectionBuilder<Database>;
  jest.mocked(acquireOneDbConnectionMock).mockResolvedValue(fakeConn);
  it('should acquire lock and return function to release lock using the same DB connection', async () => {
    const identifiers = ['101-25', '102-25'];
    const authorizedUser = mockDocketClerkUser;
    const removeLockFn = await acquireLock({
      applicationContext,
      identifiers,
      authorizedUser,
    });
    expect(tryGetLocks).toHaveBeenCalledTimes(1);
    expect(tryGetLocks).toHaveBeenCalledWith({
      connection: fakeConn,
      identifiers,
    });
    await removeLockFn();
    expect(tryReleaseLocks).toHaveBeenCalledTimes(1);
    expect(tryReleaseLocks).toHaveBeenCalledWith({
      connection: fakeConn,
      identifiers,
    });
  });
});
