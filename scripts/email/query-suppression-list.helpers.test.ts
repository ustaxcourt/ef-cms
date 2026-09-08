import {
  GetSuppressedDestinationCommand,
  ListSuppressedDestinationsCommand,
  SESv2Client,
} from '@aws-sdk/client-sesv2';
import { mockClient } from 'aws-sdk-client-mock';
import { calculateDate } from '@shared/business/utilities/DateHandler';

jest.mock('../helpers/generate-csv', () => ({
  generateCsv: jest.fn(),
}));

import { generateCsv as generateCsvMock } from '../helpers/generate-csv';
import {
  isNotFoundException,
  querySuppressionList,
  type SuppressionListEntry,
} from './query-suppression-list.helpers';

const sesMock = mockClient(SESv2Client);
const generateCsv = jest.mocked(generateCsvMock);
const originalHome = process.env.HOME;

class UnexpectedValue {}

const createSesClient = (): SESv2Client =>
  new SESv2Client({ region: 'us-east-1' });

describe('querySuppressionList', () => {
  beforeEach(() => {
    sesMock.reset();
    generateCsv.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
    jest.spyOn(console, 'table').mockImplementation(() => undefined);
    jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (originalHome === undefined) {
      delete process.env.HOME;
    } else {
      process.env.HOME = originalHome;
    }
  });

  it('uses an exact lookup for a full email address and prints the results', async () => {
    const lastUpdated = calculateDate({
      dateString: '2026-08-25T12:00:00.000Z',
    });
    sesMock.on(GetSuppressedDestinationCommand).resolves({
      SuppressedDestination: {
        EmailAddress: 'User@Example.gov',
        LastUpdateTime: lastUpdated,
        Reason: 'BOUNCE',
      },
    });

    const results = await querySuppressionList({
      emailAddress: 'User@Example.gov',
      exportResults: false,
      region: 'us-east-1',
    });

    const expectedResults: SuppressionListEntry[] = [
      {
        emailAddress: 'User@Example.gov',
        lastUpdated: lastUpdated.toISOString(),
        reason: 'BOUNCE',
      },
    ];
    expect(results).toEqual(expectedResults);
    expect(sesMock.commandCalls(GetSuppressedDestinationCommand)).toHaveLength(
      1,
    );
    expect(
      sesMock.commandCalls(GetSuppressedDestinationCommand)[0].args[0].input,
    ).toEqual({
      EmailAddress: 'User@Example.gov',
    });
    expect(
      sesMock.commandCalls(ListSuppressedDestinationsCommand),
    ).toHaveLength(0);
    expect(console.table).toHaveBeenCalledWith(expectedResults);
    expect(console.log).not.toHaveBeenCalled();
  });

  it('returns no results when an exact lookup has no response entry', async () => {
    sesMock.on(GetSuppressedDestinationCommand).resolves({});

    const results = await querySuppressionList({
      emailAddress: 'missing@example.com',
      exportResults: false,
      region: 'us-east-1',
      sesClient: createSesClient(),
    });

    expect(results).toEqual([]);
    expect(console.log).toHaveBeenCalledWith(
      'No suppressed destinations found matching "missing@example.com".',
    );
    expect(console.table).not.toHaveBeenCalled();
  });

  it('treats an exact lookup NotFoundException as no results', async () => {
    const notFoundError = Object.assign(new Error('not found'), {
      name: 'NotFoundException',
    });
    sesMock.on(GetSuppressedDestinationCommand).rejects(notFoundError);

    const results = await querySuppressionList({
      emailAddress: 'missing@example.com',
      exportResults: false,
      region: 'us-east-1',
      sesClient: createSesClient(),
    });

    expect(results).toEqual([]);
    expect(console.log).toHaveBeenCalledWith(
      'No suppressed destinations found matching "missing@example.com".',
    );
  });

  it('reports unexpected exact lookup errors and exits with a failure status', async () => {
    const error = new Error('SES is unavailable');
    sesMock.on(GetSuppressedDestinationCommand).rejects(error);

    await querySuppressionList({
      emailAddress: 'user@example.com',
      exportResults: false,
      region: 'us-east-1',
      sesClient: createSesClient(),
    });

    expect(console.error).toHaveBeenCalledWith('Error:', error);
    expect(process.exit).toHaveBeenCalledWith(1);
    expect(console.log).not.toHaveBeenCalled();
  });

  it('identifies only Error values with the NotFoundException name', () => {
    expect(
      isNotFoundException(
        Object.assign(new Error('not found'), {
          name: 'NotFoundException',
        }),
      ),
    ).toBe(true);
    expect(isNotFoundException(new Error('other error'))).toBe(false);
    expect(isNotFoundException(new UnexpectedValue())).toBe(false);
  });

  it('lists and filters all pages for a case-insensitive partial search', async () => {
    const firstLastUpdated = calculateDate({
      dateString: '2026-08-24T12:00:00.000Z',
    });
    const secondLastUpdated = calculateDate({
      dateString: '2026-08-23T12:00:00.000Z',
    });
    const thirdLastUpdated = calculateDate({
      dateString: '2026-08-22T12:00:00.000Z',
    });
    sesMock
      .on(ListSuppressedDestinationsCommand)
      .resolvesOnce({
        NextToken: 'page-2',
        SuppressedDestinationSummaries: [
          {
            EmailAddress: 'irs@ustc.gov',
            LastUpdateTime: firstLastUpdated,
            Reason: 'BOUNCE',
          },
          {
            EmailAddress: 'person@example.com',
            LastUpdateTime: secondLastUpdated,
            Reason: 'COMPLAINT',
          },
        ],
      })
      .resolvesOnce({
        SuppressedDestinationSummaries: [
          {
            EmailAddress: 'clerk@IRS.GOV',
            LastUpdateTime: thirdLastUpdated,
            Reason: 'COMPLAINT',
          },
        ],
      });

    const results = await querySuppressionList({
      emailAddress: '.gov',
      exportResults: false,
      region: 'us-east-1',
      sesClient: createSesClient(),
    });

    expect(results).toEqual([
      {
        emailAddress: 'irs@ustc.gov',
        lastUpdated: firstLastUpdated.toISOString(),
        reason: 'BOUNCE',
      },
      {
        emailAddress: 'clerk@IRS.GOV',
        lastUpdated: thirdLastUpdated.toISOString(),
        reason: 'COMPLAINT',
      },
    ]);
    const listCalls = sesMock.commandCalls(ListSuppressedDestinationsCommand);
    expect(listCalls).toHaveLength(2);
    expect(listCalls[1].args[0].input).toEqual({
      NextToken: 'page-2',
    });
    expect(console.table).toHaveBeenCalledWith(results);
  });

  it('matches a complete address with case-insensitive star and question-mark wildcards', async () => {
    sesMock.on(ListSuppressedDestinationsCommand).resolves({
      SuppressedDestinationSummaries: [
        {
          EmailAddress: 'person@IRS.gov',
          LastUpdateTime: calculateDate({
            dateString: '2026-08-21T12:00:00.000Z',
          }),
          Reason: 'BOUNCE',
        },
        {
          EmailAddress: 'person@IRSS.gov',
          LastUpdateTime: calculateDate({
            dateString: '2026-08-20T12:00:00.000Z',
          }),
          Reason: 'BOUNCE',
        },
        {
          EmailAddress: 'person@irs.gov.example.com',
          LastUpdateTime: calculateDate({
            dateString: '2026-08-19T12:00:00.000Z',
          }),
          Reason: 'COMPLAINT',
        },
      ],
    });

    const results = await querySuppressionList({
      emailAddress: '*@?rs.gov',
      exportResults: false,
      region: 'us-east-1',
      sesClient: createSesClient(),
    });

    expect(results).toHaveLength(1);
    expect(results[0].emailAddress).toBe('person@IRS.gov');
  });

  it('matches a single-character wildcard when it is the only wildcard', async () => {
    sesMock.on(ListSuppressedDestinationsCommand).resolves({
      SuppressedDestinationSummaries: [
        {
          EmailAddress: 'user1@example.com',
          LastUpdateTime: calculateDate({
            dateString: '2026-08-18T12:00:00.000Z',
          }),
          Reason: 'BOUNCE',
        },
        {
          EmailAddress: 'user12@example.com',
          LastUpdateTime: calculateDate({
            dateString: '2026-08-17T12:00:00.000Z',
          }),
          Reason: 'BOUNCE',
        },
      ],
    });

    const results = await querySuppressionList({
      emailAddress: 'user?@example.com',
      exportResults: false,
      region: 'us-east-1',
      sesClient: createSesClient(),
    });

    expect(results).toHaveLength(1);
    expect(results[0].emailAddress).toBe('user1@example.com');
  });

  it('handles missing list summaries and missing summary fields', async () => {
    sesMock.on(ListSuppressedDestinationsCommand).resolves({
      SuppressedDestinationSummaries: [
        {
          EmailAddress: undefined,
          LastUpdateTime: undefined,
          Reason: undefined,
        },
      ],
    });

    const results = await querySuppressionList({
      emailAddress: '.gov',
      exportResults: false,
      region: 'us-east-1',
      sesClient: createSesClient(),
    });

    expect(results).toEqual([]);
    expect(console.log).toHaveBeenCalledWith(
      'No suppressed destinations found matching ".gov".',
    );

    sesMock.reset();
    sesMock.on(ListSuppressedDestinationsCommand).resolves({});
    const emptyPageResults = await querySuppressionList({
      emailAddress: '.gov',
      exportResults: false,
      region: 'us-east-1',
      sesClient: createSesClient(),
    });

    expect(emptyPageResults).toEqual([]);
  });

  it('reports paginated list errors and exits with a failure status', async () => {
    const error = new Error('SES list failed');
    sesMock.on(ListSuppressedDestinationsCommand).rejects(error);

    await querySuppressionList({
      emailAddress: '.gov',
      exportResults: false,
      region: 'us-east-1',
      sesClient: createSesClient(),
    });

    expect(console.error).toHaveBeenCalledWith('Error:', error);
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('reports CSV export errors and exits with a failure status', async () => {
    const error = new Error('CSV export failed');
    generateCsv.mockImplementation(() => {
      throw error;
    });
    sesMock.on(GetSuppressedDestinationCommand).resolves({
      SuppressedDestination: {
        EmailAddress: 'user@example.com',
        LastUpdateTime: calculateDate({
          dateString: '2026-08-15T12:00:00.000Z',
        }),
        Reason: 'BOUNCE',
      },
    });

    await querySuppressionList({
      emailAddress: 'user@example.com',
      exportResults: true,
      region: 'us-east-1',
      sesClient: createSesClient(),
    });

    expect(console.error).toHaveBeenCalledWith('Error:', error);
    expect(process.exit).toHaveBeenCalledWith(1);
  });

  it('prints results and exports a CSV when requested', async () => {
    process.env.HOME = '/tmp/jest-home';
    const lastUpdated = calculateDate({
      dateString: '2026-08-16T12:00:00.000Z',
    });
    sesMock.on(GetSuppressedDestinationCommand).resolves({
      SuppressedDestination: {
        EmailAddress: 'user@example.com',
        LastUpdateTime: lastUpdated,
        Reason: 'BOUNCE',
      },
    });

    const results = await querySuppressionList({
      emailAddress: 'user@example.com',
      exportResults: true,
      region: 'us-east-1',
      sesClient: createSesClient(),
    });

    expect(console.table).toHaveBeenCalledWith(results);
    expect(generateCsv).toHaveBeenCalledWith({
      columns: [
        { header: 'Email Address', key: 'emailAddress' },
        { header: 'Reason', key: 'reason' },
        { header: 'Last Updated', key: 'lastUpdated' },
      ],
      filename:
        '/tmp/jest-home/Documents/suppression-list-user-example.com.csv',
      rows: results,
    });
    expect(console.log).toHaveBeenCalledWith(
      'Generated /tmp/jest-home/Documents/suppression-list-user-example.com.csv',
    );
  });
});
