import {
  CompiledQuery,
  DummyDriver,
  Kysely,
  PostgresAdapter,
  PostgresIntrospector,
  PostgresQueryCompiler,
  QueryResult,
} from 'kysely';
import { Database } from '@web-api/persistence/postgres/database-schema';
import {
  PRESERVED_TABLES,
  getTruncatableTables,
  truncateAllPostgresTables,
} from './truncate-postgres.helpers';
import { getDbWriter } from '@web-api/persistence/postgres/database';

jest.mock('@web-api/persistence/postgres/database', () => ({
  getDbWriter: jest.fn(),
}));

const getDbWriterMock = jest.mocked(getDbWriter);

type TableNameRow = { table_name?: string; tableName?: string };

/**
 * Builds a Kysely instance whose query execution is replaced by a spy. Uses
 * the real Postgres query compiler so the assertions exercise the SQL that
 * would actually be sent to Postgres.
 */
const buildKyselyWithExecutionSpy = (
  rows: TableNameRow[],
): {
  db: Kysely<Database>;
  executedSql: string[];
} => {
  const executedSql: string[] = [];
  const db = new Kysely<Database>({
    dialect: {
      createAdapter: () => new PostgresAdapter(),
      createDriver: () => new DummyDriver(),
      createIntrospector: kysely => new PostgresIntrospector(kysely),
      createQueryCompiler: () => new PostgresQueryCompiler(),
    },
  });

  const executor = db.getExecutor();
  jest
    .spyOn(executor, 'executeQuery')
    .mockImplementation(<R>(query: CompiledQuery): Promise<QueryResult<R>> => {
      executedSql.push(query.sql);
      const matchingRows: TableNameRow[] = query.sql.includes(
        'information_schema.tables',
      )
        ? rows
        : [];
      return Promise.resolve({
        rows: matchingRows as unknown as R[],
      });
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

    it('returns all tables when the CamelCasePlugin maps table_name to tableName', async () => {
      const { db } = buildKyselyWithExecutionSpy([
        { tableName: 'dw_case' },
        { tableName: 'dw_feature_flag' },
      ]);

      const tables = await getTruncatableTables({ db });

      expect(tables).toEqual(['dw_case']);
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
