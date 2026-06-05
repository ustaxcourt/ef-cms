jest.mock('@web-api/persistence/postgres/database', () => ({
  getDbReader: jest.fn(),
}));
jest.mock('../helpers/parseArgsAndEnvVars', () => ({
  getJsTimeframeForYear: jest.fn(),
}));

import {
  EventCodeReportDocketEntry,
  getDocketEntriesByEventCodesAndYears,
} from './event-codes-by-year-helpers';
import { calculateDate } from '@shared/business/utilities/DateHandler';
import { getDbReader as getDbReaderMock } from '@web-api/persistence/postgres/database';
import { getJsTimeframeForYear as getJsTimeframeForYearMock } from '../helpers/parseArgsAndEnvVars';

type QueryCall = {
  args: unknown[];
  method: string;
};

type QueryConditionBuilder = ((...args: unknown[]) => unknown[]) & {
  and: (conditions: unknown[]) => unknown[];
  or: (conditions: unknown[]) => unknown[];
};

type QueryBuilder = {
  distinctOn: (...args: unknown[]) => QueryBuilder;
  execute: () => Promise<unknown>;
  executeTakeFirst: () => Promise<unknown>;
  innerJoin: (...args: unknown[]) => QueryBuilder;
  orderBy: (...args: unknown[]) => QueryBuilder;
  select: (...args: unknown[]) => QueryBuilder;
  selectAll: () => QueryBuilder;
  where: (...args: unknown[]) => QueryBuilder;
};

type MockReader = {
  fn: {
    countAll: () => {
      as: (alias: string) => { alias: string; type: 'countAll' };
    };
  };
  selectFrom: (table: string) => QueryBuilder;
  with: (
    name: string,
    callback: () => QueryBuilder,
  ) => {
    selectFrom: (table: string) => QueryBuilder;
  };
};

const getDbReader = jest.mocked(getDbReaderMock);
const getJsTimeframeForYear = jest.mocked(getJsTimeframeForYearMock);

const createQueryBuilder = ({
  calls,
  executeResult,
  executeTakeFirstResult,
}: {
  calls: QueryCall[];
  executeResult: unknown;
  executeTakeFirstResult: unknown;
}): QueryBuilder => {
  const qb: QueryConditionBuilder = Object.assign(
    (...args: unknown[]): unknown[] => args,
    {
      and: (conditions: unknown[]): unknown[] => conditions,
      or: (conditions: unknown[]): unknown[] => conditions,
    },
  );

  const builder: QueryBuilder = {
    distinctOn: (...args: unknown[]): QueryBuilder => {
      calls.push({ args, method: 'distinctOn' });
      return builder;
    },
    execute: (): Promise<unknown> => {
      calls.push({ args: [], method: 'execute' });
      return Promise.resolve(executeResult);
    },
    executeTakeFirst: (): Promise<unknown> => {
      calls.push({ args: [], method: 'executeTakeFirst' });
      return Promise.resolve(executeTakeFirstResult);
    },
    innerJoin: (...args: unknown[]): QueryBuilder => {
      calls.push({ args, method: 'innerJoin' });
      return builder;
    },
    orderBy: (...args: unknown[]): QueryBuilder => {
      calls.push({ args, method: 'orderBy' });
      return builder;
    },
    select: (...args: unknown[]): QueryBuilder => {
      calls.push({ args, method: 'select' });
      const [firstArg] = args;
      if (typeof firstArg === 'function') {
        firstArg({ ref: (value: string): string => value });
      }
      return builder;
    },
    selectAll: (): QueryBuilder => {
      calls.push({ args: [], method: 'selectAll' });
      return builder;
    },
    where: (...args: unknown[]): QueryBuilder => {
      calls.push({ args, method: 'where' });
      const [firstArg] = args;
      if (typeof firstArg === 'function') {
        firstArg(qb);
      }
      return builder;
    },
  };

  return builder;
};

const setupReaderMock = ({
  executeResult,
  executeTakeFirstResult,
}: {
  executeResult: unknown;
  executeTakeFirstResult: unknown;
}): {
  baseCalls: QueryCall[];
  countAllAsMock: jest.Mock<{ alias: string; type: 'countAll' }, [string]>;
  cteCalls: QueryCall[];
  withMock: jest.Mock;
} => {
  const baseCalls: QueryCall[] = [];
  const cteCalls: QueryCall[] = [];

  const baseBuilder = createQueryBuilder({
    calls: baseCalls,
    executeResult,
    executeTakeFirstResult,
  });
  const cteBuilder = createQueryBuilder({
    calls: cteCalls,
    executeResult,
    executeTakeFirstResult,
  });

  const countAllAsMock = jest.fn(
    (alias: string): { alias: string; type: 'countAll' } => ({
      alias,
      type: 'countAll',
    }),
  );

  const withMock = jest.fn(
    (
      _name: string,
      callback: () => QueryBuilder,
    ): {
      selectFrom: (table: string) => QueryBuilder;
    } => {
      callback();
      return {
        selectFrom: (table: string): QueryBuilder => {
          cteCalls.push({ args: [table], method: 'selectFrom' });
          return cteBuilder;
        },
      };
    },
  );

  const reader: MockReader = {
    fn: {
      countAll: () => ({
        as: countAllAsMock,
      }),
    },
    selectFrom: (table: string): QueryBuilder => {
      baseCalls.push({ args: [table], method: 'selectFrom' });
      return baseBuilder;
    },
    with: withMock,
  };

  getDbReader.mockImplementation(callback => {
    const typedCallback = callback as unknown as (
      db: MockReader,
    ) => Promise<unknown> | unknown;

    return Promise.resolve(typedCallback(reader));
  });

  return { baseCalls, countAllAsMock, cteCalls, withMock };
};

describe('event-codes-by-year-helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a non-distinct count and applies single-year and non-stricken filters', async () => {
    const expectedCount = 11;
    const { baseCalls, countAllAsMock, withMock } = setupReaderMock({
      executeResult: [],
      executeTakeFirstResult: { count: expectedCount },
    });

    getJsTimeframeForYear.mockReturnValue({
      begin: calculateDate({ dateString: '2024-01-01T00:00:00.000Z' }),
      end: calculateDate({ dateString: '2025-01-01T00:00:00.000Z' }),
    });

    const result: number | EventCodeReportDocketEntry[] =
      await getDocketEntriesByEventCodesAndYears({
        count: true,
        distinct: false,
        eventCodes: ['O'],
        fiscal: false,
        onlyNonStricken: true,
        years: [2024],
      });

    expect(result).toEqual(expectedCount);
    expect(countAllAsMock).toHaveBeenCalledWith('count');
    expect(withMock).not.toHaveBeenCalled();
    expect(baseCalls).toEqual(
      expect.arrayContaining([
        {
          args: ['dwDocketEntry as de'],
          method: 'selectFrom',
        },
        {
          args: ['de.eventCode', 'in', ['O']],
          method: 'where',
        },
        {
          args: ['de.isStricken', '!=', true],
          method: 'where',
        },
        {
          args: [
            'de.receivedAt',
            '>=',
            calculateDate({ dateString: '2024-01-01T00:00:00.000Z' }),
          ],
          method: 'where',
        },
        {
          args: [
            'de.receivedAt',
            '<',
            calculateDate({ dateString: '2025-01-01T00:00:00.000Z' }),
          ],
          method: 'where',
        },
        {
          args: [],
          method: 'executeTakeFirst',
        },
      ]),
    );
  });

  it('returns a distinct count using docketEntryId', async () => {
    const expectedCount = 7;
    const { baseCalls, countAllAsMock, withMock } = setupReaderMock({
      executeResult: [],
      executeTakeFirstResult: { count: expectedCount },
    });

    const result: number | EventCodeReportDocketEntry[] =
      await getDocketEntriesByEventCodesAndYears({
        count: true,
        distinct: true,
        eventCodes: ['O', 'ODJ'],
        fiscal: true,
      });

    expect(result).toEqual(expectedCount);
    expect(countAllAsMock).not.toHaveBeenCalled();
    expect(withMock).not.toHaveBeenCalled();
    expect(baseCalls).toEqual(
      expect.arrayContaining([
        {
          args: ['dwDocketEntry as de'],
          method: 'selectFrom',
        },
        {
          args: ['de.eventCode', 'in', ['O', 'ODJ']],
          method: 'where',
        },
        {
          args: [],
          method: 'executeTakeFirst',
        },
      ]),
    );
  });

  it('returns distinct docket entries in a stable order for multi-year searches', async () => {
    const rows: EventCodeReportDocketEntry[] = [
      {
        associatedJudge: 'Buch',
        caption: 'Test Petitioner',
        docketNumber: '101-25',
        documentType: 'Order',
        receivedAt: calculateDate({
          dateString: '2025-04-01T00:00:00.000Z',
        }),
        status: 'New',
      },
    ];
    const { baseCalls, cteCalls, withMock } = setupReaderMock({
      executeResult: rows,
      executeTakeFirstResult: { count: 0 },
    });

    getJsTimeframeForYear
      .mockReturnValueOnce({
        begin: calculateDate({ dateString: '2024-01-01T00:00:00.000Z' }),
        end: calculateDate({ dateString: '2025-01-01T00:00:00.000Z' }),
      })
      .mockReturnValueOnce({
        begin: calculateDate({ dateString: '2025-01-01T00:00:00.000Z' }),
        end: calculateDate({ dateString: '2026-01-01T00:00:00.000Z' }),
      });

    const result: number | EventCodeReportDocketEntry[] =
      await getDocketEntriesByEventCodesAndYears({
        distinct: true,
        eventCodes: ['O'],
        fiscal: false,
        onlyNonStricken: true,
        years: [2024, 2025],
      });

    expect(result).toEqual(rows);
    expect(getJsTimeframeForYear).toHaveBeenCalledTimes(2);
    expect(withMock).toHaveBeenCalledWith(
      'distinctDocketEntries',
      expect.any(Function),
    );
    expect(baseCalls).toEqual(
      expect.arrayContaining([
        {
          args: ['de.eventCode', 'in', ['O']],
          method: 'where',
        },
        {
          args: ['de.isStricken', '!=', true],
          method: 'where',
        },
        {
          args: ['dwCase as c', 'de.docketNumber', 'c.docketNumber'],
          method: 'innerJoin',
        },
      ]),
    );
    expect(
      baseCalls.filter(call => ['distinctOn', 'orderBy'].includes(call.method)),
    ).toEqual([
      {
        args: ['de.docketEntryId'],
        method: 'distinctOn',
      },
      {
        args: ['de.docketEntryId', 'asc'],
        method: 'orderBy',
      },
      {
        args: ['de.servedAt', 'asc'],
        method: 'orderBy',
      },
      {
        args: ['de.docketNumber', 'asc'],
        method: 'orderBy',
      },
    ]);
    expect(cteCalls).toEqual([
      {
        args: ['distinctDocketEntries'],
        method: 'selectFrom',
      },
      {
        args: [],
        method: 'selectAll',
      },
      {
        args: ['receivedAt', 'asc'],
        method: 'orderBy',
      },
      {
        args: ['docketNumber', 'asc'],
        method: 'orderBy',
      },
      {
        args: [],
        method: 'execute',
      },
    ]);
  });

  it('returns non-distinct docket entries without using the distinct CTE path', async () => {
    const rows: EventCodeReportDocketEntry[] = [
      {
        associatedJudge: 'Cohen',
        caption: 'Another Petitioner',
        docketNumber: '102-25',
        documentType: 'Order to Show Cause',
        receivedAt: calculateDate({
          dateString: '2025-05-01T00:00:00.000Z',
        }),
        status: 'Calendared',
      },
    ];
    const { baseCalls, cteCalls, withMock } = setupReaderMock({
      executeResult: rows,
      executeTakeFirstResult: { count: 0 },
    });

    const result: number | EventCodeReportDocketEntry[] =
      await getDocketEntriesByEventCodesAndYears({
        distinct: false,
        eventCodes: ['OSC'],
        fiscal: false,
      });

    expect(result).toEqual(rows);
    expect(withMock).not.toHaveBeenCalled();
    expect(cteCalls).toEqual([]);
    expect(baseCalls).toEqual(
      expect.arrayContaining([
        {
          args: ['dwCase as c', 'de.docketNumber', 'c.docketNumber'],
          method: 'innerJoin',
        },
        {
          args: [],
          method: 'execute',
        },
      ]),
    );
  });
});
