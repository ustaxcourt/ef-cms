import { getRecentFilingsForUserInteractor } from './getRecentFilingsForUserInteractor';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  ROLES,
  PAYMENT_STATUS,
} from '@shared/business/entities/EntityConstants';
import { TAssociatedCase } from './getCasesForUserInteractor';

jest.mock('./getCasesForUserInteractor');

const mockGetCasesForUserInteractor = require('./getCasesForUserInteractor')
  .getCasesForUserInteractor as jest.MockedFunction<
  typeof import('./getCasesForUserInteractor').getCasesForUserInteractor
>;

const mockGetCasesByDocketNumbers = jest.fn();
const mockGetRecentFilingsByDocketNumbers = jest.fn();

const createMockCase = (
  overrides: Partial<TAssociatedCase> = {},
): TAssociatedCase => ({
  docketNumber: '101-20',
  leadDocketNumber: undefined,
  consolidatedCases: [],
  isRequestingUserAssociated: true,
  petitionPaymentStatus: PAYMENT_STATUS.PAID,
  caseCaption: 'Test Case Caption',
  createdAt: '2024-01-01T00:00:00Z',
  status: 'New',
  ...overrides,
});

const createMockDbDocketEntry = (overrides: any = {}) => ({
  docketEntryId: 'entry-1',
  docketNumber: '101-20',
  filingDate: '2024-01-15T05:00:00.000Z', // ISO string format
  documentTitle: 'Petition',
  isFileAttached: true,
  eventCode: 'P',
  isStricken: false,
  isSealed: false,
  sealedTo: null,
  servedAt: '2024-01-15T10:00:00.000Z', // ISO string format
  isDraft: false,
  caption: 'Test Case Caption', // Database returns 'caption', not 'caseCaption'
  caseIsSealed: false,
  caseDetails: createMockCaseDetails(
    '101-20',
    '02323349-87fe-4d29-91fe-8dd6916d2fda',
    true,
  ),
  ...overrides,
});

const createMockCaseDetails = (
  docketNumber: string,
  userId: string,
  isUserAssociated: boolean = true,
) =>
  ({
    docketNumber,
    petitioners: isUserAssociated ? [{ userId }] : [],
    privatePractitioners: [],
    irsPractitioners: [],
  }) as any;

describe('getRecentFilingsForUserInteractor', () => {
  let mockAuthorizedUser: UnknownAuthUser;
  let mockApplicationContext: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockAuthorizedUser = {
      userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
      name: 'Test User',
      role: ROLES.petitioner,
      email: 'test@example.com',
    } as UnknownAuthUser;

    mockApplicationContext = {
      getPersistenceGateway: () => ({
        getCasesByDocketNumbers: mockGetCasesByDocketNumbers,
        getRecentFilingsByDocketNumbers: mockGetRecentFilingsByDocketNumbers,
      }),
    };

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: [],
      closedCaseList: [],
    });

    mockGetCasesByDocketNumbers.mockResolvedValue([]);
    mockGetRecentFilingsByDocketNumbers.mockResolvedValue([]);
  });

  it('should throw UnauthorizedError for invalid user', async () => {
    await expect(
      getRecentFilingsForUserInteractor(mockApplicationContext, null as any),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should return empty array when user has no cases', async () => {
    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );
    expect(result).toEqual([]);
    expect(mockGetRecentFilingsByDocketNumbers).not.toHaveBeenCalled();
  });

  it('should return recent filings with case info', async () => {
    const mockCases = [createMockCase()];
    const mockDbResults = [createMockDbDocketEntry()];
    const mockCaseDetails = [
      createMockCaseDetails('101-20', mockAuthorizedUser!.userId, true),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });
    mockGetRecentFilingsByDocketNumbers.mockResolvedValue(mockDbResults);
    mockGetCasesByDocketNumbers.mockResolvedValue(mockCaseDetails);

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    expect(result).toEqual([
      {
        docketNumber: '101-20',
        filedDate: expect.any(String),
        document: 'Petition',
        caseTitle: 'Test Case Caption',
        docketEntryId: 'entry-1',
        isFileAttached: true,
        eventCode: 'P',
        isStricken: false,
        isSealed: false,
        sealedTo: null,
        servedAt: expect.any(String),
        caseIsSealed: false,
        inConsolidatedGroup: undefined,
        isLeadCase: true,
        consolidatedIconTooltipText: undefined,
        isRequestingUserAssociated: true,
      },
    ]);
  });

  it('should handle lead cases in consolidated groups', async () => {
    const mockCases = [
      createMockCase({
        consolidatedCases: [createMockCase({ docketNumber: '102-20' })],
      }),
    ];
    const mockDbResults = [createMockDbDocketEntry()];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });
    mockGetRecentFilingsByDocketNumbers.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    expect(result[0].inConsolidatedGroup).toBe(true);
    expect(result[0].isLeadCase).toBe(true);
    expect(result[0].consolidatedIconTooltipText).toContain('Lead case');
  });

  it('should handle member cases in consolidated groups', async () => {
    const mockCases = [
      createMockCase({
        docketNumber: '102-20',
        leadDocketNumber: '101-20',
      }),
    ];
    const mockDbResults = [createMockDbDocketEntry({ docketNumber: '102-20' })];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });
    mockGetRecentFilingsByDocketNumbers.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    expect(result[0].inConsolidatedGroup).toBe('101-20');
    expect(result[0].isLeadCase).toBe(false);
    expect(result[0].consolidatedIconTooltipText).toContain(
      'Consolidated case',
    );
  });

  it('should handle missing document title and case caption', async () => {
    const mockCases = [createMockCase()];
    const mockDbResults = [
      createMockDbDocketEntry({
        documentTitle: null,
        caption: '',
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });
    mockGetRecentFilingsByDocketNumbers.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    expect(result[0].document).toBe('Document');
    expect(result[0].caseTitle).toBe('Unknown Case');
  });

  it('should handle mixed open and closed cases', async () => {
    const mockOpenCases = [createMockCase({ docketNumber: '101-20' })];
    const mockClosedCases = [createMockCase({ docketNumber: '102-20' })];
    const mockDbResults = [
      createMockDbDocketEntry({ docketNumber: '101-20' }),
      createMockDbDocketEntry({ docketNumber: '102-20' }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockOpenCases,
      closedCaseList: mockClosedCases,
    });
    mockGetRecentFilingsByDocketNumbers.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    expect(result).toHaveLength(2);
    expect(result[0].docketNumber).toBe('101-20');
    expect(result[1].docketNumber).toBe('102-20');
  });

  it('should handle cases with all optional fields populated', async () => {
    const mockCases = [createMockCase()];
    const mockDbResults = [
      createMockDbDocketEntry({
        isFileAttached: false,
        isStricken: true,
        isSealed: true,
        sealedTo: 'public',
        servedAt: null,
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });
    mockGetRecentFilingsByDocketNumbers.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    expect(result[0].isFileAttached).toBe(false);
    expect(result[0].isStricken).toBe(true);
    expect(result[0].isSealed).toBe(true);
    expect(result[0].sealedTo).toBe('public');
    expect(result[0].servedAt).toBeNull();
  });

  it('should handle cases with empty consolidated cases array', async () => {
    const mockCases = [
      createMockCase({
        consolidatedCases: [],
      }),
    ];
    const mockDbResults = [createMockDbDocketEntry()];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });
    mockGetRecentFilingsByDocketNumbers.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    expect(result[0].inConsolidatedGroup).toBeUndefined();
    expect(result[0].isLeadCase).toBe(true);
    expect(result[0].consolidatedIconTooltipText).toBeUndefined();
  });

  it('should handle docket entries with case info not found in map', async () => {
    const mockCases = [createMockCase()];
    const mockDbResults = [
      createMockDbDocketEntry({
        docketNumber: '999-99', // Different from the case
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });
    mockGetRecentFilingsByDocketNumbers.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    expect(result[0].docketNumber).toBe('999-99');
    expect(result[0].inConsolidatedGroup).toBe(false);
    expect(result[0].isLeadCase).toBe(true);
    expect(result[0].consolidatedIconTooltipText).toBeUndefined();
  });

  it('should set isRequestingUserAssociated to false for cases where user is not a party', async () => {
    const mockCases = [createMockCase()];
    const mockDbResults = [
      createMockDbDocketEntry({
        caseDetails: createMockCaseDetails(
          '101-20',
          'different-user-id',
          false,
        ),
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });
    mockGetRecentFilingsByDocketNumbers.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    // Should return the document but mark user as not associated
    expect(result).toHaveLength(1);
    expect(result[0].docketNumber).toBe('101-20');
    expect(result[0].isRequestingUserAssociated).toBe(false);
  });

  it('should show documents from consolidated cases but mark non-party cases appropriately', async () => {
    const mockCases = [
      createMockCase({
        consolidatedCases: [createMockCase({ docketNumber: '102-20' })],
      }),
    ];
    const mockDbResults = [
      createMockDbDocketEntry({
        docketNumber: '101-20',
        caseDetails: createMockCaseDetails(
          '101-20',
          mockAuthorizedUser!.userId,
          true,
        ), // User is party
      }),
      createMockDbDocketEntry({
        docketNumber: '102-20',
        caseDetails: createMockCaseDetails(
          '102-20',
          'different-user-id',
          false,
        ), // User is NOT party
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });
    mockGetRecentFilingsByDocketNumbers.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    // Should return both documents but mark association appropriately
    expect(result).toHaveLength(2);

    const leadCaseResult = result.find(r => r.docketNumber === '101-20');
    const memberCaseResult = result.find(r => r.docketNumber === '102-20');

    expect(leadCaseResult?.isRequestingUserAssociated).toBe(true);
    expect(memberCaseResult?.isRequestingUserAssociated).toBe(false);
  });

  it('should include documents from all cases where user is a party in consolidated group', async () => {
    const mockCases = [
      createMockCase({
        docketNumber: '101-20',
        consolidatedCases: [createMockCase({ docketNumber: '102-20' })],
      }),
    ];
    const mockDbResults = [
      createMockDbDocketEntry({
        docketNumber: '101-20',
        caseDetails: createMockCaseDetails(
          '101-20',
          mockAuthorizedUser!.userId,
          true,
        ), // User is party to lead
      }),
      createMockDbDocketEntry({
        docketNumber: '102-20',
        caseDetails: createMockCaseDetails(
          '102-20',
          mockAuthorizedUser!.userId,
          true,
        ), // User is party to member
      }),
    ];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });
    mockGetRecentFilingsByDocketNumbers.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(
      mockApplicationContext,
      mockAuthorizedUser,
    );

    // Should return documents from both cases since user is party to both
    expect(result).toHaveLength(2);
    expect(result[0].isRequestingUserAssociated).toBe(true);
    expect(result[1].isRequestingUserAssociated).toBe(true);
  });
});
