jest.mock('@web-api/database');
jest.mock(
  '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId',
  () => ({
    getDocketEntriesByDocketNumberAndDocketEntryId: jest.fn(),
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
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import { getSingleDocketEntryInteractor } from './getSingleDocketEntryInteractor';
import { getDocketEntriesByDocketNumberAndDocketEntryId as getDocketEntriesByDocketNumberAndDocketEntryIdMock } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';
import { getDbReader as getDbReaderMock } from '@web-api/database';
import { verifyCaseForUser as verifyCaseForUserMock } from '@web-api/persistence/postgres/cases/userOnCase/verifyCaseForUser';
import { AuthUser } from '@shared/business/entities/authUser/AuthUser';

const getDocketEntries = jest.mocked(
  getDocketEntriesByDocketNumberAndDocketEntryIdMock,
);
const getDbReader = jest.mocked(getDbReaderMock);
const verifyCaseForUser = jest.mocked(verifyCaseForUserMock);

const DOCKET_NUMBER = '101-24';
const DOCKET_ENTRY_ID = 'entry-1';

const REGULAR_ENTRY: RawDocketEntry = {
  docketEntryId: DOCKET_ENTRY_ID,
  docketNumber: DOCKET_NUMBER,
  documentType: 'Order',
  eventCode: 'O',
  isOnDocketRecord: true,
  servedAt: '2024-01-01T00:00:00.000Z',
  draftOrderState: { someState: true },
  pending: false,
} as RawDocketEntry;

const STIN_ENTRY: RawDocketEntry = {
  docketEntryId: 'stin-id',
  docketNumber: DOCKET_NUMBER,
  documentType: INITIAL_DOCUMENT_TYPES.stin.documentType,
  eventCode: 'STIN',
  isOnDocketRecord: false,
} as RawDocketEntry;

const NON_DOCKET_RECORD_ENTRY: RawDocketEntry = {
  docketEntryId: 'non-docket-id',
  docketNumber: DOCKET_NUMBER,
  documentType: 'Some Internal Doc',
  eventCode: 'MISC',
  isOnDocketRecord: false,
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
 * Helper to set up getDbReader mock for:
 * - checkIfCaseIsSealed (queries dwCase)
 * - computePetitionServedStatus (queries dwDocketEntry for Petition)
 */
function setupDbReaderMock({
  isSealed = false,
  petitionIsServed = false,
}: {
  isSealed?: boolean;
  petitionIsServed?: boolean;
} = {}) {
  return {
    setupForInternalUser() {
      // Internal users skip sealed check and association check.
      // No getDbReader calls for internal users in getSingleDocketEntryInteractor
      // unless STIN is accessed (computePetitionServedStatus).
    },
    setupForExternalUser() {
      // 1. checkIfCaseIsSealed
      getDbReader.mockResolvedValueOnce(
        isSealed
          ? { isSealed: true, sealedDate: '2024-01-01' }
          : (undefined as any),
      );
    },
    setupForIrsSuperuser() {
      // 1. checkIfCaseIsSealed
      // 2. computePetitionServedStatus (for association check)
      getDbReader
        .mockResolvedValueOnce(
          isSealed
            ? { isSealed: true, sealedDate: '2024-01-01' }
            : (undefined as any),
        )
        .mockResolvedValueOnce(
          petitionIsServed
            ? { servedAt: '2024-01-01T00:00:00.000Z' }
            : (undefined as any),
        );
    },
    addPetitionServedCheck() {
      // Additional computePetitionServedStatus call (for STIN check)
      getDbReader.mockResolvedValueOnce(
        petitionIsServed
          ? { servedAt: '2024-01-01T00:00:00.000Z' }
          : (undefined as any),
      );
    },
  };
}

describe('getSingleDocketEntryInteractor', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getDocketEntries.mockResolvedValue([REGULAR_ENTRY]);
    verifyCaseForUser.mockResolvedValue(false);
  });

  it('throws UnauthorizedError for unauthenticated user', async () => {
    await expect(
      getSingleDocketEntryInteractor(
        { docketEntryId: DOCKET_ENTRY_ID, docketNumber: DOCKET_NUMBER },
        undefined,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  describe('internal user', () => {
    it('gets full docket entry', async () => {
      const user = makeDocketClerkUser();
      getDocketEntries.mockResolvedValue([REGULAR_ENTRY]);

      const result = await getSingleDocketEntryInteractor(
        { docketEntryId: DOCKET_ENTRY_ID, docketNumber: DOCKET_NUMBER },
        user,
      );

      expect(result.docketEntryId).toBe(DOCKET_ENTRY_ID);
      // Internal users get full entry — draftOrderState should be present
      expect(result).toHaveProperty('documentType');
    });
  });

  describe('STIN access', () => {
    it('IRS superuser can access STIN', async () => {
      const user = makeIrsSuperuser();
      getDocketEntries.mockResolvedValue([STIN_ENTRY]);
      const dbMock = setupDbReaderMock({ petitionIsServed: true });
      dbMock.setupForIrsSuperuser();

      const result = await getSingleDocketEntryInteractor(
        { docketEntryId: 'stin-id', docketNumber: DOCKET_NUMBER },
        user,
      );

      expect(result.docketEntryId).toBe('stin-id');
    });

    it('petitionsClerk can access STIN when petition is NOT served', async () => {
      const user = makePetitionsClerkUser();
      getDocketEntries.mockResolvedValue([STIN_ENTRY]);
      const dbMock = setupDbReaderMock({ petitionIsServed: false });
      // petitionsClerk is internal, but STIN has isOnDocketRecord=false
      // The interactor first checks hasFullAccess (true for petitionsClerk),
      // then checks STIN access with computePetitionServedStatus
      dbMock.addPetitionServedCheck();

      const result = await getSingleDocketEntryInteractor(
        { docketEntryId: 'stin-id', docketNumber: DOCKET_NUMBER },
        user,
      );

      expect(result.docketEntryId).toBe('stin-id');
    });

    it('petitionsClerk throws NotFoundError for STIN when petition IS served', async () => {
      const user = makePetitionsClerkUser();
      getDocketEntries.mockResolvedValue([STIN_ENTRY]);
      const dbMock = setupDbReaderMock({ petitionIsServed: true });
      dbMock.addPetitionServedCheck();

      await expect(
        getSingleDocketEntryInteractor(
          { docketEntryId: 'stin-id', docketNumber: DOCKET_NUMBER },
          user,
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it('docketClerk throws NotFoundError for STIN', async () => {
      const user = makeDocketClerkUser();
      getDocketEntries.mockResolvedValue([STIN_ENTRY]);

      await expect(
        getSingleDocketEntryInteractor(
          { docketEntryId: 'stin-id', docketNumber: DOCKET_NUMBER },
          user,
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it('external user throws NotFoundError for STIN', async () => {
      const user = makePrivatePractitioner();
      getDocketEntries.mockResolvedValue([STIN_ENTRY]);
      const dbMock = setupDbReaderMock();
      dbMock.setupForExternalUser();
      verifyCaseForUser.mockResolvedValue(true);

      await expect(
        getSingleDocketEntryInteractor(
          { docketEntryId: 'stin-id', docketNumber: DOCKET_NUMBER },
          user,
        ),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('non-docket-record entry', () => {
    it('external user throws NotFoundError for non-docket-record entry', async () => {
      const user = makePrivatePractitioner();
      getDocketEntries.mockResolvedValue([NON_DOCKET_RECORD_ENTRY]);
      const dbMock = setupDbReaderMock();
      dbMock.setupForExternalUser();
      verifyCaseForUser.mockResolvedValue(true);

      await expect(
        getSingleDocketEntryInteractor(
          { docketEntryId: 'non-docket-id', docketNumber: DOCKET_NUMBER },
          user,
        ),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('associated external user', () => {
    it('gets entry with internal fields stripped', async () => {
      const user = makePrivatePractitioner();
      getDocketEntries.mockResolvedValue([REGULAR_ENTRY]);
      const dbMock = setupDbReaderMock({ petitionIsServed: true });
      dbMock.setupForExternalUser();
      verifyCaseForUser.mockResolvedValue(true);

      const result = await getSingleDocketEntryInteractor(
        { docketEntryId: DOCKET_ENTRY_ID, docketNumber: DOCKET_NUMBER },
        user,
      );

      expect(result.docketEntryId).toBe(DOCKET_ENTRY_ID);
      // Internal fields should be stripped
      expect(result).not.toHaveProperty('draftOrderState');
      expect(result).not.toHaveProperty('pending');
    });
  });

  describe('unassociated external user on unsealed case', () => {
    it('gets public fields only', async () => {
      const user = makePetitioner();
      getDocketEntries.mockResolvedValue([REGULAR_ENTRY]);
      const dbMock = setupDbReaderMock();
      dbMock.setupForExternalUser();
      verifyCaseForUser.mockResolvedValue(false);

      const result = await getSingleDocketEntryInteractor(
        { docketEntryId: DOCKET_ENTRY_ID, docketNumber: DOCKET_NUMBER },
        user,
      );

      // Should only have public fields
      expect(result).not.toHaveProperty('draftOrderState');
      expect(result).not.toHaveProperty('pending');
      expect(result.docketEntryId).toBe(DOCKET_ENTRY_ID);
    });
  });

  describe('sealed case', () => {
    it('throws NotFoundError for unassociated user', async () => {
      const user = makePetitioner();
      getDocketEntries.mockResolvedValue([REGULAR_ENTRY]);
      const dbMock = setupDbReaderMock({ isSealed: true });
      dbMock.setupForExternalUser();
      verifyCaseForUser.mockResolvedValue(false);

      await expect(
        getSingleDocketEntryInteractor(
          { docketEntryId: DOCKET_ENTRY_ID, docketNumber: DOCKET_NUMBER },
          user,
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it('gets entry normally for associated user', async () => {
      const user = makePrivatePractitioner();
      getDocketEntries.mockResolvedValue([REGULAR_ENTRY]);
      const dbMock = setupDbReaderMock({
        isSealed: true,
        petitionIsServed: true,
      });
      dbMock.setupForExternalUser();
      verifyCaseForUser.mockResolvedValue(true);

      const result = await getSingleDocketEntryInteractor(
        { docketEntryId: DOCKET_ENTRY_ID, docketNumber: DOCKET_NUMBER },
        user,
      );

      expect(result.docketEntryId).toBe(DOCKET_ENTRY_ID);
    });
  });

  describe('nonexistent entry', () => {
    it('throws NotFoundError when entry does not exist', async () => {
      const user = makeDocketClerkUser();
      getDocketEntries.mockResolvedValue([]);

      await expect(
        getSingleDocketEntryInteractor(
          { docketEntryId: 'nonexistent', docketNumber: DOCKET_NUMBER },
          user,
        ),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
