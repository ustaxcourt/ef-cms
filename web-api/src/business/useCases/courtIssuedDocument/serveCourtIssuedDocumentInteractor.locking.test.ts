import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/docketEntries/mocks.jest';
jest.mock('@web-api/business/useCases/addCoverToPdf');
jest.mock(
  '@web-api/business/useCaseHelper/docketEntry/fileAndServeDocumentOnOneCase',
);
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';
import { MOCK_CASE } from '@shared/test/mockCase';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { addCoverToPdf } from '@web-api/business/useCases/addCoverToPdf';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import {
  determineEntitiesToLock,
  serveCourtIssuedDocumentInteractor,
} from './serveCourtIssuedDocumentInteractor';
import { docketClerkUser } from '@shared/test/mockUsers';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { testPdfDoc } from '@shared/business/test/getFakeFile';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { fileAndServeDocumentOnOneCase as fileAndServeDocumentOnOneCaseMock } from '@web-api/business/useCaseHelper/docketEntry/fileAndServeDocumentOnOneCase';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';

const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);
const getUserById = getUserByIdMock as jest.Mock;
const tryGetLocks = jest.mocked(tryGetLocksMock);

describe('determineEntitiesToLock', () => {
  let mockParams;

  beforeEach(() => {
    mockParams = {
      applicationContext,
      docketNumbers: [],
      subjectCaseDocketNumber: MOCK_CASE.docketNumber,
    };
  });

  it('should return an object that includes the subjectCaseDocketNumber in the identifiers', () => {
    mockParams.subjectCaseDocketNumber = '123-20';
    expect(
      determineEntitiesToLock(applicationContext, mockParams).identifiers,
    ).toContain('case|123-20');
  });

  it('should return an object that includes all of the docketNumbers specified in the identifiers', () => {
    mockParams.docketNumbers = ['111-20', '222-20', '333-20'];
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

describe('serveCourtIssuedDocumentInteractor', () => {
  const fileAndServeDocumentOnOneCase = jest.mocked(
    fileAndServeDocumentOnOneCaseMock,
  );
  const mockClientConnectionId = '987654';
  const mockDocketEntryId = '225d5474-b02b-4137-a78e-2043f7a0f806';
  const mockPdfUrl = 'ayo.seankingston.com';
  const mockCase = {
    ...MOCK_CASE,
    docketEntries: [
      { docketEntryId: mockDocketEntryId, isOnDocketRecord: false },
    ],
  };

  const mockRequest = {
    clientConnectionId: mockClientConnectionId,
    docketEntryId: mockDocketEntryId,
    docketNumbers: [],
    subjectCaseDocketNumber: mockCase.docketNumber,
  };

  beforeAll(() => {
    (addCoverToPdf as jest.Mock).mockResolvedValue({
      pdfData: testPdfDoc,
    });
  });

  beforeEach(() => {
    fileAndServeDocumentOnOneCase.mockImplementation(
      ({ caseEntity }) => caseEntity,
    );

    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });

    getUserById.mockReturnValue(docketClerkUser);

    getCaseByDocketNumber.mockResolvedValue(mockCase);
    getCasesByDocketNumbers.mockResolvedValue([mockCase]);
  });

  describe('locked', () => {
    it('should throw a ServiceUnavailableError if a Case is currently locked', async () => {
      tryGetLocks.mockResolvedValueOnce([
        { successfullyLocked: false, identifier: 'abc' },
      ]);
      await expect(
        serveCourtIssuedDocumentInteractor(
          applicationContext,
          mockRequest,
          mockDocketClerkUser,
        ),
      ).rejects.toThrow(ServiceUnavailableError);

      expect(getCaseByDocketNumber).not.toHaveBeenCalled();
    });
  });

  describe('not locked', () => {
    it('should acquire and release a lock', async () => {
      await serveCourtIssuedDocumentInteractor(
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
