import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import { MOCK_CASE } from '@shared/test/mockCase';
import { MOCK_LOCK } from '@shared/test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import {
  addPaperFilingInteractor,
  determineEntitiesToLock,
} from './addPaperFilingInteractor';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { docketClerkUser } from '@shared/test/mockUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCaseMetadataByDocketNumber as getCaseMetadataByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseMetadataByDocketNumber';
import { getCasesInConsolidatedGroup as getCasesInConsolidatedGroupMock } from '@web-api/persistence/postgres/cases/getCasesInConsolidatedGroup';

const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
const getCaseMetadataByDocketNumber =
  getCaseMetadataByDocketNumberMock as jest.Mock;
const getCasesInConsolidatedGroup =
  getCasesInConsolidatedGroupMock as jest.Mock;

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
  let mockLock;
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

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined; // unlocked
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    getCaseByDocketNumber.mockResolvedValue(mockCase);
    getCaseMetadataByDocketNumber.mockResolvedValue(mockCase);
    getCasesInConsolidatedGroup.mockResolvedValue([mockCase]);
  });

  describe('locked', () => {
    beforeEach(() => {
      mockLock = MOCK_LOCK;
    });

    it('should throw a ServiceUnavailableError if a Case is currently locked', async () => {
      await expect(
        addPaperFilingInteractor(
          applicationContext,
          mockRequest,
          docketClerkUser,
        ),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(getCaseByDocketNumber).not.toHaveBeenCalled();
    });
  });

  describe('not locked', () => {
    beforeEach(() => {
      mockLock = undefined;
    });

    it('should acquire a lock that lasts for 15 minutes', async () => {
      await addPaperFilingInteractor(
        applicationContext,
        mockRequest,
        docketClerkUser,
      );

      expect(
        applicationContext.getPersistenceGateway().createLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifier: `case|${mockCase.docketNumber}`,
        ttl: 900,
      });
    });
    it('should remove the lock', async () => {
      await addPaperFilingInteractor(
        applicationContext,
        mockRequest,
        docketClerkUser,
      );

      expect(
        applicationContext.getPersistenceGateway().removeLock,
      ).toHaveBeenCalledWith({
        applicationContext,
        identifiers: [`case|${mockCase.docketNumber}`],
      });
    });
  });
});
