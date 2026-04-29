import {
  DummyDriver,
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
} from 'kysely';
import {
  PRESERVED_TABLES,
  getTruncatableTables,
  truncateAllPostgresTables,
} from './truncate-postgres.helpers';
import { getDbWriter } from '@web-api/database';

jest.mock('@web-api/database', () => ({
  getDbWriter: jest.fn(),
}));

const getDbWriterMock = jest.mocked(getDbWriter);

/**
 * Builds a Kysely instance whose query execution is replaced by a spy. Uses
 * the real Postgres query compiler so the assertions exercise the SQL that
 * would actually be sent to Postgres.
 */
const buildKyselyWithExecutionSpy = (
  rows: { table_name: string }[],
): {
  db: Kysely<any>;
  executedSql: string[];
} => {
  const executedSql: string[] = [];
  const db = new Kysely<any>({
    dialect: {
      createAdapter: () => new PostgresAdapter(),
      createDriver: () => new DummyDriver(),
      createIntrospector: kysely => new PostgresIntrospector(kysely),
      createQueryCompiler: () => new PostgresQueryCompiler(),
    },
  });

  const executor = db.getExecutor();
  jest.spyOn(executor, 'executeQuery').mockImplementation((query: any) => {
    executedSql.push(query.sql);
    if (query.sql && query.sql.includes('information_schema.tables')) {
      return { rows } as any;
    }
    return { rows: [] } as any;
  });

  return { db, executedSql };
};

describe('truncate-postgres.helpers', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('PRESERVED_TABLES', () => {
    it('preserves dw_feature_flag, kysely_migration and kysely_migration_lock', () => {
      expect(PRESERVED_TABLES).toEqual([
        'dw_feature_flag',
        'kysely_migration',
        'kysely_migration_lock',
      ]);
    });
  });

  describe('getTruncatableTables', () => {
    it('returns all tables except the preserved ones', async () => {
      const { db } = buildKyselyWithExecutionSpy([
        { table_name: 'dw_case' },
        { table_name: 'dw_docket_entry' },
        { table_name: 'dw_feature_flag' },
        { table_name: 'kysely_migration' },
        { table_name: 'kysely_migration_lock' },
        { table_name: 'dw_user' },
      ]);

      const tables = await getTruncatableTables({ db });

      expect(tables).toEqual(['dw_case', 'dw_docket_entry', 'dw_user']);
    });
  });

  describe('truncateAllPostgresTables', () => {
    it('runs a TRUNCATE statement against every non-preserved table', async () => {
      const { db, executedSql } = buildKyselyWithExecutionSpy([
        { table_name: 'dw_case' },
        { table_name: 'dw_feature_flag' },
        { table_name: 'dw_user' },
      ]);

      getDbWriterMock.mockImplementation(async ({ cb }) => cb(db));

      const result = await truncateAllPostgresTables();

      expect(result).toEqual(['dw_case', 'dw_user']);
      const truncateCall = executedSql.find(s => s.includes('TRUNCATE TABLE'));
      expect(truncateCall).toBeDefined();
      expect(truncateCall).toContain('"dw_case"');
      expect(truncateCall).toContain('"dw_user"');
      expect(truncateCall).not.toContain('"dw_feature_flag"');
      expect(truncateCall).toContain('CASCADE');
    });

    it('skips the TRUNCATE statement when no truncatable tables exist', async () => {
      const { db, executedSql } = buildKyselyWithExecutionSpy([
        { table_name: 'dw_feature_flag' },
      ]);

      getDbWriterMock.mockImplementation(async ({ cb }) => cb(db));

      const result = await truncateAllPostgresTables();

      expect(result).toEqual([]);
      const truncateCall = executedSql.find(s => s.includes('TRUNCATE TABLE'));
      expect(truncateCall).toBeUndefined();
      expect(console.log).toHaveBeenCalledWith(
        'No DAWSON tables found to truncate.',
      );
    });

    it('passes null table/action so getDbWriter does not enqueue an opensearch sync', async () => {
      const { db } = buildKyselyWithExecutionSpy([{ table_name: 'dw_case' }]);
      getDbWriterMock.mockImplementation(async ({ cb }) => cb(db));

      await truncateAllPostgresTables();

      expect(getDbWriterMock).toHaveBeenCalledWith(
        expect.objectContaining({ table: null, action: null }),
      );
    });
  });
});
