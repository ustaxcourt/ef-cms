type CaseRow = {
  docketNumber: string;
  automaticBlocked: boolean;
  automaticBlockedDate: string | null;
  automaticBlockedReason: string | null;
  hasPendingItems: boolean;
};

type CaseQueryBuilder = {
  execute: () => Promise<{ docketNumber: string }[]>;
  select: (columns: string[]) => CaseQueryBuilder;
  where: (column: string, operator: string, value: unknown) => CaseQueryBuilder;
};

type MockDbReader = {
  selectFrom: (table: string) => CaseQueryBuilder;
};

type WhereQueryBuilder = {
  where: (
    column: string,
    operator: string,
    value: string | string[],
  ) => WhereQueryBuilder;
};

type UpdateCaseWithLockingOptions = { docketNumber: string };
type MockLockInfo = { identifiers: string[] };

type MockRawCase = {
  automaticBlocked?: boolean;
  automaticBlockedReason?: string | null;
  docketNumber: string;
  hasPendingItems?: boolean;
};

// Stands in for the `dwCase` table; the `pgUpdateTable` mock writes back into it.
let caseTable: CaseRow[] = [];

const blockedCase = (
  overrides: Partial<CaseRow> & { docketNumber: string },
): CaseRow => ({
  automaticBlocked: true,
  automaticBlockedDate: '2020-01-01T00:00:00.000Z',
  automaticBlockedReason: 'Pending Item',
  hasPendingItems: true,
  ...overrides,
});

const mockParseArgsAndEnvVars = jest.fn();
const mockGetCasesByDocketNumbers = jest.fn();
const mockPgUpdateTable = jest.fn();
const mockUpdateCaseAutomaticBlock = jest.fn();
const mockLockIdentifiers: string[][] = [];

const createCaseQueryBuilder = (): CaseQueryBuilder => {
  const builder: CaseQueryBuilder = {
    execute: (): Promise<{ docketNumber: string }[]> =>
      Promise.resolve(
        caseTable
          .filter(row => row.automaticBlocked)
          .map(({ docketNumber }) => ({ docketNumber })),
      ),
    select: () => builder,
    where: () => builder,
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
        options: UpdateCaseWithLockingOptions,
        authorizedUser: undefined,
      ) => Promise<unknown>,
      getLockInfo: (
        applicationContext: object,
        options: UpdateCaseWithLockingOptions,
        authorizedUser: undefined,
      ) => MockLockInfo,
    ) =>
    async (
      applicationContext: object,
      options: UpdateCaseWithLockingOptions,
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
    public automaticBlocked?: boolean;
    public automaticBlockedReason?: string | null;
    public docketNumber: string;
    public hasPendingItems?: boolean;

    constructor(MockRawCase: MockRawCase) {
      this.docketNumber = MockRawCase.docketNumber;
      this.automaticBlocked = MockRawCase.automaticBlocked;
      this.automaticBlockedReason = MockRawCase.automaticBlockedReason;
      this.hasPendingItems = MockRawCase.hasPendingItems;
    }
  },
}));

const runScript = async (): Promise<void> => {
  jest.resetModules();
  await import('./fix-stale-automatic-blocks-new');
  await new Promise(resolve => setImmediate(resolve));
};

// pgUpdateTable receives its docket numbers inside a `where` callback, so the
// callback is replayed against a stub query builder to read them back out.
const getDocketNumbersFromWhere = (
  where: (qb: WhereQueryBuilder) => unknown,
): string[] => {
  const captured: string[] = [];
  const queryBuilder: WhereQueryBuilder = {
    where: (_column: string, _operator: string, value: string | string[]) => {
      if (Array.isArray(value)) {
        captured.push(...value);
      } else {
        captured.push(value);
      }
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

const mockMockRawCase = (
  overrides: Partial<MockRawCase> & { docketNumber: string },
): MockRawCase => ({
  automaticBlocked: true,
  automaticBlockedReason: 'Pending Item',
  hasPendingItems: true,
  ...overrides,
});

describe('fix-stale-automatic-blocks-new.ts', () => {
  beforeEach(() => {
    caseTable = [];
    mockLockIdentifiers.length = 0;
    mockParseArgsAndEnvVars.mockReturnValue({ dryRun: false });
    mockGetCasesByDocketNumbers.mockResolvedValue([]);
    mockUpdateCaseAutomaticBlock.mockImplementation(
      ({ caseEntity }: { caseEntity: MockRawCase }) => caseEntity,
    );
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

  it('should fix stale automatic blocks for cases that need evaluation', async () => {
    caseTable = [
      blockedCase({ docketNumber: '103-20' }),
      blockedCase({ docketNumber: '104-20' }),
    ];
    mockGetCasesByDocketNumbers.mockImplementation(
      ({ docketNumbers }: { docketNumbers: string[] }) =>
        Promise.resolve(
          docketNumbers.map(docketNumber => mockMockRawCase({ docketNumber })),
        ),
    );
    mockUpdateCaseAutomaticBlock.mockImplementation(
      ({ caseEntity }: { caseEntity: MockRawCase }) => ({
        ...caseEntity,
        automaticBlocked: caseEntity.docketNumber === '104-20',
        automaticBlockedDate: null,
        automaticBlockedReason:
          caseEntity.docketNumber === '104-20' ? 'Pending Item' : null,
        hasPendingItems: caseEntity.docketNumber === '104-20',
      }),
    );

    await runScript();

    expect(mockGetCasesByDocketNumbers).toHaveBeenCalledWith(
      expect.objectContaining({
        docketNumbers: ['103-20'],
      }),
    );
    expect(mockGetCasesByDocketNumbers).toHaveBeenCalledWith(
      expect.objectContaining({
        docketNumbers: ['104-20'],
      }),
    );
    expect(mockUpdateCaseAutomaticBlock).toHaveBeenCalledWith(
      expect.objectContaining({
        caseEntity: expect.objectContaining({ docketNumber: '103-20' }),
      }),
    );
  });

  it('should skip cases that remain blocked after evaluation', async () => {
    caseTable = [blockedCase({ docketNumber: '111-20' })];
    mockGetCasesByDocketNumbers.mockImplementation(
      ({ docketNumbers }: { docketNumbers: string[] }) =>
        Promise.resolve(
          docketNumbers.map(docketNumber => mockMockRawCase({ docketNumber })),
        ),
    );
    mockUpdateCaseAutomaticBlock.mockResolvedValue({
      automaticBlocked: true,
      automaticBlockedReason: 'Pending Item',
      docketNumber: '111-20',
      hasPendingItems: true,
    });

    await runScript();

    expect(mockGetCasesByDocketNumbers).toHaveBeenCalledWith(
      expect.objectContaining({
        docketNumbers: ['111-20'],
      }),
    );

    expect(mockPgUpdateTable).not.toHaveBeenCalled();
    expect(getCaseRow('111-20')).toMatchObject({
      automaticBlocked: true,
      automaticBlockedReason: 'Pending Item',
      hasPendingItems: true,
    });
    expect(console.log).toHaveBeenCalledWith(
      '0 cases were updated; 0 failed to update.',
    );
  });

  it('should skip persisting when blocked fields are unchanged after evaluation', async () => {
    caseTable = [blockedCase({ docketNumber: '112-20' })];
    mockGetCasesByDocketNumbers.mockImplementation(
      ({ docketNumbers }: { docketNumbers: string[] }) =>
        Promise.resolve(
          docketNumbers.map(docketNumber =>
            mockMockRawCase({
              automaticBlocked: true,
              automaticBlockedReason: 'Pending Item',
              docketNumber,
              hasPendingItems: true,
            }),
          ),
        ),
    );
    mockUpdateCaseAutomaticBlock.mockResolvedValue({
      automaticBlocked: true,
      automaticBlockedReason: 'Pending Item',
      docketNumber: '112-20',
      hasPendingItems: true,
    });

    await runScript();

    expect(mockPgUpdateTable).not.toHaveBeenCalled();
    expect(getCaseRow('112-20')).toMatchObject({
      automaticBlocked: true,
      automaticBlockedReason: 'Pending Item',
      hasPendingItems: true,
    });
  });

  it('should persist when hasPendingItems changes even if automaticBlocked stays true', async () => {
    caseTable = [blockedCase({ docketNumber: '113-20' })];
    mockGetCasesByDocketNumbers.mockImplementation(
      ({ docketNumbers }: { docketNumbers: string[] }) =>
        Promise.resolve(
          docketNumbers.map(docketNumber =>
            mockMockRawCase({
              automaticBlocked: true,
              automaticBlockedReason: 'Pending Item',
              docketNumber,
              hasPendingItems: true,
            }),
          ),
        ),
    );
    mockUpdateCaseAutomaticBlock.mockResolvedValue({
      automaticBlocked: true,
      automaticBlockedReason: 'Pending Item',
      docketNumber: '113-20',
      hasPendingItems: false,
    });

    await runScript();

    expect(mockPgUpdateTable).toHaveBeenCalledTimes(1);
    expect(mockPgUpdateTable.mock.calls[0][0]).toMatchObject({
      table: 'dwCase',
      values: {
        automaticBlocked: true,
        automaticBlockedDate: null,
        automaticBlockedReason: 'Pending Item',
        hasPendingItems: false,
      },
    });
    expect(getUpdatedDocketNumbers()).toEqual([['113-20']]);
    expect(getCaseRow('113-20')).toMatchObject({
      automaticBlocked: true,
      automaticBlockedReason: 'Pending Item',
      hasPendingItems: false,
    });
  });

  it('should persist when automaticBlockedReason changes even if automaticBlocked stays true', async () => {
    caseTable = [blockedCase({ docketNumber: '120-20' })];
    mockGetCasesByDocketNumbers.mockImplementation(
      ({ docketNumbers }: { docketNumbers: string[] }) =>
        Promise.resolve(
          docketNumbers.map(docketNumber =>
            mockMockRawCase({
              automaticBlocked: true,
              automaticBlockedReason: 'Pending Item',
              docketNumber,
              hasPendingItems: true,
            }),
          ),
        ),
    );
    mockUpdateCaseAutomaticBlock.mockResolvedValue({
      automaticBlocked: true,
      automaticBlockedReason: 'Pending Item and Due Date',
      docketNumber: '120-20',
      hasPendingItems: true,
    });

    await runScript();

    expect(mockPgUpdateTable).toHaveBeenCalledTimes(1);
    expect(getUpdatedDocketNumbers()).toEqual([['120-20']]);
    expect(getCaseRow('120-20')).toMatchObject({
      automaticBlocked: true,
      automaticBlockedReason: 'Pending Item and Due Date',
      hasPendingItems: true,
    });
  });

  it('should count but not persist updates when the dry run flag is set', async () => {
    mockParseArgsAndEnvVars.mockReturnValue({ dryRun: true });
    caseTable = [
      blockedCase({ docketNumber: '107-20' }),
      blockedCase({ docketNumber: '108-20' }),
    ];
    mockGetCasesByDocketNumbers.mockImplementation(
      ({ docketNumbers }: { docketNumbers: string[] }) =>
        Promise.resolve(
          docketNumbers.map(docketNumber => mockMockRawCase({ docketNumber })),
        ),
    );
    mockUpdateCaseAutomaticBlock.mockImplementation(
      ({ caseEntity }: { caseEntity: MockRawCase }) => ({
        ...caseEntity,
        automaticBlocked: caseEntity.docketNumber === '108-20',
        automaticBlockedReason:
          caseEntity.docketNumber === '108-20' ? 'Pending Item' : null,
        hasPendingItems: caseEntity.docketNumber === '108-20',
      }),
    );

    await runScript();

    expect(mockPgUpdateTable).not.toHaveBeenCalled();
    expect(getCaseRow('107-20')).toMatchObject({ automaticBlocked: true });
    expect(getCaseRow('108-20')).toMatchObject({ automaticBlocked: true });
    expect(console.log).toHaveBeenCalledWith(
      '1 cases were updated; 0 failed to update.',
    );
  });

  it('should report cases whose evaluation failed without updating them', async () => {
    caseTable = [blockedCase({ docketNumber: '114-20' })];
    mockGetCasesByDocketNumbers.mockRejectedValue(new Error('load failed'));

    await runScript();

    expect(mockPgUpdateTable).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Failed to update case 114-20',
      expect.any(Error),
    );
    expect(console.log).toHaveBeenCalledWith(
      '0 cases were updated; 1 failed to update.',
    );
    expect(console.log).toHaveBeenCalledWith('Failed to update these cases:', [
      '114-20',
    ]);
    expect(getCaseRow('114-20')).toMatchObject({ automaticBlocked: true });
  });

  it('should report cases whose persistence failed without updating them', async () => {
    caseTable = [blockedCase({ docketNumber: '115-20' })];
    mockGetCasesByDocketNumbers.mockImplementation(
      ({ docketNumbers }: { docketNumbers: string[] }) =>
        Promise.resolve(
          docketNumbers.map(docketNumber => mockMockRawCase({ docketNumber })),
        ),
    );
    mockUpdateCaseAutomaticBlock.mockResolvedValue({
      automaticBlocked: false,
      automaticBlockedReason: null,
      docketNumber: '115-20',
      hasPendingItems: false,
    });
    mockPgUpdateTable.mockRejectedValue(new Error('update failed'));

    await runScript();

    expect(console.error).toHaveBeenCalledWith(
      'Failed to update case 115-20',
      expect.any(Error),
    );
    expect(console.log).toHaveBeenCalledWith(
      '0 cases were updated; 1 failed to update.',
    );
    expect(console.log).toHaveBeenCalledWith('Failed to update these cases:', [
      '115-20',
    ]);
    expect(getCaseRow('115-20')).toMatchObject({ automaticBlocked: true });
  });

  it('should report cases whose automatic block evaluation failed', async () => {
    caseTable = [
      blockedCase({ docketNumber: '116-20' }),
      blockedCase({ docketNumber: '117-20' }),
      {
        docketNumber: '118-20',
        automaticBlocked: false,
        automaticBlockedDate: null,
        automaticBlockedReason: null,
        hasPendingItems: false,
      },
    ];
    mockGetCasesByDocketNumbers.mockImplementation(
      ({ docketNumbers }: { docketNumbers: string[] }) =>
        Promise.resolve(
          docketNumbers.map(docketNumber => mockMockRawCase({ docketNumber })),
        ),
    );
    mockUpdateCaseAutomaticBlock.mockRejectedValue(
      new Error('evaluate failed'),
    );

    await runScript();

    expect(mockPgUpdateTable).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Failed to update these cases:', [
      '116-20',
      '117-20',
    ]);
  });

  it('should handle an empty candidate list', async () => {
    caseTable = [];

    await runScript();

    expect(mockGetCasesByDocketNumbers).not.toHaveBeenCalled();
    expect(mockPgUpdateTable).not.toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith(
      'Number of cases with automatically blocked true: ',
      0,
    );
    expect(console.log).toHaveBeenCalledWith(
      '0 cases were updated; 0 failed to update.',
    );
  });

  it('should report a case as failed when it is missing from the database load', async () => {
    caseTable = [blockedCase({ docketNumber: '121-20' })];
    mockGetCasesByDocketNumbers.mockResolvedValue([]);

    await runScript();

    expect(mockPgUpdateTable).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith(
      'Failed to update case 121-20',
      expect.any(Error),
    );
    expect(console.log).toHaveBeenCalledWith('Failed to update these cases:', [
      '121-20',
    ]);
  });
});
