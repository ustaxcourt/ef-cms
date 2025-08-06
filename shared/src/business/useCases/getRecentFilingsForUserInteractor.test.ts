import { getRecentFilingsForUserInteractor } from './getRecentFilingsForUserInteractor';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  ROLES,
  PAYMENT_STATUS,
} from '@shared/business/entities/EntityConstants';
import { TAssociatedCase } from './getCasesForUserInteractor';
import { SearchClientResultsType } from '@web-api/persistence/elasticsearch/searchClient';

jest.mock('./getCasesForUserInteractor');
jest.mock('@web-api/persistence/elasticsearch/searchClient');

const mockGetCasesForUserInteractor = require('./getCasesForUserInteractor')
  .getCasesForUserInteractor as jest.MockedFunction<
  typeof import('./getCasesForUserInteractor').getCasesForUserInteractor
>;

const mockSearch = require('@web-api/persistence/elasticsearch/searchClient')
  .search as jest.MockedFunction<
  typeof import('@web-api/persistence/elasticsearch/searchClient').search
>;

interface MockSearchResult {
  docketNumber: string;
  filingDate: string;
  documentTitle: string | null;
  caseCaption: string | null;
  docketEntryId: string;
  isFileAttached: boolean;
  eventCode: string;
  isStricken: boolean;
  isSealed: boolean;
  sealedTo: string | null;
  servedAt: string | null;
}

const TEST_DATA = {
  USER_ID: '02323349-87fe-4d29-91fe-8dd6916d2fda',
  USER_NAME: 'Test User',
  USER_EMAIL: 'test@example.com',
  DOCKET_NUMBERS: {
    CASE_1: '101-20',
    CASE_2: '102-20',
    CASE_3: '103-20',
  },
  DATES: {
    EARLY: '2024-01-10',
    MIDDLE: '2024-01-15',
    LATE: '2024-01-20',
  },
  DOCUMENTS: {
    PETITION: 'Petition',
    ANSWER: 'Answer',
  },
  CASE_TITLES: {
    TEST_CASE: 'Test Case',
    OPEN_CASE: 'Open Case',
    CLOSED_CASE: 'Closed Case',
  },
  DOCKET_ENTRY_IDS: {
    ENTRY_1: 'entry-1',
    ENTRY_2: 'entry-2',
  },
  EVENT_CODES: {
    PETITION: 'P',
    ANSWER: 'A',
  },
  SEALED_TO: 'public',
  SERVED_AT: '2024-01-15T10:00:00Z',
  SERVED_AT_EARLY: '2024-01-10T10:00:00Z',
  CASE_CAPTION: 'Test Case Caption',
  CREATED_AT: '2024-01-01T00:00:00Z',
  STATUS: 'New',
} as const;

const createMockCase = (
  overrides: Partial<TAssociatedCase> = {},
): TAssociatedCase => ({
  docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
  leadDocketNumber: undefined,
  consolidatedCases: [],
  isRequestingUserAssociated: true,
  petitionPaymentStatus: PAYMENT_STATUS.PAID,
  caseCaption: TEST_DATA.CASE_CAPTION,
  createdAt: TEST_DATA.CREATED_AT,
  status: TEST_DATA.STATUS,
  ...overrides,
});

const createMockSearchResult = (
  overrides: Partial<MockSearchResult> = {},
): MockSearchResult => ({
  docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
  filingDate: TEST_DATA.DATES.MIDDLE,
  documentTitle: TEST_DATA.DOCUMENTS.PETITION,
  caseCaption: TEST_DATA.CASE_TITLES.TEST_CASE,
  docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
  isFileAttached: true,
  eventCode: TEST_DATA.EVENT_CODES.PETITION,
  isStricken: false,
  isSealed: false,
  sealedTo: null,
  servedAt: TEST_DATA.SERVED_AT,
  ...overrides,
});

const createMockSearchResponse = (
  results: MockSearchResult[],
): SearchClientResultsType => ({
  results,
  total: results.length,
});

describe('getRecentFilingsForUserInteractor', () => {
  let mockApplicationContext: ServerApplicationContext;
  let mockAuthorizedUser: UnknownAuthUser;

  beforeEach(() => {
    jest.clearAllMocks();

    mockApplicationContext = {
      getUtilities: jest.fn().mockReturnValue({
        calculateISODate: jest.fn(),
      }),
    } as unknown as ServerApplicationContext;

    mockAuthorizedUser = {
      userId: TEST_DATA.USER_ID,
      name: TEST_DATA.USER_NAME,
      role: ROLES.petitioner,
      email: TEST_DATA.USER_EMAIL,
    } as UnknownAuthUser;

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: [],
      closedCaseList: [],
    });

    mockSearch.mockResolvedValue(createMockSearchResponse([]));
  });

  it('should throw UnauthorizedError for invalid user', async () => {
    const invalidUser = null as unknown as UnknownAuthUser;

    await expect(
      getRecentFilingsForUserInteractor(mockApplicationContext, invalidUser),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should return empty array when user has no cases', async () => {
    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: [],
      closedCaseList: [],
    });

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    expect(result).toEqual([]);
    expect(mockSearch).not.toHaveBeenCalled();
  });

  it('should return empty array when user has cases but no recent filings', async () => {
    const mockCases: TAssociatedCase[] = [
      createMockCase({ docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1 }),
      createMockCase({ docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_2 }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });

    mockSearch.mockResolvedValue(createMockSearchResponse([]));

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    expect(result).toEqual([]);
    expect(mockSearch).toHaveBeenCalledWith({
      applicationContext: mockApplicationContext,
      searchParameters: {
        body: {
          _source: [
            'docketNumber.S',
            'filingDate.S',
            'documentTitle.S',
            'caseCaption.S',
            'docketEntryId.S',
            'isFileAttached.BOOL',
            'eventCode.S',
            'isStricken.BOOL',
            'isSealed.BOOL',
            'sealedTo.S',
            'servedAt.S',
          ],
          query: {
            bool: {
              must: [
                {
                  terms: {
                    'docketNumber.S': [
                      TEST_DATA.DOCKET_NUMBERS.CASE_1,
                      TEST_DATA.DOCKET_NUMBERS.CASE_2,
                    ],
                  },
                },
                {
                  range: {
                    'filingDate.S': expect.objectContaining({
                      gte: expect.any(String),
                    }),
                  },
                },
              ],
              must_not: [
                {
                  term: {
                    'isStricken.BOOL': true,
                  },
                },
              ],
            },
          },
          sort: [
            {
              'filingDate.S': {
                order: 'desc',
              },
            },
          ],
          size: 1000,
        },
        index: 'efcms-docket-entry',
      },
    });
  });

  it('should return recent filings with case info for regular cases', async () => {
    const mockCases: TAssociatedCase[] = [
      createMockCase({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        leadDocketNumber: undefined,
        consolidatedCases: undefined,
      }),
    ];

    const mockSearchResults: MockSearchResult[] = [
      createMockSearchResult({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filingDate: TEST_DATA.DATES.MIDDLE,
        documentTitle: TEST_DATA.DOCUMENTS.PETITION,
        caseCaption: TEST_DATA.CASE_TITLES.TEST_CASE,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: TEST_DATA.SERVED_AT,
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });

    mockSearch.mockResolvedValue(createMockSearchResponse(mockSearchResults));

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    expect(result).toEqual([
      {
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filedDate: TEST_DATA.DATES.MIDDLE,
        document: TEST_DATA.DOCUMENTS.PETITION,
        caseTitle: TEST_DATA.CASE_TITLES.TEST_CASE,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: TEST_DATA.SERVED_AT,
        inConsolidatedGroup: undefined,
        isLeadCase: true,
        consolidatedIconTooltipText: undefined,
      },
    ]);
  });

  it('should handle lead cases in consolidated groups', async () => {
    const mockCases: TAssociatedCase[] = [
      createMockCase({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        consolidatedCases: [
          createMockCase({ docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_2 }),
          createMockCase({ docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_3 }),
        ],
      }),
    ];

    const mockSearchResults: MockSearchResult[] = [
      createMockSearchResult({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filingDate: TEST_DATA.DATES.MIDDLE,
        documentTitle: TEST_DATA.DOCUMENTS.PETITION,
        caseCaption: TEST_DATA.CASE_TITLES.TEST_CASE,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: TEST_DATA.SERVED_AT,
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });

    mockSearch.mockResolvedValue(createMockSearchResponse(mockSearchResults));

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    expect(result).toEqual([
      {
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filedDate: TEST_DATA.DATES.MIDDLE,
        document: TEST_DATA.DOCUMENTS.PETITION,
        caseTitle: TEST_DATA.CASE_TITLES.TEST_CASE,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: TEST_DATA.SERVED_AT,
        inConsolidatedGroup: true,
        isLeadCase: true,
        consolidatedIconTooltipText:
          'Lead case in consolidated group with 2 member cases',
      },
    ]);
  });

  it('should handle member cases in consolidated groups', async () => {
    const mockCases: TAssociatedCase[] = [
      createMockCase({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_2,
        leadDocketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
      }),
    ];

    const mockSearchResults: MockSearchResult[] = [
      createMockSearchResult({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_2,
        filingDate: TEST_DATA.DATES.MIDDLE,
        documentTitle: TEST_DATA.DOCUMENTS.ANSWER,
        caseCaption: TEST_DATA.CASE_TITLES.TEST_CASE,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.ANSWER,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: TEST_DATA.SERVED_AT,
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });

    mockSearch.mockResolvedValue(createMockSearchResponse(mockSearchResults));

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    expect(result).toEqual([
      {
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_2,
        filedDate: TEST_DATA.DATES.MIDDLE,
        document: TEST_DATA.DOCUMENTS.ANSWER,
        caseTitle: TEST_DATA.CASE_TITLES.TEST_CASE,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.ANSWER,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: TEST_DATA.SERVED_AT,
        inConsolidatedGroup: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        isLeadCase: false,
        consolidatedIconTooltipText: `Member case in consolidated group led by ${TEST_DATA.DOCKET_NUMBERS.CASE_1}`,
      },
    ]);
  });

  it('should handle cases with missing document title and case caption', async () => {
    const mockCases: TAssociatedCase[] = [
      createMockCase({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        leadDocketNumber: undefined,
        consolidatedCases: undefined,
      }),
    ];

    const mockSearchResults: MockSearchResult[] = [
      createMockSearchResult({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filingDate: TEST_DATA.DATES.MIDDLE,
        documentTitle: null,
        caseCaption: null,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: TEST_DATA.SERVED_AT,
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });

    mockSearch.mockResolvedValue(createMockSearchResponse(mockSearchResults));

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    expect(result).toEqual([
      {
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filedDate: TEST_DATA.DATES.MIDDLE,
        document: 'Document',
        caseTitle: 'Unknown Case',
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: TEST_DATA.SERVED_AT,
        inConsolidatedGroup: undefined,
        isLeadCase: true,
        consolidatedIconTooltipText: undefined,
      },
    ]);
  });

  it('should handle mixed open and closed cases', async () => {
    const mockOpenCases: TAssociatedCase[] = [
      createMockCase({ docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1 }),
    ];

    const mockClosedCases: TAssociatedCase[] = [
      createMockCase({ docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_2 }),
    ];

    const mockSearchResults: MockSearchResult[] = [
      createMockSearchResult({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filingDate: TEST_DATA.DATES.MIDDLE,
        documentTitle: TEST_DATA.DOCUMENTS.PETITION,
        caseCaption: TEST_DATA.CASE_TITLES.OPEN_CASE,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: TEST_DATA.SERVED_AT,
      }),
      createMockSearchResult({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_2,
        filingDate: TEST_DATA.DATES.EARLY,
        documentTitle: TEST_DATA.DOCUMENTS.ANSWER,
        caseCaption: TEST_DATA.CASE_TITLES.CLOSED_CASE,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_2,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.ANSWER,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: TEST_DATA.SERVED_AT_EARLY,
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockOpenCases,
      closedCaseList: mockClosedCases,
    });

    mockSearch.mockResolvedValue(createMockSearchResponse(mockSearchResults));

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    expect(result).toHaveLength(2);
    expect(result[0].docketNumber).toBe(TEST_DATA.DOCKET_NUMBERS.CASE_1);
    expect(result[1].docketNumber).toBe(TEST_DATA.DOCKET_NUMBERS.CASE_2);
  });

  it('should handle cases with all optional fields populated', async () => {
    const mockCases: TAssociatedCase[] = [
      createMockCase({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        leadDocketNumber: undefined,
        consolidatedCases: undefined,
      }),
    ];

    const mockSearchResults: MockSearchResult[] = [
      createMockSearchResult({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filingDate: TEST_DATA.DATES.MIDDLE,
        documentTitle: TEST_DATA.DOCUMENTS.PETITION,
        caseCaption: TEST_DATA.CASE_TITLES.TEST_CASE,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: false,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: true,
        isSealed: true,
        sealedTo: TEST_DATA.SEALED_TO,
        servedAt: null,
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });

    mockSearch.mockResolvedValue(createMockSearchResponse(mockSearchResults));

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    expect(result).toEqual([
      {
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filedDate: TEST_DATA.DATES.MIDDLE,
        document: TEST_DATA.DOCUMENTS.PETITION,
        caseTitle: TEST_DATA.CASE_TITLES.TEST_CASE,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: false,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: true,
        isSealed: true,
        sealedTo: TEST_DATA.SEALED_TO,
        servedAt: null,
        inConsolidatedGroup: undefined,
        isLeadCase: true,
        consolidatedIconTooltipText: undefined,
      },
    ]);
  });

  it('should handle cases with empty consolidated cases array', async () => {
    const mockCases: TAssociatedCase[] = [
      createMockCase({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        leadDocketNumber: undefined,
        consolidatedCases: [],
      }),
    ];

    const mockSearchResults: MockSearchResult[] = [
      createMockSearchResult({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filingDate: TEST_DATA.DATES.MIDDLE,
        documentTitle: TEST_DATA.DOCUMENTS.PETITION,
        caseCaption: TEST_DATA.CASE_TITLES.TEST_CASE,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: TEST_DATA.SERVED_AT,
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });

    mockSearch.mockResolvedValue(createMockSearchResponse(mockSearchResults));

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    expect(result[0].inConsolidatedGroup).toBeUndefined();
    expect(result[0].isLeadCase).toBe(true);
    expect(result[0].consolidatedIconTooltipText).toBeUndefined();
  });

  it('should handle cases with undefined consolidated cases', async () => {
    const mockCases: TAssociatedCase[] = [
      createMockCase({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        leadDocketNumber: undefined,
        consolidatedCases: undefined,
      }),
    ];

    const mockSearchResults: MockSearchResult[] = [
      createMockSearchResult({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filingDate: TEST_DATA.DATES.MIDDLE,
        documentTitle: TEST_DATA.DOCUMENTS.PETITION,
        caseCaption: TEST_DATA.CASE_TITLES.TEST_CASE,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: TEST_DATA.SERVED_AT,
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });

    mockSearch.mockResolvedValue(createMockSearchResponse(mockSearchResults));

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    expect(result[0].inConsolidatedGroup).toBeUndefined();
    expect(result[0].isLeadCase).toBe(true);
    expect(result[0].consolidatedIconTooltipText).toBeUndefined();
  });
});
