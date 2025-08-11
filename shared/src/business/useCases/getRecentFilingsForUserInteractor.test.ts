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
  filingDate: calculateDate({ dateString: '2024-01-15' }),
  documentTitle: 'Petition',
  isFileAttached: true,
  eventCode: 'P',
  isStricken: false,
  isSealed: false,
  sealedTo: null,
  servedAt: calculateDate({ dateString: '2024-01-15T10:00:00Z' }),
  caption: 'Test Case Caption',
  ...overrides,
});

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
      userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
      name: 'Test User',
      role: ROLES.petitioner,
      email: 'test@example.com',
    } as UnknownAuthUser;

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: [],
      closedCaseList: [],
    });
  });

  it('should throw UnauthorizedError for invalid user', async () => {
    await expect(
      getRecentFilingsForUserInteractor(null as any),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should return empty array when user has no cases', async () => {
    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);
    expect(result).toEqual([]);
    expect(mockGetDbReader).not.toHaveBeenCalled();
  });

  it('should return recent filings with case info', async () => {
    const mockCases = [createMockCase()];
    const mockDbResults = [createMockDbDocketEntry()];

    mockGetCasesForUserInteractor.mockResolvedValue({
      openCaseList: mockCases,
      closedCaseList: [],
    });
    mockDbReader.execute.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);

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
        inConsolidatedGroup: undefined,
        isLeadCase: true,
        consolidatedIconTooltipText: undefined,
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
    mockDbReader.execute.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);

    expect(result[0].inConsolidatedGroup).toBe(true);
    expect(result[0].isLeadCase).toBe(true);
    expect(result[0].consolidatedIconTooltipText).toContain(
      'Lead case in consolidated group',
    );
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
    mockDbReader.execute.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);

    expect(result[0].inConsolidatedGroup).toBe('101-20');
    expect(result[0].isLeadCase).toBe(false);
    expect(result[0].consolidatedIconTooltipText).toContain(
      'Member case in consolidated group',
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
    mockDbReader.execute.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);

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
    mockDbReader.execute.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);

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
    mockDbReader.execute.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);

    expect(result[0].isFileAttached).toBe(false);
    expect(result[0].isStricken).toBe(true);
    expect(result[0].isSealed).toBe(true);
    expect(result[0].sealedTo).toBe('public');
    expect(result[0].servedAt).toBeUndefined();
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
    mockDbReader.execute.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);

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
    mockDbReader.execute.mockResolvedValue(mockDbResults);

    const result = await getRecentFilingsForUserInteractor(mockAuthorizedUser);

    expect(result[0].docketNumber).toBe('999-99');
    expect(result[0].inConsolidatedGroup).toBe(false);
    expect(result[0].isLeadCase).toBe(true);
    expect(result[0].consolidatedIconTooltipText).toBeUndefined();
  });
});
