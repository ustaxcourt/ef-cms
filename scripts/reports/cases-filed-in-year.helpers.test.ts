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
  CONTACT_TYPES,
  FILING_TYPES_DICT,
  PARTY_TYPES,
  PAYMENT_STATUS,
  PETITIONER_ROLE_OPTIONS,
  PROCEDURE_TYPES_MAP,
  REGULAR_TRIAL_CITY_STRINGS,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { generateCsv as generateCsvMock } from '../helpers/generate-csv';
import { getDbReader as getDbReaderMock } from '@web-api/persistence/postgres/database';
import { getJsDateFromIso } from '@shared/business/utilities/DateHandler';
import { MOCK_CASE } from '@shared/test/mockCase';

const [birminghamAlabama, mobileAlabama, anchorageAlaska] =
  REGULAR_TRIAL_CITY_STRINGS;

const createPetitioner = (
  contactType: string,
): RawCase['petitioners'][number] => ({
  ...MOCK_CASE.petitioners[0],
  contactType,
});

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
  filingDate: Date;
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

const createCase = (overrides: Partial<RawCase> = {}): RawCase => {
  const docketNumber = overrides.docketNumber ?? '100-25';
  return {
    docketNumber,
    docketNumberWithSuffix: docketNumber,
    sortableDocketNumber: 100,
    ...overrides,
  } as RawCase;
};

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
    const calls = setupDatabaseMock([
      {
        docketNumber: '100-25',
        filingDate: getJsDateFromIso('2025-01-01T05:00:00Z'),
      },
    ]);

    await expect(
      getDocketNumbersOfPetitionsFiledInTimeframe(reportParameters),
    ).resolves.toEqual(['100-25']);

    expect(calls).toEqual([
      { args: ['dwDocketEntry as de'], method: 'selectFrom' },
      { args: [['de.docketNumber', 'de.filingDate']], method: 'select' },
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
    setupDatabaseMock([
      {
        docketNumber: '100-25',
        filingDate: getJsDateFromIso('2025-01-01T05:00:00Z'),
      },
    ]);
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
        leadDocketNumber: '100-25',
        partyType: PARTY_TYPES.petitioner,
        petitionPaymentStatus: PAYMENT_STATUS.PAID,
        petitioners: [
          createPetitioner(CONTACT_TYPES.primary),
          createPetitioner(CONTACT_TYPES.intervenor),
          createPetitioner(CONTACT_TYPES.participant),
        ],
        preferredTrialCity: birminghamAlabama,
        privatePractitioners: [{}],
        procedureType: PROCEDURE_TYPES_MAP.regular,
        remoteTrialGranted: true,
        receivedAt: '2025-01-02T05:00:00Z',
        sortableDocketNumber: 202500002,
        status: CASE_STATUS_TYPES.new,
      }),
      createCase({
        associatedJudge: 'Dredd',
        caseCaption: 'Beta and Gamma,\nPetitioners',
        caseType: CASE_TYPES_MAP.other,
        docketNumber: '100-25',
        filingType: FILING_TYPES_DICT.PETITIONER_SPOUSE,
        isPaper: false,
        isSealed: false,
        leadDocketNumber: '100-25',
        partyType: PARTY_TYPES.petitionerSpouse,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
        preferredTrialCity: anchorageAlaska,
        privatePractitioners: undefined,
        procedureType: PROCEDURE_TYPES_MAP.small,
        receivedAt: '2025-01-01T05:00:00Z',
        sortableDocketNumber: 202500001,
        status: CASE_STATUS_TYPES.new,
      }),
      createCase({
        caseCaption: 'Gamma Petitioner,\nPetitioner',
        docketNumber: '102-25',
        filingType: '',
        sortableDocketNumber: 202500003,
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
        { header: 'Has Intervenor', key: 'hasIntervenor' },
        { header: 'Has Participant', key: 'hasParticipant' },
        { header: 'In Consolidated Group', key: 'isInConsolidatedGroup' },
        { header: 'Is Lead Case in Consolidated Group', key: 'isLeadCase' },
        { header: 'Judge', key: 'judge' },
        { header: 'Party Type', key: 'partyType' },
        { header: 'Payment Status', key: 'petitionPaymentStatus' },
        { header: 'Preferred Trial City', key: 'preferredTrialCity' },
        { header: 'Procedure Type', key: 'procedureType' },
        { header: 'Remote Trial Granted', key: 'remoteTrialGranted' },
        { header: 'Represented', key: 'represented' },
        { header: 'Sealed', key: 'isSealed' },
        { header: 'Status', key: 'status' },
      ],
      filename: reportParameters.filename,
      rows: [
        expect.objectContaining({
          caseCaption: 'Beta and Gamma, Petitioners',
          caseType: CASE_TYPES_MAP.other,
          dateFiled: '01-01-2025',
          docketNumber: '100-25',
          filingMethod: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
          filingType: FILING_TYPES_DICT.PETITIONER_SPOUSE,
          hasIntervenor: 'No',
          hasParticipant: 'No',
          isInConsolidatedGroup: 'Yes',
          isLeadCase: 'Yes',
          isSealed: 'No',
          judge: 'Dredd',
          preferredTrialCity: anchorageAlaska,
          remoteTrialGranted: 'No',
          represented: PETITIONER_ROLE_OPTIONS.proSe,
        }),
        expect.objectContaining({
          caseCaption: 'Alpha Petitioner, Petitioner',
          docketNumber: '101-25',
          filingMethod: SERVICE_INDICATOR_TYPES.SI_PAPER,
          filingType: FILING_TYPES_DICT.MYSELF,
          hasIntervenor: 'Yes',
          hasParticipant: 'Yes',
          isInConsolidatedGroup: 'Yes',
          isLeadCase: 'No',
          isSealed: 'Yes',
          judge: 'Judy',
          represented: 'Represented',
          remoteTrialGranted: 'Yes',
        }),
        expect.objectContaining({
          caseCaption: 'Gamma Petitioner, Petitioner',
          docketNumber: '102-25',
          filingType: '',
          isInConsolidatedGroup: 'No',
          isLeadCase: 'No',
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
        leadDocketNumber: '100-25',
        partyType: PARTY_TYPES.corporation,
        petitionPaymentStatus: PAYMENT_STATUS.PAID,
        petitioners: [
          createPetitioner(CONTACT_TYPES.primary),
          createPetitioner(CONTACT_TYPES.intervenor),
          createPetitioner(CONTACT_TYPES.participant),
        ],
        preferredTrialCity: mobileAlabama,
        privatePractitioners: [{}],
        procedureType: PROCEDURE_TYPES_MAP.regular,
        remoteTrialGranted: true,
        status: CASE_STATUS_TYPES.new,
      }),
      createCase({
        associatedJudge: '',
        caseType: CASE_TYPES_MAP.cdp,
        filingType: '',
        isPaper: false,
        isSealed: false,
        leadDocketNumber: '99-25',
        partyType: PARTY_TYPES.petitioner,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
        petitioners: [createPetitioner(CONTACT_TYPES.primary)],
        preferredTrialCity: birminghamAlabama,
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
        petitioners: [],
        preferredTrialCity: anchorageAlaska,
        privatePractitioners: [],
        procedureType: PROCEDURE_TYPES_MAP.regular,
        status: CASE_STATUS_TYPES.new,
      }),
      createCase({
        associatedJudge: undefined,
        filingType: undefined,
        isPaper: false,
        isSealed: false,
        preferredTrialCity: undefined,
      }),
    ];
    getCasesByDocketNumbers.mockResolvedValue(cases);

    await casesFiledInYear({ ...reportParameters, stats: true });
    expect(logSpy).toHaveBeenCalledWith({
      caseTypes: {
        [CASE_TYPES_MAP.cdp]: 1,
        [CASE_TYPES_MAP.deficiency]: 1,
        [CASE_TYPES_MAP.other]: 1,
      },
      consolidatedGroups: 1,
      filingMethods: { electronic: 3, paper: 1 },
      filingTypes: {
        [FILING_TYPES_DICT.BUSINESS]: 1,
        [FILING_TYPES_DICT.MYSELF]: 1,
        '': 2,
      },
      hasIntervenor: 1,
      hasParticipant: 1,
      judges: { '': 2, Dredd: 1, Judy: 1 },
      partyTypes: {
        [PARTY_TYPES.corporation]: 2,
        [PARTY_TYPES.petitioner]: 1,
      },
      paymentStatuses: {
        [PAYMENT_STATUS.UNPAID]: 1,
        [PAYMENT_STATUS.PAID]: 2,
      },
      preferredTrialCities: {
        [anchorageAlaska]: 1,
        [birminghamAlabama]: 1,
        [mobileAlabama]: 1,
        '': 1,
      },
      procedureTypes: {
        [PROCEDURE_TYPES_MAP.regular]: 2,
        [PROCEDURE_TYPES_MAP.small]: 1,
      },
      remoteTrialGranted: 1,
      representation: { proSe: 3, represented: 1 },
      sealed: 1,
      statuses: {
        [CASE_STATUS_TYPES.closed]: 1,
        [CASE_STATUS_TYPES.new]: 2,
      },
      total: 4,
    });
    const stats = logSpy.mock.calls[0][0];
    expect(Object.keys(stats.caseTypes)).toEqual([
      CASE_TYPES_MAP.cdp,
      CASE_TYPES_MAP.deficiency,
      CASE_TYPES_MAP.other,
    ]);
    expect(Object.keys(stats.filingTypes)).toEqual([
      FILING_TYPES_DICT.BUSINESS,
      FILING_TYPES_DICT.MYSELF,
      '',
    ]);
    expect(Object.keys(stats.judges)).toEqual(['Dredd', 'Judy', '']);
    expect(Object.keys(stats.preferredTrialCities)).toEqual([
      birminghamAlabama,
      mobileAlabama,
      anchorageAlaska,
      '',
    ]);
  });
});
