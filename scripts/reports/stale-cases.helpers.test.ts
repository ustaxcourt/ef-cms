jest.mock('@web-api/persistence/postgres/database', () => ({
  getDbReader: jest.fn(),
}));
jest.mock('@web-api/persistence/postgres/cases/mapper', () => ({
  fromKyselyCase: jest.fn(),
}));
jest.mock('../helpers/generate-csv', () => ({
  generateCsv: jest.fn(),
}));

import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import {
  createISODateString,
  getJsDateFromIso,
  subtractISODates,
} from '@shared/business/utilities/DateHandler';
import { fromKyselyCase as fromKyselyCaseMock } from '@web-api/persistence/postgres/cases/mapper';
import { generateCsv as generateCsvMock } from '../helpers/generate-csv';
import { generateStaleCasesReport } from './stale-cases.helpers';
import { getDbReader as getDbReaderMock } from '@web-api/persistence/postgres/database';

type QueryBuilder = {
  as: (alias: string) => { alias: string };
  execute: () => Promise<unknown[]>;
  limit: (...args: unknown[]) => QueryBuilder;
  orderBy: (...args: unknown[]) => QueryBuilder;
  select: (...args: unknown[]) => QueryBuilder;
  selectAll: (...args: unknown[]) => QueryBuilder;
  where: (...args: unknown[]) => QueryBuilder;
  whereRef: (...args: unknown[]) => QueryBuilder;
};

type MockReader = {
  selectFrom: (table: string) => QueryBuilder;
};

type StaleCaseRecord = {
  associatedJudge?: string;
  caseCaption?: string;
  docketNumber: string;
  docketNumberSuffix?: string;
  lastFilingDate?: Date;
  preferredTrialCity?: string;
  status: string;
};

const getDbReader = jest.mocked(getDbReaderMock);
const fromKyselyCase = jest.mocked(fromKyselyCaseMock);
const generateCsv = jest.mocked(generateCsvMock);

const getDateDaysAgo = (daysAgo: number): Date => {
  return getJsDateFromIso(
    subtractISODates(createISODateString(), { day: daysAgo }),
  );
};

const createQueryBuilder = (records: StaleCaseRecord[]): QueryBuilder => {
  const builder: QueryBuilder = {
    as: (alias: string): { alias: string } => ({ alias }),
    execute: (): Promise<unknown[]> => Promise.resolve(records),
    limit: (): QueryBuilder => builder,
    orderBy: (): QueryBuilder => builder,
    select: (...args: unknown[]): QueryBuilder => {
      const [firstArg] = args;
      if (typeof firstArg === 'function') {
        firstArg({
          selectFrom: (): QueryBuilder => createQueryBuilder(records),
        });
      }
      return builder;
    },
    selectAll: (): QueryBuilder => builder,
    where: (): QueryBuilder => builder,
    whereRef: (): QueryBuilder => builder,
  };

  return builder;
};

const setupReaderMock = (records: StaleCaseRecord[]): void => {
  const reader: MockReader = {
    selectFrom: (): QueryBuilder => createQueryBuilder(records),
  };

  getDbReader.mockImplementation(callback => {
    const typedCallback = callback as unknown as (
      db: MockReader,
    ) => Promise<unknown> | unknown;

    return Promise.resolve(typedCallback(reader));
  });
};

describe('stale-cases.helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    fromKyselyCase.mockImplementation(record => record);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('generates rows with docket number suffixes for stale cases', async () => {
    const staleCaseWithSuffix: StaleCaseRecord = {
      associatedJudge: 'Judge Buch',
      caseCaption: 'Alpha Petitioner,\nPetitioner',
      docketNumber: '101-26',
      docketNumberSuffix: 'S',
      lastFilingDate: getDateDaysAgo(400),
      preferredTrialCity: 'Mobile, Alabama',
      status: CASE_STATUS_TYPES.generalDocket,
    };
    const staleCaseWithoutSuffix: StaleCaseRecord = {
      associatedJudge: 'Judge Cohen',
      caseCaption: 'Beta Petitioner, Petitioner',
      docketNumber: '102-26',
      lastFilingDate: getDateDaysAgo(500),
      status: CASE_STATUS_TYPES.generalDocket,
    };
    const nonStaleCase: StaleCaseRecord = {
      associatedJudge: 'Judge Gale',
      caseCaption: 'Gamma Petitioner, Petitioner',
      docketNumber: '103-26',
      docketNumberSuffix: 'L',
      lastFilingDate: getDateDaysAgo(100),
      preferredTrialCity: 'Birmingham, Alabama',
      status: CASE_STATUS_TYPES.generalDocket,
    };
    const caseWithoutFilings: StaleCaseRecord = {
      associatedJudge: 'Judge Kerrigan',
      caseCaption: 'Delta Petitioner, Petitioner',
      docketNumber: '104-26',
      docketNumberSuffix: 'P',
      status: CASE_STATUS_TYPES.generalDocket,
    };

    setupReaderMock([
      staleCaseWithSuffix,
      staleCaseWithoutSuffix,
      nonStaleCase,
      caseWithoutFilings,
    ]);

    await generateStaleCasesReport({ filename: '/tmp/stale-cases.csv' });

    expect(fromKyselyCase).toHaveBeenCalledTimes(4);
    expect(generateCsv).toHaveBeenCalledWith({
      columns: [
        { header: 'Judge', key: 'judge' },
        { header: 'Docket Number', key: 'docketNumber' },
        { header: 'Caption', key: 'caption' },
        { header: 'Status', key: 'status' },
        { header: 'Last Filed', key: 'lastFilingDate' },
        { header: 'Age in Days', key: 'deAge' },
        { header: 'Preferred Trial City', key: 'preferredTrialCity' },
      ],
      filename: '/tmp/stale-cases.csv',
      rows: [
        expect.objectContaining({
          caption: 'Alpha Petitioner, Petitioner',
          docketNumber: '101-26S',
          judge: 'Buch',
          preferredTrialCity: 'Mobile, Alabama',
        }),
        expect.objectContaining({
          caption: 'Beta Petitioner, Petitioner',
          docketNumber: '102-26',
          judge: 'Cohen',
          preferredTrialCity: '',
        }),
      ],
    });
  });
});
