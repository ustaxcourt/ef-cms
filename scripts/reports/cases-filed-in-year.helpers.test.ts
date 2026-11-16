jest.mock('@web-api/persistence/postgres/database', () => ({
  getDbReader: jest.fn(),
}));
jest.mock(
  '@web-api/persistence/postgres/cases/getCasesByDocketNumbers',
  () => ({
    getCasesByDocketNumbers: jest.fn(),
  }),
);
jest.mock('../helpers/generate-csv', () => ({
  generateCsv: jest.fn(),
}));

import {
  casesFiledInYear,
  getDocketNumbersOfPetitionsFiledInTimeframe,
} from './cases-filed-in-year.helpers';
import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  FILING_TYPES_DICT,
  PARTY_TYPES,
  PAYMENT_STATUS,
  PROCEDURE_TYPES_MAP,
} from '@shared/business/entities/EntityConstants';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { generateCsv as generateCsvMock } from '../helpers/generate-csv';
import { getDbReader as getDbReaderMock } from '@web-api/persistence/postgres/database';
import { getJsDateFromIso } from '@shared/business/utilities/DateHandler';

type QueryCall = {
  args: unknown[];
  method: string;
};

type QueryBuilder = {
  execute: () => Promise<unknown>;
  select: (...args: unknown[]) => QueryBuilder;
  where: (...args: unknown[]) => QueryBuilder;
};

type MockReader = {
  selectFrom: (table: string) => QueryBuilder;
};

type DocketNumberRecord = {
  docketNumber: string;
};

const getDbReader = jest.mocked(getDbReaderMock);
const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);
const generateCsv = jest.mocked(generateCsvMock);

const setupDatabaseMock = (
  records: DocketNumberRecord[] | undefined,
): QueryCall[] => {
  const calls: QueryCall[] = [];
  const builder: QueryBuilder = {
    execute: (): Promise<unknown> => Promise.resolve(records),
    select: (...args: unknown[]): QueryBuilder => {
      calls.push({ args, method: 'select' });
      return builder;
    },
    where: (...args: unknown[]): QueryBuilder => {
      calls.push({ args, method: 'where' });
      return builder;
    },
  };
  const reader: MockReader = {
    selectFrom: (table: string): QueryBuilder => {
      calls.push({ args: [table], method: 'selectFrom' });
      return builder;
    },
  };

  getDbReader.mockImplementation(callback => {
    const typedCallback = callback as unknown as (
      db: MockReader,
    ) => Promise<unknown> | unknown;

    return Promise.resolve(typedCallback(reader));
  });

  return calls;
};

const createCase = (overrides: Partial<RawCase> = {}): RawCase =>
  ({
    docketNumber: '100-25',
    sortableDocketNumber: 100,
    ...overrides,
  }) as RawCase;

const reportParameters = {
  begin: '2025-01-01T05:00:00Z',
  end: '2026-01-01T05:00:00Z',
  filename: '/tmp/cases-filed-in-year.csv',
};

describe('getDocketNumbersOfPetitionsFiledInTimeframe', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('queries petition docket numbers in the requested timeframe', async () => {
    const calls = setupDatabaseMock([{ docketNumber: '100-25' }]);

    await expect(
      getDocketNumbersOfPetitionsFiledInTimeframe(reportParameters),
    ).resolves.toEqual(['100-25']);

    expect(calls).toEqual([
      { args: ['dwDocketEntry as de'], method: 'selectFrom' },
      { args: ['de.docketNumber'], method: 'select' },
      { args: ['de.eventCode', '=', 'P'], method: 'where' },
      {
        args: ['de.filingDate', '>=', getJsDateFromIso(reportParameters.begin)],
        method: 'where',
      },
      {
        args: ['de.filingDate', '<', getJsDateFromIso(reportParameters.end)],
        method: 'where',
      },
    ]);
  });

  it('returns an empty list when the query returns no rows', async () => {
    setupDatabaseMock([]);

    await expect(
      getDocketNumbersOfPetitionsFiledInTimeframe(reportParameters),
    ).resolves.toEqual([]);
  });

  it('returns an empty list when the query result is undefined', async () => {
    setupDatabaseMock(undefined);

    await expect(
      getDocketNumbersOfPetitionsFiledInTimeframe(reportParameters),
    ).resolves.toEqual([]);
  });
});

describe('casesFiledInYear', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupDatabaseMock([{ docketNumber: '100-25' }]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sorts cases and writes the CSV report', async () => {
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    const cases = [
      createCase({
        associatedJudge: 'Judy',
        caseCaption: 'Alpha Petitioner,\nPetitioner',
        caseType: CASE_TYPES_MAP.deficiency,
        docketNumber: '101-25',
        filingType: FILING_TYPES_DICT.MYSELF,
        isPaper: true,
        isSealed: true,
        partyType: PARTY_TYPES.petitioner,
        petitionPaymentStatus: PAYMENT_STATUS.PAID,
        preferredTrialCity: 'Birmingham, Alabama',
        privatePractitioners: [{}],
        procedureType: PROCEDURE_TYPES_MAP.regular,
        receivedAt: '2025-01-02T05:00:00Z',
        sortableDocketNumber: 2,
        status: CASE_STATUS_TYPES.new,
      }),
      createCase({
        associatedJudge: 'Dredd',
        caseCaption: undefined,
        caseType: CASE_TYPES_MAP.other,
        docketNumber: '100-25',
        filingType: '',
        isPaper: false,
        isSealed: false,
        partyType: PARTY_TYPES.corporation,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
        preferredTrialCity: 'Anchorage, Alaska',
        privatePractitioners: undefined,
        procedureType: PROCEDURE_TYPES_MAP.small,
        receivedAt: '2025-01-01T05:00:00Z',
        sortableDocketNumber: 1,
        status: CASE_STATUS_TYPES.new,
      }),
    ];
    getCasesByDocketNumbers.mockResolvedValue(cases);

    await casesFiledInYear({ ...reportParameters, stats: false });

    expect(getCasesByDocketNumbers).toHaveBeenCalledWith({
      docketNumbers: ['100-25'],
      excludeFields: [
        'correspondence',
        'docketEntries',
        'hearings',
        'irsPractitioners',
      ],
    });
    expect(generateCsv).toHaveBeenCalledWith({
      columns: [
        { header: 'Docket Number', key: 'docketNumber' },
        { header: 'Case Caption', key: 'caseCaption' },
        { header: 'Case Type', key: 'caseType' },
        { header: 'Date Filed', key: 'dateFiled' },
        { header: 'Filing Method', key: 'filingMethod' },
        { header: 'Filing Type', key: 'filingType' },
        { header: 'Judge', key: 'judge' },
        { header: 'Party Type', key: 'partyType' },
        { header: 'Payment Status', key: 'petitionPaymentStatus' },
        { header: 'Preferred Trial City', key: 'preferredTrialCity' },
        { header: 'Procedure Type', key: 'procedureType' },
        { header: 'Represented', key: 'represented' },
        { header: 'Sealed', key: 'isSealed' },
        { header: 'Status', key: 'status' },
      ],
      filename: reportParameters.filename,
      rows: [
        expect.objectContaining({
          caseCaption: '',
          docketNumber: '100-25',
          filingMethod: 'Electronic',
          filingType: '',
          isSealed: 'No',
          judge: 'Dredd',
          represented: 'Pro Se',
        }),
        expect.objectContaining({
          caseCaption: 'Alpha Petitioner, Petitioner',
          docketNumber: '101-25',
          filingMethod: 'Paper',
          filingType: FILING_TYPES_DICT.MYSELF,
          isSealed: 'Yes',
          judge: 'Judy',
          represented: 'Represented',
        }),
      ],
    });
  });

  it('outputs aggregate statistics in their expected sort order', async () => {
    const logSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);
    const cases = [
      createCase({
        associatedJudge: 'Judy',
        caseType: CASE_TYPES_MAP.other,
        filingType: FILING_TYPES_DICT.MYSELF,
        isPaper: true,
        isSealed: true,
        partyType: PARTY_TYPES.corporation,
        petitionPaymentStatus: PAYMENT_STATUS.PAID,
        preferredTrialCity: 'Mobile, Alabama',
        privatePractitioners: [{}],
        procedureType: PROCEDURE_TYPES_MAP.regular,
        status: CASE_STATUS_TYPES.new,
      }),
      createCase({
        associatedJudge: '',
        caseType: CASE_TYPES_MAP.cdp,
        filingType: '',
        isPaper: false,
        isSealed: false,
        partyType: PARTY_TYPES.petitioner,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
        preferredTrialCity: 'Birmingham, Alabama',
        privatePractitioners: [],
        procedureType: PROCEDURE_TYPES_MAP.small,
        status: CASE_STATUS_TYPES.closed,
      }),
      createCase({
        associatedJudge: 'Dredd',
        caseType: CASE_TYPES_MAP.deficiency,
        filingType: FILING_TYPES_DICT.BUSINESS,
        isPaper: false,
        isSealed: false,
        partyType: PARTY_TYPES.corporation,
        petitionPaymentStatus: PAYMENT_STATUS.PAID,
        preferredTrialCity: 'Anchorage, Alaska',
        privatePractitioners: [],
        procedureType: PROCEDURE_TYPES_MAP.regular,
        status: CASE_STATUS_TYPES.new,
      }),
      createCase({
        isPaper: false,
        isSealed: false,
      }),
    ];
    getCasesByDocketNumbers.mockResolvedValue(cases);

    await casesFiledInYear({ ...reportParameters, stats: true });
    expect(logSpy).toHaveBeenCalledWith({
      caseTypes: {
        'CDP (Lien/Levy)': 1,
        Deficiency: 1,
        Other: 1,
      },
      filingMethods: { electronic: 3, paper: 1 },
      filingTypes: { 'A business': 1, Myself: 1, '': 1 },
      judges: { '': 1, Dredd: 1, Judy: 1 },
      partyTypes: { Corporation: 2, Petitioner: 1 },
      paymentStatuses: { 'Not paid': 1, Paid: 2 },
      preferredTrialCities: {
        'Anchorage, Alaska': 1,
        'Birmingham, Alabama': 1,
        'Mobile, Alabama': 1,
      },
      procedureTypes: { Regular: 2, Small: 1 },
      representation: { proSe: 3, represented: 1 },
      sealed: 1,
      statuses: { Closed: 1, New: 2 },
      total: 4,
    });
    const stats = logSpy.mock.calls[0][0];
    expect(Object.keys(stats.caseTypes)).toEqual([
      'CDP (Lien/Levy)',
      'Deficiency',
      'Other',
    ]);
    expect(Object.keys(stats.filingTypes)).toEqual([
      'A business',
      'Myself',
      '',
    ]);
    expect(Object.keys(stats.judges)).toEqual(['Dredd', 'Judy', '']);
    expect(Object.keys(stats.preferredTrialCities)).toEqual([
      'Birmingham, Alabama',
      'Mobile, Alabama',
      'Anchorage, Alaska',
    ]);
  });
});
