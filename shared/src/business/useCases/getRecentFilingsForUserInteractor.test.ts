import { getRecentFilingsForUserInteractor } from './getRecentFilingsForUserInteractor';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  ROLES,
  PAYMENT_STATUS,
} from '@shared/business/entities/EntityConstants';
import { TAssociatedCase } from './getCasesForUserInteractor';
import { calculateDate } from '../utilities/DateHandler';

jest.mock('./getCasesForUserInteractor');
jest.mock('@web-api/database');

const mockGetCasesForUserInteractor = require('./getCasesForUserInteractor')
  .getCasesForUserInteractor as jest.MockedFunction<
  typeof import('./getCasesForUserInteractor').getCasesForUserInteractor
>;

const mockGetDbReader = require('@web-api/database')
  .getDbReader as jest.MockedFunction<
  typeof import('@web-api/database').getDbReader
>;

interface MockDbDocketEntry {
  docketEntryId: string;
  docketNumber: string;
  filingDate: Date;
  documentTitle: string | null;
  isFileAttached: boolean | null;
  eventCode: string;
  isStricken: boolean | null;
  isSealed: boolean | null;
  sealedTo: string | null;
  servedAt: Date | null;
  caption: string | null;
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

const createMockDbDocketEntry = (
  overrides: Partial<MockDbDocketEntry> = {},
): MockDbDocketEntry => ({
  docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
  docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
  filingDate: calculateDate({ dateString: TEST_DATA.DATES.MIDDLE }),
  documentTitle: TEST_DATA.DOCUMENTS.PETITION,
  isFileAttached: true,
  eventCode: TEST_DATA.EVENT_CODES.PETITION,
  isStricken: false,
  isSealed: false,
  sealedTo: null,
  servedAt: calculateDate({ dateString: TEST_DATA.SERVED_AT }),
  caption: TEST_DATA.CASE_CAPTION,
  ...overrides,
});

const SHARED_MOCK_CASES: TAssociatedCase[] = [
  createMockCase({
    docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
    leadDocketNumber: undefined,
    consolidatedCases: undefined,
  }),
];

const SHARED_MOCK_DB_RESULTS: MockDbDocketEntry[] = [
  createMockDbDocketEntry({
    docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
    filingDate: calculateDate({ dateString: TEST_DATA.DATES.MIDDLE }),
    documentTitle: TEST_DATA.DOCUMENTS.PETITION,
    caption: TEST_DATA.CASE_CAPTION,
    docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
    isFileAttached: true,
    eventCode: TEST_DATA.EVENT_CODES.PETITION,
    isStricken: false,
    isSealed: false,
    sealedTo: null,
    servedAt: calculateDate({ dateString: TEST_DATA.SERVED_AT }),
  }),
];

describe('getRecentFilingsForUserInteractor', () => {
  let mockAuthorizedUser: UnknownAuthUser;
  let mockDbReader: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockDbReader = {
      selectFrom: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue([]),
    };

    mockGetDbReader.mockImplementation(
      async callback => await callback(mockDbReader),
    );

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
  });

  it('should throw UnauthorizedError for invalid user', async () => {
    const invalidUser = null as unknown as UnknownAuthUser;

    await expect(
      getRecentFilingsForUserInteractor(invalidUser),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should return empty array when user has no cases', async () => {
    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: [],
      closedCaseList: [],
    });

    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);

    expect(result).toEqual([]);
    expect(mockGetDbReader).not.toHaveBeenCalled();
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

    mockDbReader.execute.mockResolvedValue([]);

    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);

    expect(result).toEqual([]);
    expect(mockGetDbReader).toHaveBeenCalled();
    expect(mockDbReader.selectFrom).toHaveBeenCalledWith('dwDocketEntry as d');
    expect(mockDbReader.innerJoin).toHaveBeenCalledWith(
      'dwCase as c',
      'd.docketNumber',
      'c.docketNumber',
    );
    expect(mockDbReader.where).toHaveBeenCalledWith('d.docketNumber', 'in', [
      TEST_DATA.DOCKET_NUMBERS.CASE_1,
      TEST_DATA.DOCKET_NUMBERS.CASE_2,
    ]);
  });

  it('should return recent filings with case info for regular cases', async () => {
    const mockCases = SHARED_MOCK_CASES;
    const mockDbResults = SHARED_MOCK_DB_RESULTS;

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });

    mockDbReader.execute.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);

    expect(result).toEqual([
      {
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filedDate: calculateDate({
          dateString: TEST_DATA.DATES.MIDDLE,
        }).toISOString(),
        document: TEST_DATA.DOCUMENTS.PETITION,
        caseTitle: 'Test Case Caption',
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: false,
        isSealed: false,
        sealedTo: undefined,
        servedAt: calculateDate({
          dateString: TEST_DATA.SERVED_AT,
        }).toISOString(),
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

    const mockDbResults: MockDbDocketEntry[] = [
      createMockDbDocketEntry({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filingDate: calculateDate({ dateString: TEST_DATA.DATES.MIDDLE }),
        documentTitle: TEST_DATA.DOCUMENTS.PETITION,
        caption: TEST_DATA.CASE_CAPTION,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: calculateDate({ dateString: TEST_DATA.SERVED_AT }),
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });

    mockDbReader.execute.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);

    expect(result).toEqual([
      {
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filedDate: calculateDate({
          dateString: TEST_DATA.DATES.MIDDLE,
        }).toISOString(),
        document: TEST_DATA.DOCUMENTS.PETITION,
        caseTitle: 'Test Case Caption',
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: false,
        isSealed: false,
        sealedTo: undefined,
        servedAt: calculateDate({
          dateString: TEST_DATA.SERVED_AT,
        }).toISOString(),
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

    const mockDbResults: MockDbDocketEntry[] = [
      createMockDbDocketEntry({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_2,
        filingDate: calculateDate({ dateString: TEST_DATA.DATES.MIDDLE }),
        documentTitle: TEST_DATA.DOCUMENTS.ANSWER,
        caption: TEST_DATA.CASE_CAPTION,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.ANSWER,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: calculateDate({ dateString: TEST_DATA.SERVED_AT }),
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });

    mockDbReader.execute.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);

    expect(result).toEqual([
      {
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_2,
        filedDate: calculateDate({
          dateString: TEST_DATA.DATES.MIDDLE,
        }).toISOString(),
        document: TEST_DATA.DOCUMENTS.ANSWER,
        caseTitle: 'Test Case Caption',
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.ANSWER,
        isStricken: false,
        isSealed: false,
        sealedTo: undefined,
        servedAt: calculateDate({
          dateString: TEST_DATA.SERVED_AT,
        }).toISOString(),
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

    const mockDbResults: MockDbDocketEntry[] = [
      createMockDbDocketEntry({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filingDate: calculateDate({ dateString: TEST_DATA.DATES.MIDDLE }),
        documentTitle: null,
        caption: '',
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: calculateDate({ dateString: TEST_DATA.SERVED_AT }),
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });

    mockDbReader.execute.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);

    expect(result).toEqual([
      {
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filedDate: calculateDate({
          dateString: TEST_DATA.DATES.MIDDLE,
        }).toISOString(),
        document: 'Document',
        caseTitle: 'Unknown Case',
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: false,
        isSealed: false,
        sealedTo: undefined,
        servedAt: calculateDate({
          dateString: TEST_DATA.SERVED_AT,
        }).toISOString(),
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

    const mockDbResults: MockDbDocketEntry[] = [
      createMockDbDocketEntry({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filingDate: calculateDate({ dateString: TEST_DATA.DATES.MIDDLE }),
        documentTitle: TEST_DATA.DOCUMENTS.PETITION,
        caption: TEST_DATA.CASE_TITLES.OPEN_CASE,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: calculateDate({ dateString: TEST_DATA.SERVED_AT }),
      }),
      createMockDbDocketEntry({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_2,
        filingDate: calculateDate({ dateString: TEST_DATA.DATES.EARLY }),
        documentTitle: TEST_DATA.DOCUMENTS.ANSWER,
        caption: TEST_DATA.CASE_TITLES.CLOSED_CASE,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_2,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.ANSWER,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: calculateDate({ dateString: TEST_DATA.SERVED_AT_EARLY }),
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockOpenCases,
      closedCaseList: mockClosedCases,
    });

    mockDbReader.execute.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);

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

    const mockDbResults: MockDbDocketEntry[] = [
      createMockDbDocketEntry({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filingDate: calculateDate({ dateString: TEST_DATA.DATES.MIDDLE }),
        documentTitle: TEST_DATA.DOCUMENTS.PETITION,
        caption: TEST_DATA.CASE_CAPTION,
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

    mockDbReader.execute.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);

    expect(result).toEqual([
      {
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filedDate: calculateDate({
          dateString: TEST_DATA.DATES.MIDDLE,
        }).toISOString(),
        document: TEST_DATA.DOCUMENTS.PETITION,
        caseTitle: 'Test Case Caption',
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: false,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: true,
        isSealed: true,
        sealedTo: TEST_DATA.SEALED_TO,
        servedAt: undefined,
        inConsolidatedGroup: undefined,
        isLeadCase: true,
        consolidatedIconTooltipText: undefined,
      },
    ]);
  });

  it('should handle consolidated cases edge cases', async () => {
    const mockCases: TAssociatedCase[] = [
      createMockCase({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        leadDocketNumber: undefined,
        consolidatedCases: undefined,
      }),
    ];

    const mockDbResults: MockDbDocketEntry[] = [
      createMockDbDocketEntry({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        filingDate: calculateDate({ dateString: TEST_DATA.DATES.MIDDLE }),
        documentTitle: TEST_DATA.DOCUMENTS.PETITION,
        caption: TEST_DATA.CASE_CAPTION,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: calculateDate({ dateString: TEST_DATA.SERVED_AT }),
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });

    mockDbReader.execute.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);

    expect(result[0].inConsolidatedGroup).toBeUndefined();
    expect(result[0].isLeadCase).toBe(true);
    expect(result[0].consolidatedIconTooltipText).toBeUndefined();

    const mockCasesWithMissingInfo: TAssociatedCase[] = [
      createMockCase({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        leadDocketNumber: undefined,
        consolidatedCases: undefined,
      }),
    ];

    const mockDbResultsWithMissingInfo: MockDbDocketEntry[] = [
      createMockDbDocketEntry({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_2,
        filingDate: calculateDate({ dateString: TEST_DATA.DATES.MIDDLE }),
        documentTitle: TEST_DATA.DOCUMENTS.PETITION,
        caption: TEST_DATA.CASE_CAPTION,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: calculateDate({ dateString: TEST_DATA.SERVED_AT }),
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCasesWithMissingInfo,
      closedCaseList: [],
    });

    mockDbReader.execute.mockResolvedValue(mockDbResultsWithMissingInfo);

    const resultWithMissingInfo =
      await getRecentFilingsForUserInteractor(mockAuthorizedUser);

    expect(resultWithMissingInfo[0].inConsolidatedGroup).toBe(false);
    expect(resultWithMissingInfo[0].isLeadCase).toBe(true);
    expect(
      resultWithMissingInfo[0].consolidatedIconTooltipText,
    ).toBeUndefined();

    const mockCasesWithEmptyArray: TAssociatedCase[] = [
      createMockCase({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        leadDocketNumber: undefined,
        consolidatedCases: [],
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCasesWithEmptyArray,
      closedCaseList: [],
    });

    mockDbReader.execute.mockResolvedValue(mockDbResults);

    const resultWithEmptyArray =
      await getRecentFilingsForUserInteractor(mockAuthorizedUser);

    expect(resultWithEmptyArray[0].inConsolidatedGroup).toBeUndefined();
    expect(resultWithEmptyArray[0].isLeadCase).toBe(true);
    expect(resultWithEmptyArray[0].consolidatedIconTooltipText).toBeUndefined();
  });

  it('should handle docket entries with case info not found in map', async () => {
    const mockCases = SHARED_MOCK_CASES;
    const mockDbResults = [
      createMockDbDocketEntry({
        docketNumber: '999-99',
        filingDate: calculateDate({ dateString: TEST_DATA.DATES.MIDDLE }),
        documentTitle: TEST_DATA.DOCUMENTS.PETITION,
        caption: TEST_DATA.CASE_CAPTION,
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: calculateDate({ dateString: TEST_DATA.SERVED_AT }),
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });

    mockDbReader.execute.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);

    expect(result[0].docketNumber).toBe('999-99');
    expect(result[0].inConsolidatedGroup).toBe(false);
    expect(result[0].isLeadCase).toBe(true);
    expect(result[0].consolidatedIconTooltipText).toBeUndefined();
  });

  it('should handle consolidated cases edge cases and missing case info', async () => {
    const mockCases: TAssociatedCase[] = [
      createMockCase({
        docketNumber: TEST_DATA.DOCKET_NUMBERS.CASE_1,
        leadDocketNumber: undefined,
        consolidatedCases: undefined,
      }),
    ];

    const mockDbResults: MockDbDocketEntry[] = [
      createMockDbDocketEntry({
        docketNumber: '999-99',
        filingDate: calculateDate({ dateString: TEST_DATA.DATES.MIDDLE }),
        documentTitle: null,
        caption: '',
        docketEntryId: TEST_DATA.DOCKET_ENTRY_IDS.ENTRY_1,
        isFileAttached: true,
        eventCode: TEST_DATA.EVENT_CODES.PETITION,
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: calculateDate({ dateString: TEST_DATA.SERVED_AT }),
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });

    mockDbReader.execute.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      docketNumber: '999-99',
      document: 'Document',
      caseTitle: 'Unknown Case',
      inConsolidatedGroup: false,
      isLeadCase: true,
      consolidatedIconTooltipText: undefined,
    });
  });
});
