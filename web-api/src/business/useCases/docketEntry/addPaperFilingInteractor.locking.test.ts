import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
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
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { getConsolidatedCases as getConsolidatedCasesMock } from '@web-api/persistence/postgres/cases/getConsolidatedCases';
import { tryGetLock as tryGetLockMock } from '@web-api/persistence/postgres/utils/operation/tryGetLock';
import { releaseLock as releaseLockMock } from '@web-api/persistence/postgres/utils/operation/releaseLock';
import { hashLockId } from '@web-api/persistence/postgres/utils/mutex';

const getConsolidatedCases = getConsolidatedCasesMock as jest.Mock;
const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);
const updateCaseAndAssociations = jest.mocked(updateCaseAndAssociationsMock);
const tryGetLock = jest.mocked(tryGetLockMock);
const releaseLock = jest.mocked(releaseLockMock);

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
    docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    getCasesByDocketNumbers.mockResolvedValue([mockCase]);
    updateCaseAndAssociations.mockImplementation(({ caseToUpdate }) =>
      Promise.resolve(caseToUpdate),
    );
    getConsolidatedCases.mockResolvedValue([mockCase]);
  });

  describe('locked', () => {
    beforeEach(() => {
      tryGetLock.mockResolvedValue(false);
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
    beforeEach(() => {
      tryGetLock.mockResolvedValue(true);
    });

    it('should acquire a lock and remove a lock', async () => {
      await addPaperFilingInteractor(
        applicationContext,
        mockRequest,
        docketClerkUser,
      );

      expect(tryGetLock.mock.calls[0][1]).toEqual(
        hashLockId(`case|${mockCase.docketNumber}`),
      );

      expect(releaseLock.mock.calls[0][1]).toEqual(
        hashLockId(`case|${mockCase.docketNumber}`),
      );
    });
  });
});
