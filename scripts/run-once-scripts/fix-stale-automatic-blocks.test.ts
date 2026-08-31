type CaseRow = {
  docketNumber: string;
  automaticBlocked: boolean;
  automaticBlockedDate: string | null;
  automaticBlockedReason: string | null;
  trialDate: string | null;
  hasDeadline: boolean;
};

type SubQueryBuilder = {
  select: (column: string) => SubQueryBuilder;
  where: (column: string, operator: string, value: unknown) => SubQueryBuilder;
  whereRef: (
    leftColumn: string,
    operator: string,
    rightColumn: string,
  ) => SubQueryBuilder;
};

type ExistsExpression = {
  as: (alias: string) => Record<string, never>;
};

type ExpressionBuilder = {
  exists: (subquery: SubQueryBuilder) => ExistsExpression;
  selectFrom: (table: string) => SubQueryBuilder;
};

type CaseQueryBuilder = {
  execute: () => Promise<CaseRow[]>;
  select: (
    selectCallback: (eb: ExpressionBuilder) => readonly unknown[],
  ) => CaseQueryBuilder;
  where: (column: string, operator: string, value: unknown) => CaseQueryBuilder;
};

type MockDbReader = {
  selectFrom: (table: string) => CaseQueryBuilder;
};

type WhereQueryBuilder = {
  where: (
    column: string,
    operator: string,
    value: string[],
  ) => WhereQueryBuilder;
};

type UpdateStaleCasesOptions = { docketNumbers: string[] };
type LockInfo = { identifiers: string[] };

// Stands in for the `dwCase` table; the `pgUpdateTable` mock writes back into it.
let caseTable: CaseRow[] = [];
// When set, scoped (under-lock) re-scans see these rows instead of `caseTable`.
let caseTableAtRescan: CaseRow[] | undefined;

const blockedCase = (
  overrides: Partial<CaseRow> & { docketNumber: string },
): CaseRow => ({
  automaticBlocked: true,
  automaticBlockedDate: '2020-01-01T00:00:00.000Z',
  automaticBlockedReason: 'Pending Item',
  hasDeadline: false,
  trialDate: null,
  ...overrides,
});

const mockParseArgsAndEnvVars = jest.fn();
const mockGetCasesByDocketNumbers = jest.fn();
const mockPgUpdateTable = jest.fn();
const mockUpdateCaseAutomaticBlock = jest.fn();
const mockLockIdentifiers: string[][] = [];

const createSubQueryBuilder = (): SubQueryBuilder => {
  const builder: SubQueryBuilder = {
    select: () => builder,
    where: () => builder,
    whereRef: () => builder,
  };
  return builder;
};

const createCaseQueryBuilder = (): CaseQueryBuilder => {
  let scopedDocketNumbers: string[] | undefined;

  const builder: CaseQueryBuilder = {
    execute: (): Promise<CaseRow[]> => {
      const rows = scopedDocketNumbers
        ? (caseTableAtRescan ?? caseTable).filter(row =>
            scopedDocketNumbers!.includes(row.docketNumber),
          )
        : caseTable;
      return Promise.resolve(rows.filter(row => row.automaticBlocked));
    },
    select: (selectCallback: (eb: ExpressionBuilder) => readonly unknown[]) => {
      selectCallback({
        exists: () => ({ as: () => ({}) }),
        selectFrom: () => createSubQueryBuilder(),
      });
      return builder;
    },
    where: (column: string, operator: string, value: unknown) => {
      if (
        column === 'c.docketNumber' &&
        operator === 'in' &&
        Array.isArray(value)
      ) {
        scopedDocketNumbers = value.filter(
          (item): item is string => typeof item === 'string',
        );
      }
      return builder;
    },
  };

  return builder;
};

jest.mock('p-limit', () => ({
  __esModule: true,
  default: () => (fn: () => unknown) => fn(),
}));

jest.mock('scripts/helpers/parseArgsAndEnvVars', () => ({
  parseArgsAndEnvVars: (...args: unknown[]) => mockParseArgsAndEnvVars(...args),
}));

jest.mock('@web-api/applicationContext', () => ({
  createApplicationContext: () => ({}),
}));

jest.mock('@web-api/persistence/postgres/database', () => ({
  getDbReader: (cb: (reader: MockDbReader) => unknown) =>
    cb({ selectFrom: () => createCaseQueryBuilder() }),
}));

jest.mock(
  '@web-api/persistence/postgres/cases/getCasesByDocketNumbers',
  () => ({
    getCasesByDocketNumbers: (...args: unknown[]) =>
      mockGetCasesByDocketNumbers(...args),
  }),
);

jest.mock(
  '@web-api/persistence/postgres/utils/operation/pgUpdateTable',
  () => ({
    pgUpdateTable: (...args: unknown[]) => mockPgUpdateTable(...args),
  }),
);

jest.mock('@web-api/persistence/postgres/utils/transactions', () => ({
  withTransaction: (fn: () => Promise<unknown>) => fn(),
}));

jest.mock('@web-api/persistence/postgres/utils/mutex', () => ({
  withLocking:
    (
      interactor: (
        applicationContext: object,
        options: UpdateStaleCasesOptions,
        authorizedUser: undefined,
      ) => Promise<unknown>,
      getLockInfo: (
        applicationContext: object,
        options: UpdateStaleCasesOptions,
        authorizedUser: undefined,
      ) => LockInfo,
    ) =>
    async (
      applicationContext: object,
      options: UpdateStaleCasesOptions,
      authorizedUser: undefined,
    ) => {
      const { identifiers } = getLockInfo(
        applicationContext,
        options,
        authorizedUser,
      );
      mockLockIdentifiers.push(identifiers);
      return interactor(applicationContext, options, authorizedUser);
    },
}));

jest.mock('@web-api/utilities/settlePromises', () => ({
  settlePromises: (promises: Promise<unknown>[]) => Promise.all(promises),
}));

jest.mock(
  '@web-api/business/useCaseHelper/automaticBlock/updateCaseAutomaticBlock',
  () => ({
    updateCaseAutomaticBlock: (...args: unknown[]) =>
      mockUpdateCaseAutomaticBlock(...args),
  }),
);

jest.mock('@shared/business/entities/cases/Case', () => ({
  Case: class {
    public docketNumber: string;
    constructor(rawCase: { docketNumber: string }) {
      this.docketNumber = rawCase.docketNumber;
    }
  },
}));

const flushPromises = (): Promise<void> =>
  new Promise(resolve => setImmediate(resolve));

const scriptCompletionMessages = [
  'Dry run: no cases were updated.',
  'Finished! Updated',
] as const;

const hasScriptCompleted = (): boolean =>
  (console.log as jest.Mock).mock.calls.some(([message]) =>
    typeof message === 'string'
      ? scriptCompletionMessages.some(completionMessage =>
          message.startsWith(completionMessage),
        )
      : false,
  );

const runScript = async (): Promise<void> => {
  jest.resetModules();
  await import('./fix-stale-automatic-blocks');

  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (hasScriptCompleted()) return;
    await flushPromises();
  }

  throw new Error('Script did not complete within expected time');
};

// pgUpdateTable receives its docket numbers inside a `where` callback, so the
// callback is replayed against a stub query builder to read them back out.
const getDocketNumbersFromWhere = (
  where: (qb: WhereQueryBuilder) => unknown,
): string[] => {
  const captured: string[] = [];
  const queryBuilder: WhereQueryBuilder = {
    where: (_column: string, _operator: string, value: string[]) => {
      captured.push(...value);
      return queryBuilder;
    },
  };
  where(queryBuilder);
  return captured;
};

const getUpdatedDocketNumbers = (): string[][] =>
  mockPgUpdateTable.mock.calls.map(([{ where }]) =>
    getDocketNumbersFromWhere(where),
  );

const getCaseRow = (docketNumber: string): CaseRow | undefined =>
  caseTable.find(row => row.docketNumber === docketNumber);

describe('fix-stale-automatic-blocks.ts', () => {
  beforeEach(() => {
    caseTable = [];
    caseTableAtRescan = undefined;
    mockLockIdentifiers.length = 0;
    mockParseArgsAndEnvVars.mockReturnValue({ dryRun: false });
    mockGetCasesByDocketNumbers.mockResolvedValue([]);
    mockPgUpdateTable.mockImplementation(
      ({
        values,
        where,
      }: {
        values: Partial<CaseRow>;
        where: (qb: WhereQueryBuilder) => unknown;
      }) => {
        const docketNumbers = getDocketNumbersFromWhere(where);
        caseTable = caseTable.map(row =>
          docketNumbers.includes(row.docketNumber)
            ? { ...row, ...values }
            : row,
        );
        return Promise.resolve();
      },
    );
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should resolve cases with a trial date by query alone', async () => {
    caseTable = [
      blockedCase({
        docketNumber: '101-20',
        hasDeadline: true,
        trialDate: '2020-01-01T00:00:00.000Z',
      }),
      blockedCase({
        docketNumber: '102-20',
        hasDeadline: false,
        trialDate: '2020-01-01T00:00:00.000Z',
      }),
    ];

    await runScript();

    expect(mockGetCasesByDocketNumbers).not.toHaveBeenCalled();
    expect(mockPgUpdateTable).toHaveBeenCalledTimes(1);
    expect(mockPgUpdateTable.mock.calls[0][0]).toMatchObject({
      table: 'dwCase',
      values: {
        automaticBlocked: false,
        automaticBlockedDate: null,
        automaticBlockedReason: null,
      },
    });
    expect(getUpdatedDocketNumbers()).toEqual([['101-20', '102-20']]);
    expect(mockLockIdentifiers).toEqual([['case|101-20', 'case|102-20']]);
    expect(getCaseRow('101-20')).toMatchObject({
      automaticBlocked: false,
      automaticBlockedDate: null,
      automaticBlockedReason: null,
    });
    expect(getCaseRow('102-20')).toMatchObject({
      automaticBlocked: false,
      automaticBlockedDate: null,
      automaticBlockedReason: null,
    });
  });

  it('should fix stale automatic blocks for cases that need evaluation', async () => {
    caseTable = [
      blockedCase({ docketNumber: '103-20' }),
      blockedCase({ docketNumber: '104-20' }),
    ];
    mockGetCasesByDocketNumbers.mockImplementation(
      ({ docketNumbers }: { docketNumbers: string[] }) =>
        docketNumbers.map(docketNumber => ({ docketNumber })),
    );
    mockUpdateCaseAutomaticBlock.mockImplementation(
      ({ caseEntity }: { caseEntity: { docketNumber: string } }) => ({
        automaticBlocked: caseEntity.docketNumber === '104-20',
      }),
    );

    await runScript();

    expect(mockGetCasesByDocketNumbers).toHaveBeenCalledWith({
      docketNumbers: ['103-20', '104-20'],
      excludeFields: ['correspondence', 'hearings', 'irsPractitioners'],
    });
    expect(mockUpdateCaseAutomaticBlock).toHaveBeenCalledWith({
      caseEntity: expect.objectContaining({ docketNumber: '103-20' }),
      hasCaseDeadline: false,
    });
    expect(getUpdatedDocketNumbers()).toEqual([['103-20']]);
    expect(getCaseRow('103-20')).toMatchObject({
      automaticBlocked: false,
      automaticBlockedDate: null,
      automaticBlockedReason: null,
    });
    expect(getCaseRow('104-20')).toMatchObject({ automaticBlocked: true });
  });

  it('should evaluate a case with no pending-flagged docket entries rather than clearing it outright', async () => {
    // A docket entry whose persisted `pending` column is null is read back as
    // undefined, and DocketEntry derives `pending` from tracked event codes, so the
    // entity can still report the case as blocked. The script must defer to it.
    caseTable = [blockedCase({ docketNumber: '111-20', hasDeadline: false })];
    mockGetCasesByDocketNumbers.mockImplementation(
      ({ docketNumbers }: { docketNumbers: string[] }) =>
        docketNumbers.map(docketNumber => ({ docketNumber })),
    );
    mockUpdateCaseAutomaticBlock.mockResolvedValue({
      automaticBlocked: true,
    });

    await runScript();

    expect(mockGetCasesByDocketNumbers).toHaveBeenCalledWith({
      docketNumbers: ['111-20'],
      excludeFields: ['correspondence', 'hearings', 'irsPractitioners'],
    });
    expect(mockPgUpdateTable).not.toHaveBeenCalled();
    expect(getCaseRow('111-20')).toMatchObject({ automaticBlocked: true });
  });

  it('should skip cases that are definitely blocked', async () => {
    caseTable = [
      blockedCase({
        docketNumber: '105-20',
        hasDeadline: true,
      }),
      blockedCase({
        docketNumber: '106-20',
        hasDeadline: true,
      }),
    ];

    await runScript();

    expect(mockGetCasesByDocketNumbers).not.toHaveBeenCalled();
    expect(mockPgUpdateTable).not.toHaveBeenCalled();
    expect(getCaseRow('105-20')).toMatchObject({ automaticBlocked: true });
    expect(getCaseRow('106-20')).toMatchObject({ automaticBlocked: true });
  });

  it('should not update any cases when the dry run flag is set', async () => {
    mockParseArgsAndEnvVars.mockReturnValue({ dryRun: true });
    caseTable = [
      blockedCase({
        docketNumber: '107-20',
        trialDate: '2020-01-01T00:00:00.000Z',
      }),
    ];

    await runScript();

    expect(mockPgUpdateTable).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Dry run: no cases were updated.');
    expect(getCaseRow('107-20')).toMatchObject({ automaticBlocked: true });
  });

  it('should report cases whose evaluation failed without updating them', async () => {
    caseTable = [blockedCase({ docketNumber: '108-20' })];
    mockGetCasesByDocketNumbers.mockRejectedValue(new Error('load failed'));

    await runScript();

    expect(mockPgUpdateTable).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(
      'Failed to evaluate these cases:',
      ['108-20'],
    );
    expect(getCaseRow('108-20')).toMatchObject({ automaticBlocked: true });
  });

  it('should skip a batch when the update fails', async () => {
    caseTable = [
      blockedCase({
        docketNumber: '109-20',
        trialDate: '2020-01-01T00:00:00.000Z',
      }),
    ];
    mockPgUpdateTable.mockRejectedValue(new Error('lock failed'));

    await runScript();

    expect(console.error).toHaveBeenCalledWith(
      'Skipped batch; could not lock or update',
      expect.objectContaining({ docketNumbers: ['109-20'] }),
    );
    expect(console.log).toHaveBeenCalledWith('Skipped 1 cases:', ['109-20']);
    expect(getCaseRow('109-20')).toMatchObject({ automaticBlocked: true });
  });

  it('should not update a case that was re-blocked between the scan and the update', async () => {
    caseTable = [
      blockedCase({
        docketNumber: '110-20',
        trialDate: '2020-01-01T00:00:00.000Z',
      }),
    ];
    caseTableAtRescan = [
      blockedCase({
        docketNumber: '110-20',
        hasDeadline: true,
        trialDate: null,
      }),
    ];

    await runScript();

    expect(mockPgUpdateTable).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Finished! Updated 0 cases.');
    expect(getCaseRow('110-20')).toMatchObject({ automaticBlocked: true });
  });
});
