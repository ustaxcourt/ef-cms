jest.mock('@web-api/persistence/postgres/database');
jest.mock('@web-api/persistence/postgres/utils/operation/pgDeleteFrom');
import { handler as rdsExpiredRecordsCleanupLambda } from '@web-api/lambdas/rdsExpiredRecordsCleanup/rdsExpiredRecordsCleanupLambda';
import { getDbReader as getDbReaderMock } from '@web-api/persistence/postgres/database';
import { pgDeleteFrom as pgDeleteFromMock } from '@web-api/persistence/postgres/utils/operation/pgDeleteFrom';
import { Kysely } from 'kysely';
import { Database } from '@web-api/persistence/postgres/database-schema';
import type { Context } from 'aws-lambda';

const getDbReader = jest.mocked(getDbReaderMock);
const pgDeleteFrom = jest.mocked(pgDeleteFromMock);

describe('rdsExpiredRecordsCleanupLambda', () => {
  let succeedMock: jest.Mock;

  beforeEach(() => {
    jest.resetAllMocks();
    pgDeleteFrom.mockResolvedValue([]);
    succeedMock = jest.fn();
    getDbReader.mockImplementation(async cb => {
      const MOCKED_READER = {
        introspection: {
          getTables: () => [
            {
              name: 'TEST_TABLE_1',
              columns: [
                { name: 'COL_0' },
                { name: 'COL_1' },
                { name: 'COL_2' },
                { name: 'COL_3' },
                { name: 'COL_4' },
                { name: 'COL_5' },
                { name: 'ttl' },
              ],
            },
            {
              name: 'TEST_TABLE_2',
              columns: [
                { name: 'COL_0' },
                { name: 'COL_1' },
                { name: 'COL_2' },
                { name: 'COL_3' },
                { name: 'COL_4' },
                { name: 'COL_5' },
                { name: 'COL_6' },
                { name: 'COL_7' },
              ],
            },
            {
              name: 'TEST_TABLE_3',
              columns: [
                { name: 'COL_0' },
                { name: 'COL_1' },
                { name: 'COL_2' },
                { name: 'COL_3' },
                { name: 'COL_4' },
                { name: 'COL_5' },
                { name: 'ttl' },
              ],
            },
          ],
        },
      } as unknown as Kysely<Database>;

      await cb(MOCKED_READER);
    });
  });

  it('should call delete from for the tables that have a ttl column', async () => {
    await rdsExpiredRecordsCleanupLambda(
      undefined,
      { succeed: succeedMock } as unknown as Context,
      undefined as any,
    );

    const succeedCalls = succeedMock.mock.calls;
    expect(succeedCalls.length).toEqual(1);
    expect(succeedCalls[0][0]).toEqual('Completed Cleanup!');

    const pgDeleteFromCalls = pgDeleteFrom.mock.calls;
    expect(pgDeleteFromCalls.length).toEqual(2);
    expect(pgDeleteFromCalls[0][0].table).toEqual('TEST_TABLE_1');
    expect(pgDeleteFromCalls[1][0].table).toEqual('TEST_TABLE_3');

    const callbackMock: any = {
      where: jest.fn(),
    };
    const whereCallback = pgDeleteFromCalls[0][0].where;
    whereCallback(callbackMock);

    const whereCalls = callbackMock.where.mock.calls;
    expect(whereCalls.length).toEqual(1);
    expect(whereCalls[0][0]).toEqual('ttl');
    expect(whereCalls[0][1]).toEqual('<');
  });
});
