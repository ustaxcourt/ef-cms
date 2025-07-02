import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/docketEntry/fileAndServeDocumentOnOneCase',
);
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { MOCK_CASE } from '@shared/test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  determineEntitiesToLock,
  editPaperFilingInteractor,
} from './editPaperFilingInteractor';
import { docketClerkUser } from '@shared/test/mockUsers';
import { getContactPrimary } from '@shared/business/entities/cases/Case';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { fileAndServeDocumentOnOneCase as fileAndServeDocumentOnOneCaseMock } from '@web-api/business/useCaseHelper/docketEntry/fileAndServeDocumentOnOneCase';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';

const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
const getUserById = getUserByIdMock as jest.Mock;

jest
  .mocked(updateCaseAndAssociationsMock)
  .mockImplementation(({ caseToUpdate }) => Promise.resolve(caseToUpdate));
const tryGetLocks = jest.mocked(tryGetLocksMock);

describe('determineEntitiesToLock', () => {
  let mockParams;
  const fileAndServeDocumentOnOneCase = jest.mocked(
    fileAndServeDocumentOnOneCaseMock,
  );
  beforeEach(() => {
    fileAndServeDocumentOnOneCase.mockImplementation(({ caseEntity }) =>
      Promise.resolve(caseEntity),
    );
    mockParams = {
      applicationContext,
      consolidatedGroupDocketNumbers: [],
      documentMetadata: {
        docketNumber: MOCK_CASE.docketNumber,
      },
    };
  });

  it('should return an object that includes the documentMetadata.docketNumber in the identifiers', () => {
    mockParams.documentMetadata.docketNumber = '123-20';
    expect(
      determineEntitiesToLock(applicationContext, mockParams).identifiers,
    ).toContain('case|123-20');
  });

  it('should return an object that includes all of the consolidatedGroupDocketNumbers specified in the identifiers', () => {
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

describe('editPaperFilingInteractor', () => {
  const mockClientConnectionId = '2810-happydoo';
  const mockDocketEntryId = '50107716-6d08-4693-bfd5-a07a4e6eadce';
  const mockPrimaryId = getContactPrimary(MOCK_CASE).contactId;
  const mockCase = {
    ...MOCK_CASE,
    docketEntries: [
      ...MOCK_CASE.docketEntries,
      {
        docketEntryId: mockDocketEntryId,
        docketNumber: MOCK_CASE.docketNumber,
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        filedByRole: 'petitioner',
        isFileAttached: true,
        userId: mockDocketEntryId,
      },
    ],
  };
  let mockRequest;

  beforeAll(() => {
    getUserById.mockReturnValue(docketClerkUser);
    getCaseByDocketNumber.mockImplementation(() => mockCase);
  });

  beforeEach(() => {
    mockRequest = {
      clientConnectionId: mockClientConnectionId,
      consolidatedGroupDocketNumbers: [],
      docketEntryId: mockDocketEntryId,
      documentMetadata: {
        docketNumber: mockCase.docketNumber,
        documentTitle: 'My Document',
        documentType: 'Memorandum in Support',
        eventCode: 'MISP',
        filers: [mockPrimaryId],
        isFileAttached: true,
      },
      isSavingForLater: false,
    };
  });

  describe('is locked', () => {
    beforeEach(() => {
      tryGetLocks.mockResolvedValueOnce([
        { successfullyLocked: false, identifier: 'abc' },
      ]);
    });

    it('should throw a ServiceUnavailableError if a Case is currently locked', async () => {
      await expect(
        editPaperFilingInteractor(
          applicationContext,
          mockRequest,
          mockDocketClerkUser,
        ),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(getCaseByDocketNumber).not.toHaveBeenCalled();
    });
  });

  describe('is not locked', () => {
    it('should acquire a lock on the case', async () => {
      await editPaperFilingInteractor(
        applicationContext,
        mockRequest,
        mockDocketClerkUser,
      );

      expect(tryGetLocks).toHaveBeenCalledWith(
        expect.objectContaining({
          identifiers: [`case|${MOCK_CASE.docketNumber}`],
        }),
      );
    });
  });
});
