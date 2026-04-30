import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
jest.mock('@web-api/persistence/postgres/featureFlag/getMaintenanceMode');
import { MOCK_CASE_WITH_TRIAL_SESSION } from '@shared/test/mockCase';
import { MOCK_DOCUMENTS } from '@shared/test/mockDocketEntry';
import { getCaseDocketEntriesLambda } from './getCaseDocketEntriesLambda';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as mockGetCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

const mockCaseRecord = Object.assign({}, MOCK_CASE_WITH_TRIAL_SESSION, {
  entityName: 'Case',
  pk: 'case|101-18',
  sk: 'case|23',
});

const REQUEST_EVENT = {
  body: {},
  headers: {},
  path: '',
  pathParameters: {
    docketNumber: '123-30',
  },
  queryStringParameters: {},
};

describe('getCaseDocketEntriesLambda (v2)', () => {
  let CI;
  const getCaseByDocketNumber = jest.mocked(mockGetCaseByDocketNumber);

  beforeAll(() => {
    ({ CI } = process.env);
    process.env.CI = 'true';
  });

  afterAll(() => (process.env.CI = CI));

  it('returns 404 when the case is not found', async () => {
    getCaseByDocketNumber.mockResolvedValue({} as any);

    const response = await getCaseDocketEntriesLambda(
      REQUEST_EVENT,
      mockDocketClerkUser,
    );

    expect(response.statusCode).toBe(404);
    expect(response.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(response.body)).toHaveProperty(
      'message',
      expect.any(String),
    );
  });

  it('returns 500 on an unexpected error', async () => {
    getCaseByDocketNumber.mockRejectedValue(new Error('I had a problem :('));

    const response = await getCaseDocketEntriesLambda(
      REQUEST_EVENT,
      mockDocketClerkUser,
    );

    expect(response.statusCode).toBe(500);
    expect(response.headers['Content-Type']).toBe('application/json');
  });

  it('returns the first page of v2-marshalled docket entries with pagination metadata', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...mockCaseRecord,
      docketEntries: MOCK_DOCUMENTS,
    } as any);

    const response = await getCaseDocketEntriesLambda(
      REQUEST_EVENT,
      mockDocketClerkUser,
    );

    expect(response.statusCode).toBe('200');
    expect(response.headers['Content-Type']).toBe('application/json');

    const body = JSON.parse(response.body);
    expect(body).toMatchObject({
      page: 0,
      pageSize: 1000,
    });
    expect(body.totalCount).toBeGreaterThan(0);
    expect(body.docketEntries.length).toBe(body.totalCount);
    // Each entry should be in v2 marshalled shape — the v2 contract uses
    // `eventCodeDescription` instead of `documentType` and only exposes a
    // bounded set of fields. Anything outside that set would be a
    // breaking-contract addition.
    const allowedV2Keys = new Set([
      'docketEntryId',
      'docketNumber',
      'documentTitle',
      'eventCode',
      'eventCodeDescription',
      'filedBy',
      'filingDate',
      'index',
      'isFileAttached',
      'isSealed',
      'servedAt',
    ]);
    for (const entry of body.docketEntries) {
      expect(entry).toHaveProperty('docketEntryId');
      expect(entry).toHaveProperty('eventCodeDescription');
      for (const key of Object.keys(entry)) {
        expect(allowedV2Keys.has(key)).toBe(true);
      }
    }
  });

  it('defaults to page 0 when no page query parameter is provided', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...mockCaseRecord,
      docketEntries: MOCK_DOCUMENTS,
    } as any);

    const response = await getCaseDocketEntriesLambda(
      REQUEST_EVENT,
      mockDocketClerkUser,
    );

    expect(JSON.parse(response.body).page).toBe(0);
  });

  it('respects the page query parameter', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...mockCaseRecord,
      docketEntries: MOCK_DOCUMENTS,
    } as any);

    const response = await getCaseDocketEntriesLambda(
      {
        ...REQUEST_EVENT,
        queryStringParameters: { page: '1' },
      },
      mockDocketClerkUser,
    );

    const body = JSON.parse(response.body);
    expect(body.page).toBe(1);
    // MOCK_DOCUMENTS has fewer than 1000 entries so page 1 is empty
    expect(body.docketEntries).toEqual([]);
    expect(body.totalCount).toBeGreaterThan(0);
  });

  it('treats a non-numeric page query parameter as page 0', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...mockCaseRecord,
      docketEntries: MOCK_DOCUMENTS,
    } as any);

    const response = await getCaseDocketEntriesLambda(
      {
        ...REQUEST_EVENT,
        queryStringParameters: { page: 'not-a-number' },
      },
      mockDocketClerkUser,
    );

    expect(JSON.parse(response.body).page).toBe(0);
  });

  it('returns 500 (wrapped via v2ApiWrapper) when the requested page exceeds MAX_PAGE', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...mockCaseRecord,
      docketEntries: MOCK_DOCUMENTS,
    } as any);

    const response = await getCaseDocketEntriesLambda(
      {
        ...REQUEST_EVENT,
        queryStringParameters: { page: '999' },
      },
      mockDocketClerkUser,
    );

    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body)).toHaveProperty(
      'message',
      expect.stringContaining('Invalid page'),
    );
  });

  it('still returns 200 when the user is not associated with the case (auth handled by interactor)', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...mockCaseRecord,
      docketEntries: MOCK_DOCUMENTS,
    } as any);

    const response = await getCaseDocketEntriesLambda(
      REQUEST_EVENT,
      mockPetitionerUser,
    );

    expect(response.statusCode).toBe('200');
  });
});
