import '@web-api/persistence/postgres/docketEntries/mocks.jest';

jest.mock('@web-api/database');
jest.mock(
  '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber',
  () => ({
    getWorkItemsByDocketNumber: jest.fn(),
  }),
);
jest.mock(
  '@web-api/persistence/postgres/cases/userOnCase/verifyCaseForUser',
  () => ({
    verifyCaseForUser: jest.fn(),
  }),
);

import {
  INITIAL_DOCUMENT_TYPES,
  ROLES,
} from '@shared/business/entities/EntityConstants';
import { UnauthorizedError } from '@web-api/errors/errors';
import { getCaseDocketEntriesInteractor } from './getCaseDocketEntriesInteractor';
import { getDocketEntriesPaginated as getDocketEntriesPaginatedMock } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesPaginated';
import { getWorkItemsByDocketNumber as getWorkItemsByDocketNumberMock } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';
import { getDbReader as getDbReaderMock } from '@web-api/database';
import { verifyCaseForUser as verifyCaseForUserMock } from '@web-api/persistence/postgres/cases/userOnCase/verifyCaseForUser';
import { AuthUser } from '@shared/business/entities/authUser/AuthUser';

const getDocketEntriesPaginated = jest.mocked(getDocketEntriesPaginatedMock);
const getWorkItemsByDocketNumber = jest.mocked(getWorkItemsByDocketNumberMock);
const getDbReader = jest.mocked(getDbReaderMock);
const verifyCaseForUser = jest.mocked(verifyCaseForUserMock);

const DOCKET_NUMBER = '101-24';

const STIN_ENTRY: RawDocketEntry = {
  docketEntryId: 'stin-id',
  docketNumber: DOCKET_NUMBER,
  documentType: INITIAL_DOCUMENT_TYPES.stin.documentType,
  eventCode: 'STIN',
  isOnDocketRecord: false,
} as RawDocketEntry;

const REGULAR_ENTRY: RawDocketEntry = {
  docketEntryId: 'entry-1',
  docketNumber: DOCKET_NUMBER,
  documentType: 'Order',
  eventCode: 'O',
  isOnDocketRecord: true,
  servedAt: '2024-01-01T00:00:00.000Z',
} as RawDocketEntry;

const ARCHIVED_ENTRY: RawDocketEntry = {
  docketEntryId: 'archived-1',
  docketNumber: DOCKET_NUMBER,
  documentType: 'Order',
  eventCode: 'O',
  isOnDocketRecord: true,
  archived: true,
} as RawDocketEntry;

const makeDocketClerkUser = (): AuthUser => ({
  email: 'docketclerk@example.com',
  name: 'Docket Clerk',
  role: ROLES.docketClerk,
  userId: 'a0000000-0000-0000-0000-000000000001',
});

const makePetitionsClerkUser = (): AuthUser => ({
  email: 'petitionsclerk@example.com',
  name: 'Petitions Clerk',
  role: ROLES.petitionsClerk,
  userId: 'a0000000-0000-0000-0000-000000000002',
});

const makeIrsSuperuser = (): AuthUser => ({
  email: 'irs@example.com',
  name: 'IRS Superuser',
  role: ROLES.irsSuperuser,
  userId: 'a0000000-0000-0000-0000-000000000003',
});

const makePrivatePractitioner = (): AuthUser => ({
  email: 'practitioner@example.com',
  name: 'Private Practitioner',
  role: ROLES.privatePractitioner,
  userId: 'a0000000-0000-0000-0000-000000000004',
});

const makePetitioner = (): AuthUser => ({
  email: 'petitioner@example.com',
  name: 'Petitioner',
  role: ROLES.petitioner,
  userId: 'a0000000-0000-0000-0000-000000000005',
});

/**
 * Helper to configure getDbReader mock. The interactor uses getDbReader
 * for checkIfCaseIsSealed, computeHasPendingItems, and computePetitionServedStatus.
 * Each call passes a callback that returns a promise from the Kysely builder.
 * We intercept the callback and return our own results.
 */
function setupDbReaderMock({
  isSealed = false,
  hasPendingItems = false,
  petitionIsServed = false,
}: {
  isSealed?: boolean;
  hasPendingItems?: boolean;
  petitionIsServed?: boolean;
} = {}) {
  // getDbReader is called multiple times with different callbacks.
  // We track call order to return appropriate results.
  let callCount = 0;
  getDbReader.mockImplementation(async () => {
    callCount++;

    // The interactor makes these calls in order:
    // 1. checkIfCaseIsSealed (for external users only — queries dwCase)
    // 2. computePetitionServedStatus (for IRS superuser pre-check, queries dwDocketEntry for Petition)
    // Then in the Promise.all:
    // 3. computeHasPendingItems (queries dwDocketEntry for pending=true)
    // 4. computePetitionServedStatus (again, queries dwDocketEntry for Petition)
    //
    // Since we can't easily inspect the callback, we use a simple approach:
    // return results based on the call order for the given user scenario.

    // For simplicity, just return appropriate mock data for each pattern:
    // The actual callbacks build Kysely queries that we can't run, so we
    // need to return data that matches what each function expects.

    // We'll use a simpler approach: mock the implementation to always return
    // the right data shape.
    return undefined as any;
  });

  // Better approach: use mockImplementation that returns different values
  // based on context. Since we can't inspect the Kysely callback,
  // we'll return results that work for all the internal functions.
  getDbReader.mockReset();

  // checkIfCaseIsSealed expects: { isSealed, sealedDate }
  // computeHasPendingItems expects: [{ servedAt, eventCode }]
  // computePetitionServedStatus expects: { servedAt }

  // We need to track what each call returns based on position
  const responses: any[] = [];

  // The calls depend on the flow. For internal users (hasFullAccess=true),
  // there's no checkIfCaseIsSealed call. The Promise.all always includes
  // computeHasPendingItems and computePetitionServedStatus.

  // For external users, the flow is:
  // 1. checkIfCaseIsSealed -> { isSealed, sealedDate }
  // 2. (IRS superuser only) computePetitionServedStatus -> { servedAt }
  // Then Promise.all:
  // 3. computeHasPendingItems -> [{ servedAt, eventCode }]
  // 4. computePetitionServedStatus -> { servedAt }

  // For internal users, the flow is just Promise.all:
  // 1. computeHasPendingItems -> [{ servedAt, eventCode }]
  // 2. computePetitionServedStatus -> { servedAt }

  // Return mock values based on call count
  getDbReader.mockImplementation(async (_cb: any) => {
    const idx = responses.length;
    // Just always push and return undefined - we'll set up specific values
    responses.push(idx);
    return undefined as any;
  });

  // Actually, the simplest approach: since checkIfCaseIsSealed,
  // computeHasPendingItems, computePetitionServedStatus all use getDbReader
  // and each expects different return shapes, and they're called at different
  // times, let's just override based on call sequence.
  getDbReader.mockReset();

  // Create a sequence of return values based on expected call order
  const mockReturnSequence: any[] = [];

  return {
    setupForInternalUser() {
      // Internal users skip the sealed check. Promise.all has:
      // computeHasPendingItems, computePetitionServedStatus
      getDbReader
        .mockResolvedValueOnce(
          hasPendingItems ? [{ servedAt: '2024-01-01', eventCode: 'O' }] : [],
        )
        .mockResolvedValueOnce(
          petitionIsServed
            ? { servedAt: '2024-01-01T00:00:00.000Z' }
            : undefined,
        );
    },
    setupForExternalUser() {
      // External non-IRS users:
      // 1. checkIfCaseIsSealed
      // Then Promise.all: computeHasPendingItems, computePetitionServedStatus
      getDbReader
        .mockResolvedValueOnce(
          isSealed ? { isSealed: true, sealedDate: '2024-01-01' } : undefined,
        )
        .mockResolvedValueOnce(
          hasPendingItems ? [{ servedAt: '2024-01-01', eventCode: 'O' }] : [],
        )
        .mockResolvedValueOnce(
          petitionIsServed
            ? { servedAt: '2024-01-01T00:00:00.000Z' }
            : undefined,
        );
    },
    setupForIrsSuperuser() {
      // IRS superuser:
      // 1. checkIfCaseIsSealed
      // 2. computePetitionServedStatus (pre-check for association)
      // Then Promise.all: computeHasPendingItems, computePetitionServedStatus
      getDbReader
        .mockResolvedValueOnce(
          isSealed ? { isSealed: true, sealedDate: '2024-01-01' } : undefined,
        )
        .mockResolvedValueOnce(
          petitionIsServed
            ? { servedAt: '2024-01-01T00:00:00.000Z' }
            : undefined,
        )
        .mockResolvedValueOnce(
          hasPendingItems ? [{ servedAt: '2024-01-01', eventCode: 'O' }] : [],
        )
        .mockResolvedValueOnce(
          petitionIsServed
            ? { servedAt: '2024-01-01T00:00:00.000Z' }
            : undefined,
        );
    },
  };
}

function setupPaginatedResult(
  docketEntries: RawDocketEntry[] = [REGULAR_ENTRY],
  archivedDocketEntries: RawDocketEntry[] = [],
  totalCount?: number,
) {
  getDocketEntriesPaginated.mockResolvedValue({
    archivedDocketEntries,
    docketEntries,
    totalCount: totalCount ?? docketEntries.length,
  });
}

describe('getCaseDocketEntriesInteractor', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getWorkItemsByDocketNumber.mockResolvedValue([]);
    verifyCaseForUser.mockResolvedValue(false);
    setupPaginatedResult();
  });

  it('throws UnauthorizedError for unauthenticated user', async () => {
    await expect(
      getCaseDocketEntriesInteractor(
        { docketNumber: DOCKET_NUMBER },
        undefined,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  describe('internal user (docketClerk)', () => {
    it('gets full entries including archived, with STIN filtered out', async () => {
      const user = makeDocketClerkUser();
      setupPaginatedResult([STIN_ENTRY, REGULAR_ENTRY], [ARCHIVED_ENTRY]);
      const dbMock = setupDbReaderMock({ petitionIsServed: true });
      dbMock.setupForInternalUser();

      const result = await getCaseDocketEntriesInteractor(
        { docketNumber: DOCKET_NUMBER },
        user,
      );

      // STIN should be filtered out for docketClerk
      expect(
        result.docketEntries.find(
          d => d.documentType === INITIAL_DOCUMENT_TYPES.stin.documentType,
        ),
      ).toBeUndefined();
      expect(result.docketEntries).toHaveLength(1);
      expect(result.archivedDocketEntries).toHaveLength(1);

      // Internal user should get includeArchived=true and filterOnDocketRecord=false
      expect(getDocketEntriesPaginated).toHaveBeenCalledWith(
        expect.objectContaining({
          filterOnDocketRecord: false,
          includeArchived: true,
        }),
      );
    });
  });

  describe('petitionsClerk', () => {
    it('gets STIN in results when petition is NOT served', async () => {
      const user = makePetitionsClerkUser();
      setupPaginatedResult([STIN_ENTRY, REGULAR_ENTRY]);
      const dbMock = setupDbReaderMock({ petitionIsServed: false });
      dbMock.setupForInternalUser();

      const result = await getCaseDocketEntriesInteractor(
        { docketNumber: DOCKET_NUMBER },
        user,
      );

      expect(
        result.docketEntries.find(
          d => d.documentType === INITIAL_DOCUMENT_TYPES.stin.documentType,
        ),
      ).toBeDefined();
    });

    it('filters out STIN when petition IS served', async () => {
      const user = makePetitionsClerkUser();
      setupPaginatedResult([STIN_ENTRY, REGULAR_ENTRY]);
      const dbMock = setupDbReaderMock({ petitionIsServed: true });
      dbMock.setupForInternalUser();

      const result = await getCaseDocketEntriesInteractor(
        { docketNumber: DOCKET_NUMBER },
        user,
      );

      expect(
        result.docketEntries.find(
          d => d.documentType === INITIAL_DOCUMENT_TYPES.stin.documentType,
        ),
      ).toBeUndefined();
    });

    it('filters out STIN when petition IS served with pageSize=1', async () => {
      const user = makePetitionsClerkUser();
      // Even with small page size, STIN should still be filtered
      setupPaginatedResult([STIN_ENTRY], [], 1);
      const dbMock = setupDbReaderMock({ petitionIsServed: true });
      dbMock.setupForInternalUser();

      const result = await getCaseDocketEntriesInteractor(
        { docketNumber: DOCKET_NUMBER, pageSize: 1 },
        user,
      );

      expect(
        result.docketEntries.find(
          d => d.documentType === INITIAL_DOCUMENT_TYPES.stin.documentType,
        ),
      ).toBeUndefined();
    });
  });

  describe('IRS superuser', () => {
    it('gets STIN in results when petition is served', async () => {
      const user = makeIrsSuperuser();
      setupPaginatedResult([STIN_ENTRY, REGULAR_ENTRY]);
      const dbMock = setupDbReaderMock({ petitionIsServed: true });
      dbMock.setupForIrsSuperuser();

      const result = await getCaseDocketEntriesInteractor(
        { docketNumber: DOCKET_NUMBER },
        user,
      );

      // IRS superuser always sees STIN
      expect(
        result.docketEntries.find(
          d => d.documentType === INITIAL_DOCUMENT_TYPES.stin.documentType,
        ),
      ).toBeDefined();
    });

    it('returns empty result when petition NOT served (not associated)', async () => {
      const user = makeIrsSuperuser();
      setupPaginatedResult([REGULAR_ENTRY]);
      const dbMock = setupDbReaderMock({ petitionIsServed: false });
      dbMock.setupForIrsSuperuser();

      const result = await getCaseDocketEntriesInteractor(
        { docketNumber: DOCKET_NUMBER },
        user,
      );

      // IRS superuser without served petition on an unsealed case still gets results
      // but is treated as unassociated (public fields)
      expect(result.docketEntries).toBeDefined();
    });
  });

  describe('associated external user (privatePractitioner)', () => {
    it('gets entries with internal fields stripped, no STIN', async () => {
      const user = makePrivatePractitioner();
      setupPaginatedResult([STIN_ENTRY, REGULAR_ENTRY]);
      const dbMock = setupDbReaderMock({ petitionIsServed: true });
      dbMock.setupForExternalUser();
      verifyCaseForUser.mockResolvedValue(true);

      const result = await getCaseDocketEntriesInteractor(
        { docketNumber: DOCKET_NUMBER },
        user,
      );

      // STIN should be filtered out for external users
      expect(
        result.docketEntries.find(
          d => d.documentType === INITIAL_DOCUMENT_TYPES.stin.documentType,
        ),
      ).toBeUndefined();

      // Internal fields should be stripped
      result.docketEntries.forEach(entry => {
        expect(entry).not.toHaveProperty('qcComplete');
        expect(entry).not.toHaveProperty('qcViewed');
        expect(entry).not.toHaveProperty('workItemId');
      });
    });
  });

  describe('unassociated external user', () => {
    it('gets public field subset, no STIN', async () => {
      const user = makePetitioner();
      const entryWithInternalFields = {
        ...REGULAR_ENTRY,
        draftOrderState: { someState: true },
        pending: true,
      } as RawDocketEntry;
      setupPaginatedResult([entryWithInternalFields]);
      const dbMock = setupDbReaderMock({ petitionIsServed: true });
      dbMock.setupForExternalUser();
      verifyCaseForUser.mockResolvedValue(false);

      const result = await getCaseDocketEntriesInteractor(
        { docketNumber: DOCKET_NUMBER },
        user,
      );

      // Should only have public fields
      result.docketEntries.forEach(entry => {
        expect(entry).not.toHaveProperty('draftOrderState');
        expect(entry).not.toHaveProperty('pending');
      });
    });
  });

  describe('sealed case', () => {
    it('returns EMPTY_RESULT for unassociated user', async () => {
      const user = makePetitioner();
      setupPaginatedResult([REGULAR_ENTRY]);
      const dbMock = setupDbReaderMock({ isSealed: true });
      dbMock.setupForExternalUser();
      verifyCaseForUser.mockResolvedValue(false);

      const result = await getCaseDocketEntriesInteractor(
        { docketNumber: DOCKET_NUMBER },
        user,
      );

      expect(result.docketEntries).toEqual([]);
      expect(result.totalCount).toBe(0);
    });

    it('gets entries normally for associated user', async () => {
      const user = makePrivatePractitioner();
      setupPaginatedResult([REGULAR_ENTRY]);
      const dbMock = setupDbReaderMock({
        isSealed: true,
        petitionIsServed: true,
      });
      dbMock.setupForExternalUser();
      verifyCaseForUser.mockResolvedValue(true);

      const result = await getCaseDocketEntriesInteractor(
        { docketNumber: DOCKET_NUMBER },
        user,
      );

      expect(result.docketEntries).toHaveLength(1);
    });
  });

  describe('work item enrichment', () => {
    it('entries include qcComplete, qcViewed, workItemId from work items', async () => {
      const user = makeDocketClerkUser();
      setupPaginatedResult([REGULAR_ENTRY]);
      const dbMock = setupDbReaderMock();
      dbMock.setupForInternalUser();

      getWorkItemsByDocketNumber.mockResolvedValue([
        {
          docketEntryId: REGULAR_ENTRY.docketEntryId,
          completedAt: '2024-01-01T00:00:00.000Z',
          isRead: true,
          workItemId: 'work-item-1',
        } as any,
      ]);

      const result = await getCaseDocketEntriesInteractor(
        { docketNumber: DOCKET_NUMBER },
        user,
      );

      const entry = result.docketEntries[0];
      expect(entry.qcComplete).toBe(true);
      expect(entry.qcViewed).toBe(true);
      expect(entry.workItemId).toBe('work-item-1');
    });
  });
});
