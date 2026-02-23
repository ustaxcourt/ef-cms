import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/docketEntry/addDocketEntryToCase',
);
import { MOCK_CASE } from '@shared/test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import {
  addPaperFilingInteractor,
  determineEntitiesToLock,
} from './addPaperFilingInteractor';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { docketClerkUser } from '@shared/test/mockUsers';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { addDocketEntryToCase as addDocketEntrytoCaseMock } from '@web-api/business/useCaseHelper/docketEntry/addDocketEntryToCase';
import { getConsolidatedCases as getConsolidatedCasesMock } from '@web-api/persistence/postgres/cases/getConsolidatedCases';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';

const getConsolidatedCases = getConsolidatedCasesMock as jest.Mock;
const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);
const addDocketEntryToCase = jest.mocked(addDocketEntrytoCaseMock);
const tryGetLocks = jest.mocked(tryGetLocksMock);
const getUserById = jest.mocked(getUserByIdMock);

describe('determineEntitiesToLock', () => {
  let mockParams;
  beforeEach(() => {
    mockParams = {
      applicationContext,
      consolidatedGroupDocketNumbers: [],
      documentMetadata: {
        docketNumber: MOCK_CASE.docketNumber,
      },
    };
  });
  it('should return an object that includes the subjectCaseDocketNumber in the identifiers', () => {
    mockParams.documentMetadata.docketNumber = '123-20';
    expect(
      determineEntitiesToLock(applicationContext, mockParams).identifiers,
    ).toContain('case|123-20');
  });
  it('should return an object that includes all of the docketNumbers specified in the identifiers', () => {
    mockParams.consolidatedGroupDocketNumbers = ['111-20', '222-20', '333-20'];
    expect(
      determineEntitiesToLock(applicationContext, mockParams).identifiers,
    ).toContain('case|111-20');
    expect(
      determineEntitiesToLock(applicationContext, mockParams).identifiers,
    ).toContain('case|222-20');
    expect(
      determineEntitiesToLock(applicationContext, mockParams).identifiers,
    ).toContain('case|333-20');
  });
});

describe('addPaperFilingInteractor', () => {
  const mockClientConnectionId = '987654';
  const mockCase = { ...MOCK_CASE, leadDocketNumber: MOCK_CASE.docketNumber };
  const mockRequest = {
    clientConnectionId: mockClientConnectionId,
    consolidatedGroupDocketNumbers: [],
    documentStorageId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    documentMetadata: {
      docketNumber: MOCK_CASE.docketNumber,
      documentTitle: 'Memorandum in Support',
      documentType: 'Memorandum in Support',
      eventCode: 'MISP',
      filedBy: 'Test Petitioner',
      isFileAttached: true,
      isPaper: true,
    },
    isSavingForLater: true,
  };

  beforeEach(() => {
    getUserById.mockResolvedValue(docketClerkUser as DbUser);
    getCasesByDocketNumbers.mockResolvedValue([mockCase]);
    addDocketEntryToCase.mockResolvedValue(undefined);
    getConsolidatedCases.mockResolvedValue([mockCase]);
  });

  describe('locked', () => {
    beforeEach(() => {
      tryGetLocks.mockResolvedValueOnce([
        { successfullyLocked: false, identifier: 'abc' },
      ]);
    });

    it('should throw a ServiceUnavailableError if a Case is currently locked', async () => {
      await expect(
        addPaperFilingInteractor(
          applicationContext,
          mockRequest,
          docketClerkUser,
        ),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(getCasesByDocketNumbers).not.toHaveBeenCalled();
    });
  });

  describe('not locked', () => {
    it('should acquire a lock and remove a lock', async () => {
      await addPaperFilingInteractor(
        applicationContext,
        mockRequest,
        docketClerkUser,
      );

      expect(tryGetLocks).toHaveBeenCalledWith(
        expect.objectContaining({
          identifiers: [`case|${mockCase.docketNumber}`],
        }),
      );
    });
  });
});
